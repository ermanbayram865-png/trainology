import type { EfsaAdultReferenceCategory } from "./types";

export type { EfsaAdultReferenceCategory } from "./types";

export type WaterInput = {
  ageYears: number;
  efsaAdultReferenceCategory: EfsaAdultReferenceCategory;
  scopeRisk: boolean;
};

export const TOTAL_WATER_METADATA = {
  construct: "total_water_intake",
  includesFoodWater: true,
  includesDrinkingWater: true,
  includesOtherBeverages: true,
  personalExactRequirement: false,
} as const;

type WaterValidationError = {
  type: "VALIDATION_ERROR";
  field: keyof WaterInput;
  message: string;
};

type WaterNoNumericResult = {
  type: "NO_NUMERIC_RESULT";
  reason: "under_18" | "scope_risk";
};

type TotalWaterAiResult = {
  type: "TOTAL_WATER_AI";
  litersPerDay: 2 | 2.5;
  metadata: typeof TOTAL_WATER_METADATA;
};

export type WaterRequirement =
  | WaterValidationError
  | WaterNoNumericResult
  | TotalWaterAiResult;

export function calculateWaterRequirement(input: WaterInput): WaterRequirement {
  const { ageYears, efsaAdultReferenceCategory, scopeRisk } = input;

  if (!Number.isFinite(ageYears) || ageYears < 0) {
    return {
      type: "VALIDATION_ERROR",
      field: "ageYears",
      message: "Yaş geçerli bir sayı olmalıdır.",
    };
  }

  if (ageYears < 18) {
    return { type: "NO_NUMERIC_RESULT", reason: "under_18" };
  }

  if (typeof scopeRisk !== "boolean") {
    return {
      type: "VALIDATION_ERROR",
      field: "scopeRisk",
      message: "Kapsam sorusu yanıtlanmalıdır.",
    };
  }

  if (scopeRisk) {
    return { type: "NO_NUMERIC_RESULT", reason: "scope_risk" };
  }

  if (efsaAdultReferenceCategory === "adult_female_reference") {
    return {
      type: "TOTAL_WATER_AI",
      litersPerDay: 2,
      metadata: TOTAL_WATER_METADATA,
    };
  }

  if (efsaAdultReferenceCategory === "adult_male_reference") {
    return {
      type: "TOTAL_WATER_AI",
      litersPerDay: 2.5,
      metadata: TOTAL_WATER_METADATA,
    };
  }

  return {
    type: "VALIDATION_ERROR",
    field: "efsaAdultReferenceCategory",
    message: "EFSA yetişkin referans kategorisi seçilmelidir.",
  };
}
