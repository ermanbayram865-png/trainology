const REFERENCE_WEIGHT_BMI = 30;

export type ProteinCalculationWeight = {
  bmi: number;
  calculationWeightKg: number;
  usesReferenceWeight: boolean;
};

export function calculateProteinCalculationWeight(
  actualWeightKg: number,
  heightCm: number,
): ProteinCalculationWeight {
  const heightMeters = heightCm / 100;
  const bmi = actualWeightKg / heightMeters ** 2;
  const usesReferenceWeight = bmi >= REFERENCE_WEIGHT_BMI;

  return {
    bmi,
    calculationWeightKg: usesReferenceWeight
      ? Math.min(actualWeightKg, REFERENCE_WEIGHT_BMI * heightMeters ** 2)
      : actualWeightKg,
    usesReferenceWeight,
  };
}
