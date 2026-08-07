import type { WaterActivityLevel } from "./types";

export type { WaterActivityLevel } from "./types";

export type WaterRequirement = {
  minimumLiters: number;
  maximumLiters: number;
};

const activityAdjustments: Record<WaterActivityLevel, number> = {
  low: 0,
  moderate: 2.5,
  high: 5,
};

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function calculateWaterRequirement(
  weight: number,
  activityLevel: WaterActivityLevel,
): WaterRequirement {
  const adjustment = activityAdjustments[activityLevel];

  return {
    minimumLiters: roundToOneDecimal((weight * (30 + adjustment)) / 1000),
    maximumLiters: roundToOneDecimal((weight * (35 + adjustment)) / 1000),
  };
}
