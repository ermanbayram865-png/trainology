import type { ProteinActivityLevel, ProteinGoal } from "./types";

type ProteinRange = {
  min: number;
  max: number;
};

export type ProteinRequirement = {
  dailyProtein: number;
  proteinPerKg: number;
  range: ProteinRange;
};

const proteinRanges: Record<ProteinGoal, ProteinRange> = {
  generalHealth: { min: 1.2, max: 1.6 },
  muscleGain: { min: 1.6, max: 2.2 },
  fatLoss: { min: 1.6, max: 2.4 },
};

const activityRangePosition: Record<ProteinActivityLevel, number> = {
  low: 0,
  moderate: 0.5,
  active: 0.75,
  veryActive: 1,
};

export function calculateProteinRequirement(
  weight: number,
  goal: ProteinGoal,
  activityLevel: ProteinActivityLevel,
): ProteinRequirement {
  const range = proteinRanges[goal];
  const position = activityRangePosition[activityLevel];
  const proteinPerKg = Math.round((range.min + (range.max - range.min) * position) * 10) / 10;

  return {
    dailyProtein: Math.round(weight * proteinPerKg),
    proteinPerKg,
    range,
  };
}
