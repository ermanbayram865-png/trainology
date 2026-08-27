import assert from "node:assert/strict";
import test from "node:test";

import {
  compareWithFFMIReference,
  FFMI_REFERENCE_DATA,
  getFFMIReferenceConfidence,
  getFFMIReferenceRow,
  getReferenceBand,
  interpretWithFFMISourceReference,
  type BodyFatMeasurementMethod,
} from "../lib/calculators/index";

const lockedRows = [
  ["men", 20, 29, "FFMI", 15.5, 16.3, 17.4, 18.6, 20.0, 21.5, 22.4],
  ["men", 30, 39, "FFMI", 16.1, 16.7, 17.8, 19.0, 20.3, 21.5, 22.5],
  ["men", 40, 49, "FFMI", 16.2, 16.7, 17.9, 19.0, 20.2, 21.5, 22.4],
  ["men", 50, 59, "FFMI", 16.1, 16.7, 17.6, 18.7, 19.8, 20.7, 21.5],
  ["men", 60, 69, "FFMI", 15.6, 16.0, 17.0, 18.1, 19.3, 20.1, 20.6],
  ["men", 70, 80, "FFMI", 14.8, 15.4, 16.3, 17.4, 18.4, 19.2, 19.6],
  ["women", 20, 29, "FFMI", 12.7, 13.1, 13.8, 14.7, 15.8, 17.1, 18.2],
  ["women", 30, 39, "FFMI", 13.3, 13.6, 14.3, 15.2, 16.2, 17.5, 18.6],
  ["women", 40, 49, "FFMI", 13.3, 13.7, 14.6, 15.4, 16.4, 17.8, 18.6],
  ["women", 50, 59, "FFMI", 13.6, 14.0, 14.7, 15.5, 16.6, 17.6, 18.3],
  ["women", 60, 69, "FFMI", 13.6, 14.1, 14.9, 15.8, 16.6, 17.6, 18.2],
  ["women", 70, 80, "FFMI", 13.5, 14.0, 14.6, 15.5, 16.5, 17.2, 17.7],
  ["men", 20, 29, "FMI", 2.5, 3.0, 4.1, 5.4, 7.7, 10.0, 12.0],
  ["men", 30, 39, "FMI", 3.0, 3.6, 4.6, 6.0, 7.7, 9.8, 11.4],
  ["men", 40, 49, "FMI", 3.3, 3.9, 5.0, 6.3, 7.8, 9.5, 10.8],
  ["men", 50, 59, "FMI", 3.4, 4.1, 4.9, 6.0, 7.4, 8.9, 10.1],
  ["men", 60, 69, "FMI", 3.1, 3.7, 4.8, 5.9, 7.1, 8.4, 9.3],
  ["men", 70, 80, "FMI", 3.2, 3.9, 5.0, 6.1, 7.4, 8.9, 9.7],
  ["women", 20, 29, "FMI", 4.0, 4.4, 5.2, 6.5, 8.6, 11.1, 13.0],
  ["women", 30, 39, "FMI", 4.0, 4.4, 5.4, 6.9, 8.9, 11.5, 13.3],
  ["women", 40, 49, "FMI", 4.1, 4.6, 5.7, 7.1, 8.9, 11.0, 12.7],
  ["women", 50, 59, "FMI", 4.7, 5.3, 6.5, 7.8, 9.5, 11.1, 12.5],
  ["women", 60, 69, "FMI", 4.8, 5.5, 6.8, 8.1, 9.7, 11.4, 12.6],
  ["women", 70, 80, "FMI", 5.0, 5.8, 7.0, 8.5, 10.2, 11.7, 12.8],
] as const;

test("kilitli dataset tam 24 production satırını ve exact percentile değerlerini içerir", () => {
  const actualRows = FFMI_REFERENCE_DATA.map((row) => [
    row.sex,
    row.ageMin,
    row.ageMax,
    row.metric,
    row.p5,
    row.p10,
    row.p25,
    row.p50,
    row.p75,
    row.p90,
    row.p95,
  ]);

  assert.deepEqual(actualRows, lockedRows);
  assert.equal(FFMI_REFERENCE_DATA.length, 24);
  assert.equal(FFMI_REFERENCE_DATA.some((row) => row.ageMin === 10), false);
  assert.equal(Object.isFrozen(FFMI_REFERENCE_DATA), true);
  assert.equal(FFMI_REFERENCE_DATA.every(Object.isFrozen), true);
});

test("dataset satırları sıralı, eksiksiz ve duplicate key içermiyor", () => {
  const keys = new Set<string>();

  for (const row of FFMI_REFERENCE_DATA) {
    const percentiles = [
      row.p5,
      row.p10,
      row.p25,
      row.p50,
      row.p75,
      row.p90,
      row.p95,
    ];
    assert.equal(percentiles.every(Number.isFinite), true);
    for (let index = 1; index < percentiles.length; index += 1) {
      assert.ok(percentiles[index] >= percentiles[index - 1]);
    }

    const key = [row.sex, row.ageMin, row.ageMax, row.metric].join(":");
    assert.equal(keys.has(key), false);
    keys.add(key);
  }

  assert.equal(keys.size, 24);
});

test("reference band sınırları exact inclusive/exclusive sözleşmeyi uygular", () => {
  const row = getFFMIReferenceRow(35, "men", "FFMI");
  assert.ok(row);

  assert.equal(getReferenceBand(row.p5 - 0.1, row), "below_p5");
  assert.equal(getReferenceBand(row.p5, row), "p5_p10");
  assert.equal(getReferenceBand(row.p10 - 1e-10, row), "p5_p10");
  assert.equal(getReferenceBand(row.p10, row), "p10_p25");
  assert.equal(getReferenceBand(row.p25, row), "p25_p50");
  assert.equal(getReferenceBand(row.p50, row), "p50_p75");
  assert.equal(getReferenceBand(row.p75, row), "p75_p90");
  assert.equal(getReferenceBand(row.p90, row), "p90_p95");
  assert.equal(getReferenceBand(row.p95, row), "p95_or_above");
  assert.equal(getReferenceBand(row.p95 + 0.1, row), "p95_or_above");
  assert.throws(() => getReferenceBand(Number.NaN, row), RangeError);
});

test("yaş eşlemesi yalnız kaynakta yayımlanmış production strata'larını döndürür", () => {
  const cases = [
    [19, undefined],
    [20, [20, 29]],
    [29, [20, 29]],
    [30, [30, 39]],
    [39, [30, 39]],
    [40, [40, 49]],
    [49, [40, 49]],
    [50, [50, 59]],
    [59, [50, 59]],
    [60, [60, 69]],
    [69, [60, 69]],
    [70, [70, 80]],
    [80, [70, 80]],
    [81, undefined],
  ] as const;

  for (const [age, expected] of cases) {
    const row = getFFMIReferenceRow(age, "women", "FMI");
    if (!expected) {
      assert.equal(row, undefined);
    } else {
      assert.ok(row);
      assert.deepEqual([row.ageMin, row.ageMax], expected);
    }
  }
});

test("35 yaş erkek referansı örneği interpolation olmadan iki band üretir", () => {
  const result = compareWithFFMIReference({
    ageYears: 35,
    sex: "men",
    measurementMethod: "bia_smart_scale",
    ffmi: 19.5,
    fmi: 5.0,
  });

  assert.equal(result.type, "SUCCESS");
  if (result.type !== "SUCCESS") return;
  assert.equal(result.comparison.ffmi.band, "p50_p75");
  assert.equal(result.comparison.fmi.band, "p25_p50");
  assert.deepEqual([result.comparison.ageMin, result.comparison.ageMax], [30, 39]);
  assert.equal("percentile" in result.comparison.ffmi, false);
});

test("measurement gate yalnız BIA / Akıllı Tartı yönteminde numeric comparison açar", () => {
  const methods: BodyFatMeasurementMethod[] = [
    "bia_smart_scale",
    "dexa",
    "skinfold",
    "visual_estimate",
    "other_unknown",
  ];

  for (const measurementMethod of methods) {
    const result = compareWithFFMIReference({
      ageYears: 35,
      sex: "men",
      measurementMethod,
      ffmi: 19.5,
      fmi: 5,
    });
    assert.equal(
      result.type,
      measurementMethod === "bia_smart_scale" ? "SUCCESS" : "UNAVAILABLE",
    );
    if (result.type === "UNAVAILABLE" && measurementMethod !== "bia_smart_scale") {
      assert.equal(result.reason, "unsupported_measurement_method");
    }
  }
});

test("source-specific confidence gate BIA'yı matched, DEXA ve skinfold'u approximate yorumlar", () => {
  assert.equal(getFFMIReferenceConfidence("bia_smart_scale"), "matched");
  assert.equal(getFFMIReferenceConfidence("dexa"), "approximate");
  assert.equal(getFFMIReferenceConfidence("skinfold"), "approximate");
  assert.equal(getFFMIReferenceConfidence("visual_estimate"), "unavailable");
  assert.equal(getFFMIReferenceConfidence("other_unknown"), "unavailable");
  assert.equal(getFFMIReferenceConfidence("unknown"), "unavailable");

  for (const measurementMethod of ["bia_smart_scale", "dexa", "skinfold"] as const) {
    const result = interpretWithFFMISourceReference({
      ageYears: 35,
      sex: "men",
      measurementMethod,
      ffmi: 19.5,
      fmi: 5,
    });
    assert.equal(result.type, "SUCCESS");
    if (result.type !== "SUCCESS") continue;
    assert.equal(
      result.confidence,
      measurementMethod === "bia_smart_scale" ? "matched" : "approximate",
    );
    assert.equal(result.comparison.ffmi.band, "p50_p75");
  }
});

test("visual estimate ve bilinmeyen yöntem source-specific numeric konum üretmez", () => {
  for (const measurementMethod of ["visual_estimate", "other_unknown", "unknown"] as const) {
    const result = interpretWithFFMISourceReference({
      ageYears: 35,
      sex: "women",
      measurementMethod,
      ffmi: 16,
      fmi: 7,
    });
    assert.deepEqual(result, {
      type: "UNAVAILABLE",
      confidence: "unavailable",
      reason: "unsupported_measurement_method",
    });
  }
});

test("comparator eksik/bilinmeyen kategori, kapsam dışı yaş ve geçersiz sayıyı reddeder", () => {
  const base = {
    ageYears: 35,
    sex: "men",
    measurementMethod: "bia_smart_scale" as const,
    ffmi: 19.5,
    fmi: 5,
  };

  assert.deepEqual(compareWithFFMIReference({ ...base, ageYears: 19 }), {
    type: "UNAVAILABLE",
    reason: "unsupported_age",
  });
  assert.deepEqual(compareWithFFMIReference({ ...base, ageYears: 35.5 }), {
    type: "UNAVAILABLE",
    reason: "unsupported_age",
  });
  assert.deepEqual(compareWithFFMIReference({ ...base, sex: "unknown" }), {
    type: "UNAVAILABLE",
    reason: "invalid_reference_category",
  });
  assert.deepEqual(compareWithFFMIReference({ ...base, ffmi: Number.NaN }), {
    type: "UNAVAILABLE",
    reason: "invalid_numeric_input",
  });
});
