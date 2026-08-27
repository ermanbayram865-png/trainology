import assert from "node:assert/strict";
import test from "node:test";

import {
  buildQuickHydrationGuide,
  calculateSweatRate,
  type HydrationEnvironment,
  type HydrationExerciseType,
  type PerceivedSweat,
  type SweatRateInput,
} from "../lib/calculators/index";

const baseMeasurement: SweatRateInput = {
  preWeightKg: 70.4,
  postWeightKg: 69.8,
  fluidConsumedMl: 500,
  durationMinutes: 60,
  exerciseType: "resistance",
  environment: "normal",
  urinationStatus: "no",
  standardAdultScope: true,
};

test("temel pre/post ölçümü seans kaybını ve L/saat değerini ham hassasiyetle hesaplar", () => {
  const result = calculateSweatRate(baseMeasurement);
  assert.equal(result.status, "ready");
  if (result.status === "ready") {
    assert.ok(Math.abs(result.bodyMassLossEquivalentLiters - 0.6) < 1e-12);
    assert.ok(Math.abs(result.estimatedSweatLossLiters - 1.1) < 1e-12);
    assert.ok(Math.abs(result.sweatRateLitersPerHour - 1.1) < 1e-12);
    assert.equal(result.durationHours, 1);
  }
});

test("idrar yok seçimi sıfır, idrar var seçimi girilen mL değerini kullanır", () => {
  const withoutUrine = calculateSweatRate(baseMeasurement);
  const withUrine = calculateSweatRate({
    ...baseMeasurement,
    urinationStatus: "yes",
    urineMl: 100,
  });
  if (withoutUrine.status === "ready" && withUrine.status === "ready") {
    assert.equal(withoutUrine.urineLiters, 0);
    assert.equal(withUrine.urineLiters, 0.1);
    assert.ok(Math.abs(withUrine.estimatedSweatLossLiters - 1) < 1e-12);
  } else {
    assert.fail("Geçerli ölçümler sonuç üretmelidir.");
  }
});

test("dakikayı saate çevirir ve seans kaybını süreye böler", () => {
  const result = calculateSweatRate({ ...baseMeasurement, durationMinutes: 120 });
  assert.equal(result.status, "ready");
  if (result.status === "ready") {
    assert.equal(result.durationHours, 2);
    assert.ok(Math.abs(result.sweatRateLitersPerHour - 0.55) < 1e-12);
  }
});

test("ondalıklı kilolar ve vücut ağırlığı değişim yüzdesi ara yuvarlama olmadan korunur", () => {
  const result = calculateSweatRate({
    ...baseMeasurement,
    preWeightKg: 72.35,
    postWeightKg: 71.92,
  });
  assert.equal(result.status, "ready");
  if (result.status === "ready") {
    assert.equal(result.bodyMassChangeKg, 72.35 - 71.92);
    assert.equal(result.bodyMassChangePercentage, ((72.35 - 71.92) / 72.35) * 100);
  }
});

test("egzersiz türü ve ortam hesaplanan sayıları değiştirmez", () => {
  const baseline = calculateSweatRate(baseMeasurement);
  assert.equal(baseline.status, "ready");
  if (baseline.status !== "ready") return;

  for (const exerciseType of ["resistance", "cardio_running", "team_sport", "other"] as const) {
    for (const environment of ["cool", "normal", "hot_humid"] as const) {
      const result = calculateSweatRate({ ...baseMeasurement, exerciseType, environment });
      assert.equal(result.status, "ready");
      if (result.status === "ready") {
        assert.equal(result.estimatedSweatLossLiters, baseline.estimatedSweatLossLiters);
        assert.equal(result.sweatRateLitersPerHour, baseline.sweatRateLitersPerHour);
      }
    }
  }
});

test("negatif, sıfır, non-finite ve eksik idrar girdileri fail-closed davranır", () => {
  const invalidInputs: SweatRateInput[] = [
    { ...baseMeasurement, preWeightKg: 0 },
    { ...baseMeasurement, postWeightKg: Number.NaN },
    { ...baseMeasurement, fluidConsumedMl: -1 },
    { ...baseMeasurement, durationMinutes: 0 },
    { ...baseMeasurement, durationMinutes: Number.POSITIVE_INFINITY },
    { ...baseMeasurement, urinationStatus: "yes", urineMl: undefined },
    { ...baseMeasurement, urinationStatus: "yes", urineMl: -1 },
    { ...baseMeasurement, exerciseType: "unknown" as HydrationExerciseType },
    { ...baseMeasurement, environment: "unknown" as HydrationEnvironment },
  ];
  for (const input of invalidInputs) assert.equal(calculateSweatRate(input).status, "invalid");
});

test("matematiksel olarak negatif ter kaybı sayısal sonuç üretmez", () => {
  const result = calculateSweatRate({
    ...baseMeasurement,
    preWeightKg: 70,
    postWeightKg: 71,
    fluidConsumedMl: 0,
  });
  assert.deepEqual(result, {
    status: "invalid",
    field: "estimatedSweatLoss",
    message: "Bu girdiler negatif veya geçersiz tahmini ter kaybı üretiyor. Ölçümleri kontrol et.",
  });
});

test("egzersiz safety kapsamı sayısal terleme sonucunu durdurur", () => {
  assert.deepEqual(calculateSweatRate({ ...baseMeasurement, standardAdultScope: false }), {
    status: "blocked",
    reason: "outside_standard_scope",
  });
});

test("hızlı rehber tüm ortam ve terleme durumlarında yalnız bağlamsal metin üretir", () => {
  for (const environment of ["cool", "normal", "hot_humid"] as const) {
    for (const perceivedSweat of ["low", "moderate", "high"] as const) {
      const result = buildQuickHydrationGuide({
        durationMinutes: 75,
        environment,
        perceivedSweat,
        standardAdultScope: true,
      });
      assert.equal(result.status, "ready");
      if (result.status === "ready") {
        assert.match(result.durationGuidance, /75 dakikalık/);
        const combined = `${result.summary} ${result.durationGuidance} ${result.environmentGuidance} ${result.sweatGuidance}`;
        assert.doesNotMatch(combined, /\d+(?:[.,]\d+)?\s*(?:L|mL)\s*\/?\s*(?:saat|gün)/i);
      }
    }
  }
});

test("hızlı rehber geçersiz enum, süre ve kapsam durumlarını reddeder", () => {
  assert.equal(buildQuickHydrationGuide({ durationMinutes: 0, environment: "normal", perceivedSweat: "moderate", standardAdultScope: true }).status, "invalid");
  assert.equal(buildQuickHydrationGuide({ durationMinutes: 60, environment: "unknown" as HydrationEnvironment, perceivedSweat: "moderate", standardAdultScope: true }).status, "invalid");
  assert.equal(buildQuickHydrationGuide({ durationMinutes: 60, environment: "normal", perceivedSweat: "unknown" as PerceivedSweat, standardAdultScope: true }).status, "invalid");
  assert.deepEqual(buildQuickHydrationGuide({ durationMinutes: 60, environment: "normal", perceivedSweat: "moderate", standardAdultScope: false }), {
    status: "blocked",
    reason: "outside_standard_scope",
  });
});
