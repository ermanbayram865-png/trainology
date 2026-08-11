import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateMacroDistribution,
  calculateProteinRequirement,
} from "../lib/calculators/index";

test("Makro Planlayıcı tüm hedef ve aktivite eşlemelerinde ortak protein motorunu kullanır", () => {
  const goals = [
    ["maintain", "generalHealth"],
    ["gain", "muscleGain"],
    ["lose", "fatLoss"],
  ] as const;
  const activityLevels = [
    ["low", "low"],
    ["moderate", "moderate"],
    ["high", "active"],
  ] as const;

  for (const [macroGoal, proteinGoal] of goals) {
    for (const [macroActivity, proteinActivity] of activityLevels) {
      const sharedProtein = calculateProteinRequirement(
        70,
        proteinGoal,
        proteinActivity,
      );
      const macros = calculateMacroDistribution({
        calories: 2_500,
        weight: 70,
        goal: macroGoal,
        activityLevel: macroActivity,
      });

      assert.equal(macros.protein, sharedProtein.dailyProtein);
      assert.equal(macros.proteinPerKg, sharedProtein.proteinPerKg);
    }
  }
});

test("protein hedefi kalori yüzdesinden değil kilo başına ortak kuraldan gelir", () => {
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
