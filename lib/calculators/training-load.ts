const MIN_ONE_REP_MAX_KG = 0.1;
const MAX_ONE_REP_MAX_KG = 1000;
const MIN_PERCENTAGE = 1;
const MAX_PERCENTAGE = 100;
const PERCENTAGE_STEP = 0.5;

export const TRAINING_LOAD_METHODOLOGY_VERSION = "1.0";

export type TrainingLoadInput = {
  oneRepMaxKg: number | null | undefined;
  percentage: number | null | undefined;
};

export type TrainingLoadValidationField = "oneRepMaxKg" | "percentage";

export type TrainingLoadValidationError = {
  field: TrainingLoadValidationField;
  message: string;
};

export type TrainingLoadCalculation = {
  type: "RESULT";
  inputOneRepMaxKg: number;
  canonicalOneRepMaxKg: number;
  percentage: number;
  rawLoadKg: number;
  warnings: string[];
  methodologyVersion: typeof TRAINING_LOAD_METHODOLOGY_VERSION;
};

export type TrainingLoadResult =
  | TrainingLoadCalculation
  | { type: "VALIDATION_ERROR"; errors: TrainingLoadValidationError[] };

function isOnPercentageStep(value: number): boolean {
  const steps = value / PERCENTAGE_STEP;
  return Math.abs(steps - Math.round(steps)) < 1e-9;
}

export function calculateTrainingLoad(input: TrainingLoadInput): TrainingLoadResult {
  const errors: TrainingLoadValidationError[] = [];
  const { oneRepMaxKg, percentage } = input;

  if (oneRepMaxKg === null || oneRepMaxKg === undefined) {
    errors.push({ field: "oneRepMaxKg", message: "1RM değerini gir." });
  } else if (!Number.isFinite(oneRepMaxKg)) {
    errors.push({ field: "oneRepMaxKg", message: "Geçerli ve sonlu bir sayı gir." });
  } else if (oneRepMaxKg <= 0) {
    errors.push({ field: "oneRepMaxKg", message: "1RM sıfırdan büyük olmalı." });
  } else if (oneRepMaxKg < MIN_ONE_REP_MAX_KG || oneRepMaxKg > MAX_ONE_REP_MAX_KG) {
    errors.push({ field: "oneRepMaxKg", message: "1RM desteklenen aralığın dışında." });
  }

  if (percentage === null || percentage === undefined) {
    errors.push({ field: "percentage", message: "Kullanmak istediğin yüzdeyi gir." });
  } else if (!Number.isFinite(percentage)) {
    errors.push({ field: "percentage", message: "Geçerli ve sonlu bir sayı gir." });
  } else if (percentage < MIN_PERCENTAGE || percentage > MAX_PERCENTAGE) {
    errors.push({ field: "percentage", message: "Yüzde %1 ile %100 arasında olmalı." });
  } else if (!isOnPercentageStep(percentage)) {
    errors.push({ field: "percentage", message: "Yüzdeyi 0,5'lik adımlarla gir." });
  }

  if (errors.length > 0) return { type: "VALIDATION_ERROR", errors };

  const validatedOneRepMaxKg = oneRepMaxKg as number;
  const validatedPercentage = percentage as number;
  const rawLoadKg = validatedOneRepMaxKg * validatedPercentage / 100;

  if (!Number.isFinite(rawLoadKg) || rawLoadKg <= 0) {
    return {
      type: "VALIDATION_ERROR",
      errors: [{ field: "oneRepMaxKg", message: "Bu değerlerle sonuç hesaplanamadı." }],
    };
  }

  return {
    type: "RESULT",
    inputOneRepMaxKg: validatedOneRepMaxKg,
    canonicalOneRepMaxKg: validatedOneRepMaxKg,
    percentage: validatedPercentage,
    rawLoadKg,
    warnings: [
      "1RM değerin tahminiyse bu sonuç da aynı tahmin belirsizliğini taşır.",
      "Aynı %1RM'de yapılabilecek tekrar sayısı kişiden kişiye ve egzersize göre değişebilir.",
    ],
    methodologyVersion: TRAINING_LOAD_METHODOLOGY_VERSION,
  };
}

export function formatKilograms(value: number, maximumFractionDigits: 1 | 2): string {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}
