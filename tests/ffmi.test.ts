import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateFFMI,
  formatFFMIDisplayValue,
  type BodyFatMeasurementMethod,
  type FFMIInput,
} from "../lib/calculators/index";

const baseInput: FFMIInput = {
  heightCm: 180,
  weightKg: 80,
  bodyFatPercentage: 20,
  measurementMethod: "dexa",
  standardAdultScope: true,
};

test("FFMI motoru yağ kütlesi, yağsız kütle, FFMI ve FMI formüllerini uygular", () => {
  const result = calculateFFMI(baseInput);
  assert.equal(result.type, "SUCCESS");
  if (result.type !== "SUCCESS") return;

  assert.equal(result.fatMassKg, 80 * (20 / 100));
  assert.equal(result.fatFreeMassKg, 80 - 80 * (20 / 100));
  assert.equal(result.ffmi, (80 - 80 * (20 / 100)) / (180 / 100) ** 2);
  assert.equal(result.fmi, (80 * (20 / 100)) / (180 / 100) ** 2);
  assert.equal(result.metadata.method, "standard_ffmi");
  assert.equal(result.metadata.intermediateRounding, false);
  assert.equal(result.metadata.classificationProduced, false);
  assert.equal(result.metadata.normalizedFFMIProduced, false);
});

test("ondalıklı girdiler ara yuvarlama yapılmadan full precision korunur", () => {
  const input = {
    ...baseInput,
    heightCm: 177.7,
    weightKg: 83.37,
    bodyFatPercentage: 17.35,
  };
  const result = calculateFFMI(input);
  assert.equal(result.type, "SUCCESS");
  if (result.type !== "SUCCESS") return;

  const expectedFatMass = input.weightKg * (input.bodyFatPercentage / 100);
  const expectedFatFreeMass = input.weightKg - expectedFatMass;
  assert.equal(result.fatMassKg, expectedFatMass);
  assert.equal(result.fatFreeMassKg, expectedFatFreeMass);
  assert.equal(result.ffmi, expectedFatFreeMass / (input.heightCm / 100) ** 2);
  assert.equal(result.fmi, expectedFatMass / (input.heightCm / 100) ** 2);
  assert.notEqual(result.fatMassKg, Number(result.fatMassKg.toFixed(1)));
});

test("görünür FFMI değerleri bir ondalık ve Türkçe ayırıcıyla biçimlenir", () => {
  assert.equal(formatFFMIDisplayValue(21.84), "21,8");
  assert.equal(formatFFMIDisplayValue(58.95), "59,0");
  assert.throws(() => formatFFMIDisplayValue(Number.NaN), RangeError);
});

test("ölçüm yöntemi hesap formülünü veya sayısal sonucu değiştirmez", () => {
  const methods: BodyFatMeasurementMethod[] = [
    "dexa",
    "bia_smart_scale",
    "skinfold",
    "visual_estimate",
    "other_unknown",
  ];
  const results = methods.map((measurementMethod) =>
    calculateFFMI({ ...baseInput, measurementMethod }),
  );
  for (const result of results) assert.equal(result.type, "SUCCESS");

  const numericResults = results.map((result) => {
    assert.equal(result.type, "SUCCESS");
    if (result.type !== "SUCCESS") throw new Error("Expected success");
    return [result.fatMassKg, result.fatFreeMassKg, result.ffmi, result.fmi];
  });
  for (const values of numericResults.slice(1)) {
    assert.deepEqual(values, numericResults[0]);
  }
});

test("yaş ve referans kategorisi FFMI hesap sonucunu değiştirmez", () => {
  const baseline = calculateFFMI(baseInput);
  const inputWithInterpretationFields = {
    ...baseInput,
    ageYears: 35,
    referenceSex: "women",
  };
  const withInterpretationInputs = calculateFFMI(inputWithInterpretationFields);

  assert.deepEqual(withInterpretationInputs, baseline);
});

test("motor eksik, non-finite, sıfır, negatif ve teknik sınır dışı sayıları reddeder", () => {
  const invalidInputs: Array<Partial<FFMIInput> | null | undefined> = [
    undefined,
    null,
    {},
    { ...baseInput, heightCm: Number.NaN },
    { ...baseInput, heightCm: Number.POSITIVE_INFINITY },
    { ...baseInput, heightCm: 0 },
    { ...baseInput, heightCm: -180 },
    { ...baseInput, weightKg: 0 },
    { ...baseInput, weightKg: -80 },
    { ...baseInput, weightKg: Number.MAX_VALUE },
    { ...baseInput, bodyFatPercentage: 0 },
    { ...baseInput, bodyFatPercentage: -1 },
    { ...baseInput, bodyFatPercentage: 100 },
  ];

  for (const input of invalidInputs) {
    assert.deepEqual(calculateFFMI(input), { type: "VALIDATION_ERROR" });
  }
});

test("motor bilinmeyen enum ve eksik boolean değerlerini sessizce kabul etmez", () => {
  assert.equal(
    calculateFFMI({
      ...baseInput,
      measurementMethod: "unknown" as BodyFatMeasurementMethod,
    }).type,
    "VALIDATION_ERROR",
  );
  assert.equal(
    calculateFFMI({ ...baseInput, standardAdultScope: "yes" as never }).type,
    "VALIDATION_ERROR",
  );
});

test("standart yetişkin kapsamı onaylanmadığında sayısal sonuç üretilmez", () => {
  assert.deepEqual(calculateFFMI({ ...baseInput, standardAdultScope: false }), {
    type: "NO_NUMERIC_RESULT",
    reason: "outside_standard_adult_scope",
  });
});
