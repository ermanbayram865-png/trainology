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

function validateInput(input: MacroInput) {
  if (!Number.isFinite(input.calories) || input.calories <= 0) {
    throw new RangeError("Kalori hedefi pozitif ve sonlu bir sayı olmalıdır.");
  }
  if (!Number.isFinite(input.weight) || input.weight <= 0) {
    throw new RangeError("Kilo pozitif ve sonlu bir sayı olmalıdır.");
  }
  if (!Number.isFinite(input.height) || input.height <= 0) {
    throw new RangeError("Boy pozitif ve sonlu bir sayı olmalıdır.");
  }
  if (!(["lose", "maintain", "gain"] as const).includes(input.goal)) {
    throw new RangeError("Geçerli bir hedef seçilmelidir.");
  }
  if (!(["yes", "no"] as const).includes(input.resistanceTraining)) {
    throw new RangeError("Geçerli bir direnç antrenmanı seçimi yapılmalıdır.");
  }
  if (!(["standardAdult", "outsideStandardScope"] as const).includes(input.scope)) {
    throw new RangeError("Geçerli bir kapsam seçimi yapılmalıdır.");
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
        "Bu araç standart sağlıklı yetişkin kapsamı için tasarlanmıştır. Bu bilgilerle sayısal makro dağılımı oluşturulmadı.",
    };
  }

  const proteinWeight = calculateProteinCalculationWeight(input.weight, input.height);
  const { bmi } = proteinWeight;

  if (bmi < LOW_BMI_THRESHOLD && input.goal === "lose") {
    return {
      status: "blocked",
      reason: "underweightFatLoss",
      message:
        "Bu bilgilerle yağ kaybı için standart sayısal makro dağılımı oluşturulmadı.",
    };
  }

  const proteinPerKg = getProteinPerKg(input.goal, input.resistanceTraining);
  if (proteinPerKg === null) {
    return {
      status: "blocked",
      reason: "gainWithoutResistanceTraining",
      message:
        "Kas kazanımı hedefinde direnç antrenmanı önemli bir bileşendir. Bu nedenle standart kas kazanımı protein hesabı uygulanmadı.",
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
