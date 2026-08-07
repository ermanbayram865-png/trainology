export type HealthyWeightRange = {
  minimumWeight: number;
  maximumWeight: number;
};

const REFERENCE_BMI_RANGE = {
  minimum: 18.5,
  maximum: 24.9,
} as const;

export function calculateHealthyWeightRange(heightInCentimeters: number): HealthyWeightRange {
  const heightInMeters = heightInCentimeters / 100;
  const heightSquared = heightInMeters ** 2;

  return {
    minimumWeight: Math.round(REFERENCE_BMI_RANGE.minimum * heightSquared),
    maximumWeight: Math.round(REFERENCE_BMI_RANGE.maximum * heightSquared),
  };
}
