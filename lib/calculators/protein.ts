import { calculateProteinCalculationWeight } from "./protein-weight";
import type {
  ProteinAgeGroup,
  ProteinGoal,
  ProteinTrainingProfile,
} from "./types";

export type ProteinInput = {
  ageGroup: ProteinAgeGroup;
  heightCm: number;
  weightKg: number;
  trainingProfile: ProteinTrainingProfile;
  goal: ProteinGoal;
  standardAdultScope: boolean;
};

type ProteinValidationError = {
  type: "VALIDATION_ERROR";
  field: keyof ProteinInput;
  message: string;
};

type ProteinNoNumericResult = {
  type: "NO_NUMERIC_RESULT";
  reason: "outside_standard_scope";
};

type ProteinResultBase = {
  calculationWeightKg: number;
  actualWeightKg: number;
  bmi: number;
  usesReferenceWeight: boolean;
  context:
    | "population_reference"
    | "conditional_fat_loss_start"
    | "older_adult_range"
    | "exercise_range"
    | "resistance_start_and_range";
  note?: "no_hypertrophy_target" | "fat_loss_context" | "older_adult_individualization";
};

export type ProteinSingleResult = ProteinResultBase & {
  type: "SINGLE_REFERENCE";
  gPerKg: 0.83 | 1.2;
  dailyGrams: number;
  label: "Nüfus referans alımı" | "Koşullu başlangıç referansı";
};

export type ProteinRangeResult = ProteinResultBase & {
  type: "PRACTICAL_RANGE";
  lowGPerKg: 1 | 1.4;
  highGPerKg: 1.2 | 2;
  lowDailyGrams: number;
  highDailyGrams: number;
  label: "Pratik aralık";
};

export type ProteinAnchorRangeResult = ProteinResultBase & {
  type: "ANCHOR_AND_RANGE";
  anchorGPerKg: 1.6;
  anchorDailyGrams: number;
  lowGPerKg: 1.4 | 1.6;
  highGPerKg: 2;
  lowDailyGrams: number;
  highDailyGrams: number;
  anchorLabel: "Kanıtla uyumlu başlangıç noktası";
  rangeLabel: "Pratik aralık";
};

export type ProteinRequirement =
  | ProteinValidationError
  | ProteinNoNumericResult
  | ProteinSingleResult
  | ProteinRangeResult
  | ProteinAnchorRangeResult;

const AGE_GROUPS: readonly ProteinAgeGroup[] = ["adult_18_64", "adult_65_plus"];
const TRAINING_PROFILES: readonly ProteinTrainingProfile[] = [
  "none",
  "endurance_mixed",
  "resistance",
];
const GOALS: readonly ProteinGoal[] = ["maintenance", "fat_loss", "muscle_gain"];
const PROTEIN_INPUT_LIMITS = {
  heightCm: { min: 100, max: 250 },
  weightKg: { min: 25, max: 400 },
} as const;

function validationError(
  field: keyof ProteinInput,
  message: string,
): ProteinValidationError {
  return { type: "VALIDATION_ERROR", field, message };
}

export function calculateProteinRequirement(input: ProteinInput): ProteinRequirement {
  const { ageGroup, heightCm, weightKg, trainingProfile, goal, standardAdultScope } = input;

  if (!AGE_GROUPS.includes(ageGroup)) {
    return validationError("ageGroup", "Geçerli bir yaş grubu seçilmelidir.");
  }
  if (
    !Number.isFinite(heightCm) ||
    heightCm < PROTEIN_INPUT_LIMITS.heightCm.min ||
    heightCm > PROTEIN_INPUT_LIMITS.heightCm.max
  ) {
    return validationError("heightCm", "Boy 100–250 cm arasında olmalıdır.");
  }
  if (
    !Number.isFinite(weightKg) ||
    weightKg < PROTEIN_INPUT_LIMITS.weightKg.min ||
    weightKg > PROTEIN_INPUT_LIMITS.weightKg.max
  ) {
    return validationError("weightKg", "Kilo 25–400 kg arasında olmalıdır.");
  }
  if (!TRAINING_PROFILES.includes(trainingProfile)) {
    return validationError("trainingProfile", "Geçerli bir antrenman profili seçilmelidir.");
  }
  if (!GOALS.includes(goal)) {
    return validationError("goal", "Geçerli bir hedef seçilmelidir.");
  }
  if (typeof standardAdultScope !== "boolean") {
    return validationError("standardAdultScope", "Bu genel hesaplamanın sana uygun olduğunu onayla.");
  }
  if (!standardAdultScope) {
    return { type: "NO_NUMERIC_RESULT", reason: "outside_standard_scope" };
  }

  const weight = calculateProteinCalculationWeight(weightKg, heightCm);
  const base = {
    calculationWeightKg: weight.calculationWeightKg,
    actualWeightKg: weightKg,
    bmi: weight.bmi,
    usesReferenceWeight: weight.usesReferenceWeight,
  } as const;

  if (trainingProfile === "resistance") {
    const lowGPerKg = goal === "fat_loss" ? 1.6 : 1.4;
    return {
      ...base,
      type: "ANCHOR_AND_RANGE",
      context: "resistance_start_and_range",
      anchorGPerKg: 1.6,
      anchorDailyGrams: weight.calculationWeightKg * 1.6,
      lowGPerKg,
      highGPerKg: 2,
      lowDailyGrams: weight.calculationWeightKg * lowGPerKg,
      highDailyGrams: weight.calculationWeightKg * 2,
      anchorLabel: "Kanıtla uyumlu başlangıç noktası",
      rangeLabel: "Pratik aralık",
    };
  }

  if (trainingProfile === "endurance_mixed") {
    return {
      ...base,
      type: "PRACTICAL_RANGE",
      context: "exercise_range",
      lowGPerKg: 1.4,
      highGPerKg: 2,
      lowDailyGrams: weight.calculationWeightKg * 1.4,
      highDailyGrams: weight.calculationWeightKg * 2,
      label: "Pratik aralık",
      ...(goal === "muscle_gain"
        ? { note: "no_hypertrophy_target" as const }
        : goal === "fat_loss"
          ? { note: "fat_loss_context" as const }
          : {}),
    };
  }

  if (ageGroup === "adult_65_plus") {
    if (goal === "fat_loss") {
      return {
        ...base,
        type: "SINGLE_REFERENCE",
        context: "conditional_fat_loss_start",
        gPerKg: 1.2,
        dailyGrams: weight.calculationWeightKg * 1.2,
        label: "Koşullu başlangıç referansı",
        note: "older_adult_individualization",
      };
    }

    return {
      ...base,
      type: "PRACTICAL_RANGE",
      context: "older_adult_range",
      lowGPerKg: 1,
      highGPerKg: 1.2,
      lowDailyGrams: weight.calculationWeightKg,
      highDailyGrams: weight.calculationWeightKg * 1.2,
      label: "Pratik aralık",
      ...(goal === "muscle_gain" ? { note: "no_hypertrophy_target" as const } : {}),
    };
  }

  if (goal === "fat_loss") {
    return {
      ...base,
      type: "SINGLE_REFERENCE",
      context: "conditional_fat_loss_start",
      gPerKg: 1.2,
      dailyGrams: weight.calculationWeightKg * 1.2,
      label: "Koşullu başlangıç referansı",
    };
  }

  return {
    ...base,
    type: "SINGLE_REFERENCE",
    context: "population_reference",
    gPerKg: 0.83,
    dailyGrams: weight.calculationWeightKg * 0.83,
    label: "Nüfus referans alımı",
    ...(goal === "muscle_gain" ? { note: "no_hypertrophy_target" as const } : {}),
  };
}
