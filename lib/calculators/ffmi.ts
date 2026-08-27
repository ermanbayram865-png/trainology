export const BODY_FAT_MEASUREMENT_METHODS = [
  "dexa",
  "bia_smart_scale",
  "skinfold",
  "visual_estimate",
  "other_unknown",
] as const;

export type BodyFatMeasurementMethod =
  (typeof BODY_FAT_MEASUREMENT_METHODS)[number];

export type FFMIInput = {
  heightCm: number;
  weightKg: number;
  bodyFatPercentage: number;
  measurementMethod: BodyFatMeasurementMethod;
  standardAdultScope: boolean;
};

export type FFMISuccess = {
  type: "SUCCESS";
  fatMassKg: number;
  fatFreeMassKg: number;
  ffmi: number;
  fmi: number;
  metadata: {
    method: "standard_ffmi";
    estimatedFromBodyFatInput: true;
    bodyFatMeasurementMethod: BodyFatMeasurementMethod;
    intermediateRounding: false;
    classificationProduced: false;
    normalizedFFMIProduced: false;
  };
};

export type FFMIResult =
  | FFMISuccess
  | { type: "VALIDATION_ERROR" }
  | { type: "NO_NUMERIC_RESULT"; reason: "outside_standard_adult_scope" };

const TECHNICAL_LIMITS = {
  heightCm: { min: 100, max: 250 },
  weightKg: { min: 30, max: 300 },
  bodyFatPercentage: { min: 3, max: 60 },
} as const;

function isFiniteWithin(value: unknown, min: number, max: number): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
  );
}

export function isBodyFatMeasurementMethod(
  value: unknown,
): value is BodyFatMeasurementMethod {
  return BODY_FAT_MEASUREMENT_METHODS.some((method) => method === value);
}

export function calculateFFMI(input: Partial<FFMIInput> | null | undefined): FFMIResult {
  if (!input || typeof input.standardAdultScope !== "boolean") {
    return { type: "VALIDATION_ERROR" };
  }

  if (input.standardAdultScope === false) {
    return {
      type: "NO_NUMERIC_RESULT",
      reason: "outside_standard_adult_scope",
    };
  }

  if (
    !isFiniteWithin(
      input.heightCm,
      TECHNICAL_LIMITS.heightCm.min,
      TECHNICAL_LIMITS.heightCm.max,
    ) ||
    !isFiniteWithin(
      input.weightKg,
      TECHNICAL_LIMITS.weightKg.min,
      TECHNICAL_LIMITS.weightKg.max,
    ) ||
    !isFiniteWithin(
      input.bodyFatPercentage,
      TECHNICAL_LIMITS.bodyFatPercentage.min,
      TECHNICAL_LIMITS.bodyFatPercentage.max,
    ) ||
    !isBodyFatMeasurementMethod(input.measurementMethod)
  ) {
    return { type: "VALIDATION_ERROR" };
  }

  const heightM = input.heightCm / 100;
  const fatMassKg = input.weightKg * (input.bodyFatPercentage / 100);
  const fatFreeMassKg = input.weightKg - fatMassKg;
  const heightSquared = heightM ** 2;
  const ffmi = fatFreeMassKg / heightSquared;
  const fmi = fatMassKg / heightSquared;

  if (
    !Number.isFinite(heightM) ||
    !Number.isFinite(fatMassKg) ||
    !Number.isFinite(fatFreeMassKg) ||
    !Number.isFinite(ffmi) ||
    !Number.isFinite(fmi) ||
    heightM <= 0 ||
    fatMassKg <= 0 ||
    fatFreeMassKg <= 0 ||
    ffmi <= 0 ||
    fmi <= 0
  ) {
    return { type: "VALIDATION_ERROR" };
  }

  return {
    type: "SUCCESS",
    fatMassKg,
    fatFreeMassKg,
    ffmi,
    fmi,
    metadata: {
      method: "standard_ffmi",
      estimatedFromBodyFatInput: true,
      bodyFatMeasurementMethod: input.measurementMethod,
      intermediateRounding: false,
      classificationProduced: false,
      normalizedFFMIProduced: false,
    },
  };
}

export function formatFFMIDisplayValue(value: number): string {
  if (!Number.isFinite(value)) {
    throw new RangeError("FFMI display value must be finite.");
  }

  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
