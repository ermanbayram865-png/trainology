import type {
  ProteinGoal,
  ProteinTrainingProfile,
} from "./types";

export type ProteinInput = {
  ageYears: number;
  weightKg: number;
  trainingProfile: ProteinTrainingProfile;
  goal?: ProteinGoal;
  scopeRisk: boolean;
};

type ProteinValidationError = {
  type: "VALIDATION_ERROR";
  field: keyof ProteinInput;
  message: string;
};

type ProteinNoNumericResult = {
  type: "NO_NUMERIC_RESULT";
  reason: "under_18" | "scope_risk";
};

type ProteinReferenceResult = {
  type: "PRI_REFERENCE";
  gPerKg: 0.83;
  dailyGrams: number;
  label: "Nüfus yeterlilik referansı (PRI)";
  certainty: "population_reference";
};

type ProteinPracticalRangeResult = {
  type: "PRACTICAL_RANGE";
  lowGPerKg: 1 | 1.4;
  highGPerKg: 1.2 | 2;
  lowDailyGrams: number;
  highDailyGrams: number;
  label:
    | "İleri yaş için pratik protein hedef aralığı"
    | "Günlük protein için pratik aralık";
  certainty?: "conditional";
};

type ProteinResistanceRangeResult = {
  type: "RESISTANCE_RANGE";
  lowGPerKg: 1.4;
  highGPerKg: 2;
  lowDailyGrams: number;
  highDailyGrams: number;
  optionalAnchorGPerKg: 1.6;
  anchorDailyGrams: number;
  anchorLabel: "Kanıtla uyumlu başlangıç noktası";
  certainty?: "conditional";
};

export type ProteinRequirement =
  | ProteinValidationError
  | ProteinNoNumericResult
  | ProteinReferenceResult
  | ProteinPracticalRangeResult
  | ProteinResistanceRangeResult;

const TRAINING_PROFILES: readonly ProteinTrainingProfile[] = [
  "none",
  "regular_exercise",
  "resistance_hypertrophy",
];

const GOALS: readonly ProteinGoal[] = [
  "general_health",
  "maintenance",
  "muscle_gain",
  "fat_loss",
];

function validationError(
  field: keyof ProteinInput,
  message: string,
): ProteinValidationError {
  return { type: "VALIDATION_ERROR", field, message };
}

export function calculateProteinRequirement(
  input: ProteinInput,
): ProteinRequirement {
  const { ageYears, weightKg, trainingProfile, goal, scopeRisk } = input;

  if (!Number.isFinite(ageYears) || ageYears < 0) {
    return validationError("ageYears", "Yaş geçerli bir sayı olmalıdır.");
  }

  if (ageYears < 18) {
    return { type: "NO_NUMERIC_RESULT", reason: "under_18" };
  }

  if (typeof scopeRisk !== "boolean") {
    return validationError("scopeRisk", "Kapsam sorusu yanıtlanmalıdır.");
  }

  if (scopeRisk) {
    return { type: "NO_NUMERIC_RESULT", reason: "scope_risk" };
  }

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return validationError("weightKg", "Kilo pozitif ve sonlu bir sayı olmalıdır.");
  }

  if (!TRAINING_PROFILES.includes(trainingProfile)) {
    return validationError("trainingProfile", "Geçerli bir antrenman profili seçilmelidir.");
  }

  if (goal !== undefined && !GOALS.includes(goal)) {
    return validationError("goal", "Geçerli bir hedef seçilmelidir.");
  }

  if (ageYears >= 65 && trainingProfile === "none") {
    return {
      type: "PRACTICAL_RANGE",
      lowGPerKg: 1,
      highGPerKg: 1.2,
      lowDailyGrams: weightKg,
      highDailyGrams: weightKg * 1.2,
      label: "İleri yaş için pratik protein hedef aralığı",
      certainty: "conditional",
    };
  }

  if (trainingProfile === "regular_exercise") {
    return {
      type: "PRACTICAL_RANGE",
      lowGPerKg: 1.4,
      highGPerKg: 2,
      lowDailyGrams: weightKg * 1.4,
      highDailyGrams: weightKg * 2,
      label: "Günlük protein için pratik aralık",
      ...(ageYears >= 65 ? { certainty: "conditional" as const } : {}),
    };
  }

  if (trainingProfile === "resistance_hypertrophy") {
    return {
      type: "RESISTANCE_RANGE",
      lowGPerKg: 1.4,
      highGPerKg: 2,
      lowDailyGrams: weightKg * 1.4,
      highDailyGrams: weightKg * 2,
      optionalAnchorGPerKg: 1.6,
      anchorDailyGrams: weightKg * 1.6,
      anchorLabel: "Kanıtla uyumlu başlangıç noktası",
      ...(ageYears >= 65 ? { certainty: "conditional" as const } : {}),
    };
  }

  return {
    type: "PRI_REFERENCE",
    gPerKg: 0.83,
    dailyGrams: weightKg * 0.83,
    label: "Nüfus yeterlilik referansı (PRI)",
    certainty: "population_reference",
  };
}
