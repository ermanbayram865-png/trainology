import type { CalorieGender, Goal } from "@/lib/calculators";

export type AnalysisActivityLevel = "low" | "moderate" | "high";

export type AnalysisInput = {
  age: number;
  gender: CalorieGender;
  height: number;
  weight: number;
  goal: Goal;
  activityLevel: AnalysisActivityLevel;
  weeklyTrainingDays?: number;
  dailySteps?: number;
};

export type BodySummary = { bmi: number; bmiCategory: string; healthyWeightRange: { minimumWeight: number; maximumWeight: number } };
export type NutritionSummary = { maintenanceCalories: number; targetCalories: number; targetRange?: { min: number; max: number }; dailyProtein: number; proteinPerKg: number; macro: { protein: number; carbohydrates: number; fat: number; proteinPercentage: number; carbohydratePercentage: number; fatPercentage: number }; water: { minimumLiters: number; maximumLiters: number } };
export type ActivitySummary = { weeklyTrainingDays?: number; dailySteps?: number; message?: string };
export type TargetSummary = { label: string; message: string };
export type AnalysisResult = { body: BodySummary; nutrition: NutritionSummary; activity: ActivitySummary; target: TargetSummary };
