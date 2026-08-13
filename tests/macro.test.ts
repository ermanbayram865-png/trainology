import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateMacroDistribution,
} from "../lib/calculators/index";

test("Makro Planlayıcı kendi hedef ve aktivite protein tablosunu uygular", () => {
  const expectations = [
    ["maintain", "low", 1.2],
    ["maintain", "moderate", 1.4],
    ["maintain", "high", 1.5],
    ["gain", "low", 1.6],
    ["gain", "moderate", 1.9],
    ["gain", "high", 2.1],
    ["lose", "low", 1.6],
    ["lose", "moderate", 2],
    ["lose", "high", 2.2],
  ] as const;

  for (const [goal, activityLevel, proteinPerKg] of expectations) {
    const macros = calculateMacroDistribution({
      calories: 3_000,
      weight: 70,
      goal,
      activityLevel,
    });

    assert.equal(macros.proteinPerKg, proteinPerKg);
    assert.equal(macros.protein, Math.round(70 * proteinPerKg));
  }
});

test("Makro protein tahmini kalori hedefinden bağımsızdır", () => {
  const lowerEnergy = calculateMacroDistribution({
    calories: 2_000,
    weight: 70,
    goal: "maintain",
    activityLevel: "moderate",
  });
  const higherEnergy = calculateMacroDistribution({
    calories: 3_000,
    weight: 70,
    goal: "maintain",
    activityLevel: "moderate",
  });

  assert.equal(lowerEnergy.protein, higherEnergy.protein);
  assert.equal(lowerEnergy.proteinPerKg, higherEnergy.proteinPerKg);
  assert.ok(lowerEnergy.carbohydrates < higherEnergy.carbohydrates);
});

test("protein ve yağ enerjisi hedefi aşıyorsa negatif karbonhidrat üretmez", () => {
  assert.throws(
    () =>
      calculateMacroDistribution({
        calories: 1_000,
        weight: 400,
        goal: "lose",
        activityLevel: "high",
      }),
    RangeError,
  );
});
