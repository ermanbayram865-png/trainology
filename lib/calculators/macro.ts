import type {
  Goal,
  MacroActivityLevel,
  MacroProteinPreference,
} from "./types";

export type MacroDistribution = {
  protein: number;
  carbohydrates: number;
  fat: number;
  proteinPercentage: number;
  carbohydratePercentage: number;
  fatPercentage: number;
};

const proteinPercentages: Record<Goal, Record<MacroProteinPreference, number>> = {
  lose: { standard: 0.3, highProtein: 0.35 },
  maintain: { standard: 0.25, highProtein: 0.3 },
  gain: { standard: 0.25, highProtein: 0.3 },
};

const fatPercentages: Record<MacroActivityLevel, number> = {
  low: 0.3,
  moderate: 0.25,
  high: 0.2,
};

export function calculateMacroDistribution({
  calories,
  goal,
  proteinPreference,
  activityLevel,
}: {
  calories: number;
  goal: Goal;
  proteinPreference: MacroProteinPreference;
  activityLevel: MacroActivityLevel;
}): MacroDistribution {
  const proteinPercentage = proteinPercentages[goal][proteinPreference];
  const fatPercentage = fatPercentages[activityLevel];
  const carbohydratePercentage = 1 - proteinPercentage - fatPercentage;

  return {
    protein: Math.round((calories * proteinPercentage) / 4),
    carbohydrates: Math.round((calories * carbohydratePercentage) / 4),
    fat: Math.round((calories * fatPercentage) / 9),
    proteinPercentage: Math.round(proteinPercentage * 100),
    carbohydratePercentage: Math.round(carbohydratePercentage * 100),
    fatPercentage: Math.round(fatPercentage * 100),
  };
}
