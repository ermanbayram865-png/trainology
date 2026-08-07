import type { ActivityLevel, CalorieGender, Goal } from "./types";

type CalorieRange = {
  min: number;
  max: number;
};

export type CalorieRequirement = {
  bmr: number;
  tdee: number;
  fatLoss: CalorieRange;
  muscleGain: CalorieRange;
  recommendedCalories: number;
};

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
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
  const genderAdjustment = gender === "male" ? 5 : -161;

  return Math.round(10 * weight + 6.25 * height - 5 * age + genderAdjustment);
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
  const bmr = calculateMifflinStJeorBmr({ gender, age, height, weight });
  const tdee = Math.round(bmr * activityMultipliers[activityLevel]);
  const fatLoss = { min: tdee - 500, max: tdee - 300 };
  const muscleGain = { min: tdee + 200, max: tdee + 400 };
  const recommendedCalories =
    goal === "lose"
      ? Math.round((fatLoss.min + fatLoss.max) / 2)
      : goal === "gain"
        ? Math.round((muscleGain.min + muscleGain.max) / 2)
        : tdee;

  return { bmr, tdee, fatLoss, muscleGain, recommendedCalories };
}
