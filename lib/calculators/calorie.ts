import {
  calculateMifflinStJeorRmr,
  calculateTargetScenario,
  evaluateEnergyLab,
  getFatLossPolicy,
  type ActivityProfile,
} from "@/lib/energy-lab";

import type { ActivityLevel, CalorieGender, Goal } from "./types";

type CalorieRange = {
  min: number;
  max: number;
};

/**
 * Compatibility shape for the legacy Health Snapshot module.
 * All energy values now come from the single Energy Lab/NASEM engine.
 */
export type CalorieRequirement = {
  bmr: number;
  tdee: number;
  fatLoss: CalorieRange;
  muscleGain: CalorieRange;
  recommendedCalories: number;
};

const activityProfileMap: Record<ActivityLevel, ActivityProfile> = {
  sedentary: "inactive",
  light: "lowActive",
  moderate: "active",
  active: "veryActive",
  veryActive: "veryActive",
};

export function calculateMifflinStJeorBmr({
  gender,
  age,
  height,
  weight,
}: {
  gender: CalorieGender;
  age: number;
  height: number;
  weight: number;
}): number {
  return Math.round(
    calculateMifflinStJeorRmr({
      sex: gender,
      age,
      heightCm: height,
      weightKg: weight,
    }),
  );
}

export function calculateCalorieRequirement({
  gender,
  age,
  height,
  weight,
  activityLevel,
  goal,
}: {
  gender: CalorieGender;
  age: number;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}): CalorieRequirement {
  const evaluation = evaluateEnergyLab({
    age,
    sex: gender,
    heightCm: height,
    weightKg: weight,
    activityProfiles: [activityProfileMap[activityLevel]],
    performancePriority: false,
    safetyFlags: [],
  });

  if (evaluation.status !== "ready") {
    throw new RangeError(
      "Bu girdi Energy Lab yetişkin genel kullanıcı kapsamı dışında; sayısal enerji hedefi üretilmedi.",
    );
  }

  const policy = getFatLossPolicy(
    evaluation.bmi,
    false,
    evaluation.scope.fatLossAllowed,
  );
  const defaultLossRate = policy.defaultRate ?? 0.1;
  const lossScenario = calculateTargetScenario({
    evaluation,
    selection: { goal: "lose", rate: defaultLossRate },
    performancePriority: false,
  });
  const gainScenario = calculateTargetScenario({
    evaluation,
    selection: { goal: "gain", mode: "smallSurplus" },
    performancePriority: false,
  });

  const maintenance = evaluation.maintenance.displayMin;
  const lossTarget =
    lossScenario.status === "available" ? lossScenario.displayMin : maintenance;
  const gainTarget =
    gainScenario.status === "available" ? gainScenario.displayMin : maintenance;
  const recommendedCalories =
    goal === "lose" ? lossTarget : goal === "gain" ? gainTarget : maintenance;

  return {
    bmr: Math.round(evaluation.mifflinRmr),
    tdee: maintenance,
    fatLoss: { min: lossTarget, max: lossTarget },
    muscleGain: { min: maintenance, max: gainTarget },
    recommendedCalories,
  };
}
