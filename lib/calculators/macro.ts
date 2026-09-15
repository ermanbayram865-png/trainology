import type { Goal } from "./types";
import { calculateProteinCalculationWeight } from "./protein-weight";

export type MacroResistanceTraining = "yes" | "no";
export type MacroScope = "standardAdult" | "outsideStandardScope";

export type MacroBlockReason =
  | "outsideStandardScope"
  | "underweightFatLoss"
  | "gainWithoutResistanceTraining"
  | "incompatibleEnergyBudget";

export type MacroWarning = "lowBmi" | "referenceWeightUsed";

export type MacroDistribution = {
  protein: number;
  carbohydrates: number;
  fat: number;
  proteinGramsRaw: number;
  carbohydrateGramsRaw: number;
  fatGramsRaw: number;
  proteinPercentage: number;
  carbohydratePercentage: number;
  fatPercentage: number;
  proteinPerKg: number;
  bmi: number;
  proteinCalculationWeight: number;
  usesReferenceWeight: boolean;
  fiberReferenceGrams: 25;
  warnings: MacroWarning[];
};

export type MacroEvaluation =
  | { status: "ok"; distribution: MacroDistribution }
  | { status: "blocked"; reason: MacroBlockReason; message: string };

export type MacroInput = {
  calories: number;
  weight: number;
  height: number;
  goal: Goal;
  resistanceTraining: MacroResistanceTraining;
  scope: MacroScope;
};

const PROTEIN_KCAL_PER_GRAM = 4;
const CARBOHYDRATE_KCAL_PER_GRAM = 4;
const FAT_KCAL_PER_GRAM = 9;
const FAT_ENERGY_SHARE = 0.3;
const FIBER_REFERENCE_GRAMS = 25 as const;
const LOW_BMI_THRESHOLD = 18.5;
const MACRO_INPUT_LIMITS = {
  calories: { min: 1000, max: 8000 },
  weight: { min: 25, max: 400 },
  height: { min: 100, max: 250 },
} as const;

function validateInput(input: MacroInput) {
  if (
    !Number.isFinite(input.calories) ||
    input.calories < MACRO_INPUT_LIMITS.calories.min ||
    input.calories > MACRO_INPUT_LIMITS.calories.max
  ) {
    throw new RangeError("Kalori hedefi 1.000–8.000 kcal arasında olmalıdır.");
  }
  if (
    !Number.isFinite(input.weight) ||
    input.weight < MACRO_INPUT_LIMITS.weight.min ||
    input.weight > MACRO_INPUT_LIMITS.weight.max
  ) {
    throw new RangeError("Kilo 25–400 kg arasında olmalıdır.");
  }
  if (
    !Number.isFinite(input.height) ||
    input.height < MACRO_INPUT_LIMITS.height.min ||
    input.height > MACRO_INPUT_LIMITS.height.max
  ) {
    throw new RangeError("Boy 100–250 cm arasında olmalıdır.");
  }
  if (!(["lose", "maintain", "gain"] as const).includes(input.goal)) {
    throw new RangeError("Geçerli bir hedef seçilmelidir.");
  }
  if (!(["yes", "no"] as const).includes(input.resistanceTraining)) {
    throw new RangeError("Direnç antrenmanı yapıp yapmadığını seç.");
  }
  if (!(["standardAdult", "outsideStandardScope"] as const).includes(input.scope)) {
    throw new RangeError("Bu genel hesaplamanın sana uygun olup olmadığını seç.");
  }
}

function getProteinPerKg(goal: Goal, resistanceTraining: MacroResistanceTraining) {
  if (resistanceTraining === "yes") return 1.6;
  if (goal === "maintain") return 0.83;
  if (goal === "lose") return 1.2;
  return null;
}

export function calculateMacroDistribution(input: MacroInput): MacroEvaluation {
  validateInput(input);

  if (input.scope === "outsideStandardScope") {
    return {
      status: "blocked",
      reason: "outsideStandardScope",
      message:
        "Bu genel hesaplama bazı özel durumlar için uygun değildir. Bu bilgilerle sayısal makro dağılımı oluşturulmadı.",
    };
  }

  const proteinWeight = calculateProteinCalculationWeight(input.weight, input.height);
  const { bmi } = proteinWeight;

  if (bmi < LOW_BMI_THRESHOLD && input.goal === "lose") {
    return {
      status: "blocked",
      reason: "underweightFatLoss",
      message:
        "Bu bilgilerle yağ kaybı için sayısal makro dağılımı oluşturulmadı.",
    };
  }

  const proteinPerKg = getProteinPerKg(input.goal, input.resistanceTraining);
  if (proteinPerKg === null) {
    return {
      status: "blocked",
      reason: "gainWithoutResistanceTraining",
      message:
        "Kas kazanımı hedefinde direnç antrenmanı önemli bir bileşendir. Bu nedenle kas kazanımı için sayısal protein hesabı uygulanmadı.",
    };
  }

  const usesReferenceWeight = proteinWeight.usesReferenceWeight;
  const proteinCalculationWeight = proteinWeight.calculationWeightKg;
  const proteinGramsRaw = proteinPerKg * proteinCalculationWeight;
  const proteinCaloriesRaw = proteinGramsRaw * PROTEIN_KCAL_PER_GRAM;
  const fatCaloriesRaw = input.calories * FAT_ENERGY_SHARE;
  const fatGramsRaw = fatCaloriesRaw / FAT_KCAL_PER_GRAM;
  const carbohydrateCaloriesRaw =
    input.calories - proteinCaloriesRaw - fatCaloriesRaw;

  if (carbohydrateCaloriesRaw < 0) {
    return {
      status: "blocked",
      reason: "incompatibleEnergyBudget",
      message:
        "Bu kalori hedefi, hesaplanan protein ve yağ başlangıç değerleriyle uyumlu bir makro dağılımı oluşturmuyor. Kalori hedefini gözden geçir.",
    };
  }

  const carbohydrateGramsRaw =
    carbohydrateCaloriesRaw / CARBOHYDRATE_KCAL_PER_GRAM;
  const warnings: MacroWarning[] = [];
  if (bmi < LOW_BMI_THRESHOLD) warnings.push("lowBmi");
  if (usesReferenceWeight) warnings.push("referenceWeightUsed");

  return {
    status: "ok",
    distribution: {
      protein: Math.round(proteinGramsRaw),
      carbohydrates: Math.round(carbohydrateGramsRaw),
      fat: Math.round(fatGramsRaw),
      proteinGramsRaw,
      carbohydrateGramsRaw,
      fatGramsRaw,
      proteinPercentage: (proteinCaloriesRaw / input.calories) * 100,
      carbohydratePercentage:
        (carbohydrateCaloriesRaw / input.calories) * 100,
      fatPercentage: FAT_ENERGY_SHARE * 100,
      proteinPerKg,
      bmi,
      proteinCalculationWeight,
      usesReferenceWeight,
      fiberReferenceGrams: FIBER_REFERENCE_GRAMS,
      warnings,
    },
  };
}
