import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateOneRepMax,
  calculateTrainingLoad,
  formatKilograms,
} from "../lib/calculators/index";

function expectOneRepMax(weightKg: number, repetitions: number) {
  const result = calculateOneRepMax({ weightKg, repetitions });
  assert.equal(result.type, "RESULT");
  if (result.type !== "RESULT") throw new Error("1RM sonucu bekleniyordu.");
  return result;
}

function expectTrainingLoad(oneRepMaxKg: number, percentage: number) {
  const result = calculateTrainingLoad({ oneRepMaxKg, percentage });
  assert.equal(result.type, "RESULT");
  if (result.type !== "RESULT") throw new Error("Antrenman yükü sonucu bekleniyordu.");
  return result;
}

test("1 tekrar kaldırılan ağırlığa tam olarak eşittir", () => {
  const result = expectOneRepMax(100, 1);
  assert.equal(result.rawEstimatedOneRepMaxKg, 100);
  assert.equal(result.calculationMethod, "direct");
  assert.equal(result.resultType, "direct_single_load");
  assert.equal(result.uncertaintyLevel, "single_rep_context");
});

test("2–10 tekrarda Lombardi ham sonucu tam hassasiyetle hesaplanır", () => {
  const fiveReps = expectOneRepMax(100, 5);
  const eightReps = expectOneRepMax(80, 8);
  const tenReps = expectOneRepMax(60, 10);
  const decimalWeight = expectOneRepMax(82.5, 5);

  assert.equal(fiveReps.rawEstimatedOneRepMaxKg, 100 * 5 ** 0.1);
  assert.equal(eightReps.rawEstimatedOneRepMaxKg, 80 * 8 ** 0.1);
  assert.equal(tenReps.rawEstimatedOneRepMaxKg, 60 * 10 ** 0.1);
  assert.equal(decimalWeight.rawEstimatedOneRepMaxKg, 82.5 * 5 ** 0.1);
  assert.equal(fiveReps.calculationMethod, "lombardi");
  assert.equal(fiveReps.uncertaintyLevel, "standard");
  assert.equal(eightReps.uncertaintyLevel, "elevated");
  assert.match(eightReps.warnings.join(" "), /belirsizliği artabilir/);
});

test("1RM görünür sonucu yalnız sunumda bir ondalığa yuvarlanır", () => {
  const result = expectOneRepMax(100, 5);
  assert.equal(formatKilograms(result.rawEstimatedOneRepMaxKg, 1), "117,5");
  assert.notEqual(result.rawEstimatedOneRepMaxKg, 117.5);
});

test("1RM motoru sınır üstü, ondalıklı, sıfır ve negatif girdileri reddeder", () => {
  for (const input of [
    { weightKg: 60, repetitions: 11 },
    { weightKg: 100, repetitions: 5.5 },
    { weightKg: 0, repetitions: 5 },
    { weightKg: -50, repetitions: 5 },
  ]) {
    assert.equal(calculateOneRepMax(input).type, "VALIDATION_ERROR");
  }

  const tooManyReps = calculateOneRepMax({ weightKg: 60, repetitions: 11 });
  assert.equal(tooManyReps.type, "VALIDATION_ERROR");
  if (tooManyReps.type === "VALIDATION_ERROR") {
    assert.match(tooManyReps.errors[0].message, /en fazla 10 tekrar/);
  }
});

test("1RM motoru eksik, NaN ve Infinity girdilerinde sonuç üretmez", () => {
  for (const input of [
    { weightKg: null, repetitions: 5 },
    { weightKg: 100, repetitions: null },
    { weightKg: Number.NaN, repetitions: 5 },
    { weightKg: Number.POSITIVE_INFINITY, repetitions: 5 },
    { weightKg: 100, repetitions: Number.NEGATIVE_INFINITY },
  ]) {
    assert.equal(calculateOneRepMax(input).type, "VALIDATION_ERROR");
  }
});

test("100 kg × %75 tam olarak 75 kg verir", () => {
  const result = expectTrainingLoad(100, 75);
  assert.equal(result.rawLoadKg, 75);
  assert.equal(formatKilograms(result.rawLoadKg, 2), "75");
});

test("%1RM motoru yüzde alt ve üst sınırlarını kabul eder", () => {
  assert.equal(expectTrainingLoad(100, 1).rawLoadKg, 1);
  assert.equal(expectTrainingLoad(100, 100).rawLoadKg, 100);
});

test("%1RM motoru ondalıklı 1RM ile ara yuvarlama yapmaz", () => {
  const result = expectTrainingLoad(82.55, 72.5);
  assert.ok(Math.abs(result.rawLoadKg - 82.55 * 0.725) < 1e-12);
  assert.equal(formatKilograms(result.rawLoadKg, 2), "59,85");
});

test("%1RM motoru geçersiz yüzde, geçersiz 1RM ve eksik girdileri reddeder", () => {
  for (const input of [
    { oneRepMaxKg: 100, percentage: 0.5 },
    { oneRepMaxKg: 100, percentage: 100.5 },
    { oneRepMaxKg: 100, percentage: 82.3 },
    { oneRepMaxKg: 0, percentage: 75 },
    { oneRepMaxKg: -1, percentage: 75 },
    { oneRepMaxKg: null, percentage: 75 },
    { oneRepMaxKg: 100, percentage: null },
    { oneRepMaxKg: Number.NaN, percentage: 75 },
    { oneRepMaxKg: 100, percentage: Number.POSITIVE_INFINITY },
  ]) {
    assert.equal(calculateTrainingLoad(input).type, "VALIDATION_ERROR");
  }

  const wrongStep = calculateTrainingLoad({ oneRepMaxKg: 100, percentage: 82.3 });
  assert.equal(wrongStep.type, "VALIDATION_ERROR");
  if (wrongStep.type === "VALIDATION_ERROR") {
    assert.match(wrongStep.errors[0].message, /0,5'lik adımlarla/);
  }
});
