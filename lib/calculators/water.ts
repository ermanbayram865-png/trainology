import type { EfsaAdultReferenceCategory } from "./types";

export type { EfsaAdultReferenceCategory } from "./types";

export type WaterInput = {
  adultConfirmed: boolean;
  efsaAdultReferenceCategory: EfsaAdultReferenceCategory;
  standardAdultScope: boolean;
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
  reason: "under_18" | "outside_standard_scope";
};

type TotalWaterReferenceResult = {
  type: "TOTAL_WATER_REFERENCE";
  litersPerDay: 2 | 2.5;
  millilitersPerDay: 2000 | 2500;
  metadata: typeof TOTAL_WATER_METADATA;
};

export type WaterRequirement =
  | WaterValidationError
  | WaterNoNumericResult
  | TotalWaterReferenceResult;

export function calculateWaterRequirement(input: WaterInput): WaterRequirement {
  const { adultConfirmed, efsaAdultReferenceCategory, standardAdultScope } = input;

  if (typeof adultConfirmed !== "boolean") {
    return {
      type: "VALIDATION_ERROR",
      field: "adultConfirmed",
      message: "18 yaş veya üzeri kapsamı yanıtlanmalıdır.",
    };
  }
  if (!adultConfirmed) {
    return { type: "NO_NUMERIC_RESULT", reason: "under_18" };
  }
  if (typeof standardAdultScope !== "boolean") {
    return {
      type: "VALIDATION_ERROR",
      field: "standardAdultScope",
      message: "Kapsam onayı yanıtlanmalıdır.",
    };
  }
  if (!standardAdultScope) {
    return { type: "NO_NUMERIC_RESULT", reason: "outside_standard_scope" };
  }

  if (efsaAdultReferenceCategory === "adult_female_reference") {
    const litersPerDay = 2 as const;
    return {
      type: "TOTAL_WATER_REFERENCE",
      litersPerDay,
      millilitersPerDay: (litersPerDay * 1000) as 2000,
      metadata: TOTAL_WATER_METADATA,
    };
  }
  if (efsaAdultReferenceCategory === "adult_male_reference") {
    const litersPerDay = 2.5 as const;
    return {
      type: "TOTAL_WATER_REFERENCE",
      litersPerDay,
      millilitersPerDay: (litersPerDay * 1000) as 2500,
      metadata: TOTAL_WATER_METADATA,
    };
  }

  return {
    type: "VALIDATION_ERROR",
    field: "efsaAdultReferenceCategory",
    message: "EFSA yetişkin referans kategorisi seçilmelidir.",
  };
}
