import type { Goal, MacroActivityLevel } from "./types";

export type MacroDistribution = {
  protein: number;
  carbohydrates: number;
  fat: number;
  proteinPercentage: number;
  carbohydratePercentage: number;
  fatPercentage: number;
  proteinPerKg: number;
};

type MacroProteinPerKgTable = Record<
  Goal,
  Record<MacroActivityLevel, number>
>;

const MACRO_PROTEIN_PER_KG: MacroProteinPerKgTable = {
  maintain: {
    low: 1.2,
    moderate: 1.4,
    high: 1.5,
  },
  gain: {
    low: 1.6,
    moderate: 1.9,
    high: 2.1,
  },
  lose: {
    low: 1.6,
    moderate: 2,
    high: 2.2,
  },
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

  if (!(["lose", "maintain", "gain"] as const).includes(goal)) {
    throw new RangeError("Geçerli bir hedef seçilmelidir.");
  }

  if (!(["low", "moderate", "high"] as const).includes(activityLevel)) {
    throw new RangeError("Geçerli bir aktivite seviyesi seçilmelidir.");
  }

  const proteinPerKg = MACRO_PROTEIN_PER_KG[goal][activityLevel];
  const protein = Math.round(weight * proteinPerKg);
  const proteinCalories = protein * 4;
  const fatPercentage = fatPercentages[activityLevel];
  const fatCalories = calories * fatPercentage;
  const carbohydrateCalories = calories - proteinCalories - fatCalories;

  if (carbohydrateCalories < 0) {
    throw new RangeError(
      "Kalori hedefi, Makro Planlayıcının protein tahmini ve yağ payını birlikte karşılamıyor.",
    );
  }

  const proteinPercentage = proteinCalories / calories;
  const carbohydratePercentage = carbohydrateCalories / calories;

  return {
    protein,
    carbohydrates: Math.round(carbohydrateCalories / 4),
    fat: Math.round(fatCalories / 9),
    proteinPercentage: Math.round(proteinPercentage * 100),
    carbohydratePercentage: Math.round(carbohydratePercentage * 100),
    fatPercentage: Math.round(fatPercentage * 100),
    proteinPerKg,
  };
}
