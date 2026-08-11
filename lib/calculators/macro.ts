import { calculateProteinRequirement } from "./protein";
import type {
  Goal,
  MacroActivityLevel,
  ProteinActivityLevel,
  ProteinGoal,
} from "./types";

export type MacroDistribution = {
  protein: number;
  carbohydrates: number;
  fat: number;
  proteinPercentage: number;
  carbohydratePercentage: number;
  fatPercentage: number;
  proteinPerKg: number;
};

const proteinGoals: Record<Goal, ProteinGoal> = {
  lose: "fatLoss",
  maintain: "generalHealth",
  gain: "muscleGain",
};

const proteinActivityLevels: Record<MacroActivityLevel, ProteinActivityLevel> = {
  low: "low",
  moderate: "moderate",
  high: "active",
};

const fatPercentages: Record<MacroActivityLevel, number> = {
  low: 0.3,
  moderate: 0.25,
  high: 0.2,
};

export function calculateMacroDistribution({
  calories,
  weight,
  goal,
  activityLevel,
}: {
  calories: number;
  weight: number;
  goal: Goal;
  activityLevel: MacroActivityLevel;
}): MacroDistribution {
  if (!Number.isFinite(calories) || calories <= 0) {
    throw new RangeError("Kalori hedefi pozitif ve sonlu bir sayı olmalıdır.");
  }

  if (!Number.isFinite(weight) || weight <= 0) {
    throw new RangeError("Kilo pozitif ve sonlu bir sayı olmalıdır.");
  }

  const proteinRequirement = calculateProteinRequirement(
    weight,
    proteinGoals[goal],
    proteinActivityLevels[activityLevel],
  );
  const proteinCalories = proteinRequirement.dailyProtein * 4;
  const fatPercentage = fatPercentages[activityLevel];
  const fatCalories = calories * fatPercentage;
  const carbohydrateCalories = calories - proteinCalories - fatCalories;

  if (carbohydrateCalories < 0) {
    throw new RangeError(
      "Kalori hedefi, ortak protein önerisi ve yağ payını birlikte karşılamıyor.",
    );
  }

  const proteinPercentage = proteinCalories / calories;
  const carbohydratePercentage = carbohydrateCalories / calories;

  return {
    protein: proteinRequirement.dailyProtein,
    carbohydrates: Math.round(carbohydrateCalories / 4),
    fat: Math.round(fatCalories / 9),
    proteinPercentage: Math.round(proteinPercentage * 100),
    carbohydratePercentage: Math.round(carbohydratePercentage * 100),
    fatPercentage: Math.round(fatPercentage * 100),
    proteinPerKg: proteinRequirement.proteinPerKg,
  };
}
