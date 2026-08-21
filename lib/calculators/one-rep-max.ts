const MIN_WEIGHT_KG = 0.1;
const MAX_WEIGHT_KG = 1000;
export const MAX_ONE_REP_MAX_REPETITIONS = 10;
export const ONE_REP_MAX_METHODOLOGY_VERSION = "1.0";

export type OneRepMaxInput = {
  weightKg: number | null | undefined;
  repetitions: number | null | undefined;
};

export type OneRepMaxValidationField = "weightKg" | "repetitions";

export type OneRepMaxValidationError = {
  field: OneRepMaxValidationField;
  message: string;
};

export type OneRepMaxCalculation = {
  type: "RESULT";
  inputWeightKg: number;
  repetitions: number;
  canonicalWeightKg: number;
  calculationMethod: "direct" | "lombardi";
  formulaVersion: "lombardi-1.0";
  rawEstimatedOneRepMaxKg: number;
  resultType: "direct_single_load" | "estimated_1rm";
  uncertaintyLevel: "single_rep_context" | "standard" | "elevated";
  warnings: string[];
  methodologyVersion: typeof ONE_REP_MAX_METHODOLOGY_VERSION;
};

export type OneRepMaxResult =
  | OneRepMaxCalculation
  | { type: "VALIDATION_ERROR"; errors: OneRepMaxValidationError[] };

function validateOneRepMaxInput(input: OneRepMaxInput): OneRepMaxValidationError[] {
  const errors: OneRepMaxValidationError[] = [];
  const { weightKg, repetitions } = input;

  if (weightKg === null || weightKg === undefined) {
    errors.push({ field: "weightKg", message: "Ağırlık değerini gir." });
  } else if (!Number.isFinite(weightKg)) {
    errors.push({ field: "weightKg", message: "Geçerli ve sonlu bir sayı gir." });
  } else if (weightKg <= 0) {
    errors.push({ field: "weightKg", message: "Ağırlık sıfırdan büyük olmalı." });
  } else if (weightKg < MIN_WEIGHT_KG || weightKg > MAX_WEIGHT_KG) {
    errors.push({ field: "weightKg", message: "Ağırlık desteklenen aralığın dışında." });
  }

  if (repetitions === null || repetitions === undefined) {
    errors.push({ field: "repetitions", message: "Tekrar sayısını gir." });
  } else if (!Number.isFinite(repetitions)) {
    errors.push({ field: "repetitions", message: "Geçerli ve sonlu bir sayı gir." });
  } else if (!Number.isInteger(repetitions)) {
    errors.push({ field: "repetitions", message: "Tekrar sayısı tam sayı olmalı." });
  } else if (repetitions < 1) {
    errors.push({ field: "repetitions", message: "Tekrar sayısı en az 1 olmalı." });
  } else if (repetitions > MAX_ONE_REP_MAX_REPETITIONS) {
    errors.push({
      field: "repetitions",
      message: "Tahmini 1RM için en fazla 10 tekrar kullanabilirsin.",
    });
  }

  return errors;
}

export function calculateOneRepMax(input: OneRepMaxInput): OneRepMaxResult {
  const errors = validateOneRepMaxInput(input);
  if (errors.length > 0) return { type: "VALIDATION_ERROR", errors };

  const weightKg = input.weightKg as number;
  const repetitions = input.repetitions as number;
  const isSingleRep = repetitions === 1;
  const rawEstimatedOneRepMaxKg = isSingleRep
    ? weightKg
    : weightKg * repetitions ** 0.1;

  if (!Number.isFinite(rawEstimatedOneRepMaxKg) || rawEstimatedOneRepMaxKg <= 0) {
    return {
      type: "VALIDATION_ERROR",
      errors: [{ field: "weightKg", message: "Bu değerlerle sonuç hesaplanamadı." }],
    };
  }

  const warnings = [
    "Bu sonuç bir tahmindir; gerçek 1RM'in egzersiz ve bireysel özelliklere göre farklı olabilir.",
    "Seti belirgin tekrar rezerviyle bıraktıysan tahmin daha düşük çıkabilir.",
  ];

  if (isSingleRep) {
    warnings.unshift(
      "1 tekrar girdiğin için sonuç kaldırdığın ağırlığa eşittir. Bu değer ancak tekrar gerçekten maksimal denemeyse gerçek 1RM'ini temsil eder.",
    );
  } else if (repetitions >= 6) {
    warnings.unshift("Tekrar sayısı yükseldikçe tahmin belirsizliği artabilir.");
  }

  return {
    type: "RESULT",
    inputWeightKg: weightKg,
    repetitions,
    canonicalWeightKg: weightKg,
    calculationMethod: isSingleRep ? "direct" : "lombardi",
    formulaVersion: "lombardi-1.0",
    rawEstimatedOneRepMaxKg,
    resultType: isSingleRep ? "direct_single_load" : "estimated_1rm",
    uncertaintyLevel: isSingleRep
      ? "single_rep_context"
      : repetitions >= 6
        ? "elevated"
        : "standard",
    warnings,
    methodologyVersion: ONE_REP_MAX_METHODOLOGY_VERSION,
  };
}

// Performance Analysis currently relies on this legacy Epley helper. Keep its
// behavior isolated so the calculator migration does not change that feature.
export type OneRepMaxEstimate = {
  estimatedOneRepMax: number;
};

export function calculateEpleyOneRepMax(
  weight: number,
  repetitions: number,
): OneRepMaxEstimate {
  const estimatedOneRepMax = weight * (1 + repetitions / 30);

  return {
    estimatedOneRepMax: Math.round(estimatedOneRepMax * 10) / 10,
  };
}
