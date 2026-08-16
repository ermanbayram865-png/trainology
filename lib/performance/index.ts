import { calculateEpleyOneRepMax } from "@/lib/calculators";
import {
  PERFORMANCE_CATEGORY_LABELS,
  PERFORMANCE_EXERCISES,
} from "@/lib/performance/constants";
import type {
  AnalyzedPerformanceExercise,
  DataConfidence,
  PerformanceAnalysis,
  PerformanceCategory,
  PerformanceCategoryAnalysis,
  PerformanceExerciseInput,
} from "@/types/performance";

export * from "./constants";

const minimumActiveExercises = 2;
const categoryOrder: readonly PerformanceCategory[] = ["push", "pull", "lower"];

export function calculateSessionVolume(weight: number, repetitions: number, sets: number) {
  return Math.round(weight * repetitions * sets);
}

export function calculateRelativeStrength(estimatedOneRepMax: number, bodyWeight?: number) {
  if (!bodyWeight || bodyWeight <= 0) {
    return undefined;
  }

  return Math.round((estimatedOneRepMax / bodyWeight) * 100) / 100;
}

export function getDataConfidence(activeExerciseCount: number): DataConfidence {
  if (activeExerciseCount >= 5) return "high";
  if (activeExerciseCount >= 3) return "medium";
  return "low";
}

export function analyzePerformance(
  inputs: readonly PerformanceExerciseInput[],
  bodyWeight?: number,
  weeklyTrainingDays?: number,
): PerformanceAnalysis {
  const exercises = inputs.flatMap<AnalyzedPerformanceExercise>((input) => {
    if (!input.enabled) return [];

    const definition = PERFORMANCE_EXERCISES.find((exercise) => exercise.id === input.id);
    const weight = Number(input.weight);
    const repetitions = Number(input.repetitions);
    const sets = Number(input.sets);

    if (!definition || !Number.isFinite(weight) || !Number.isFinite(repetitions) || !Number.isFinite(sets)) {
      return [];
    }

    const estimatedOneRepMax = calculateEpleyOneRepMax(weight, repetitions).estimatedOneRepMax;
    const rir = input.rir === "" ? undefined : Number(input.rir);

    return [{
      id: input.id,
      name: definition.name,
      category: definition.category,
      weight,
      repetitions,
      sets,
      rir: Number.isFinite(rir) ? rir : undefined,
      estimatedOneRepMax,
      relativeStrength: calculateRelativeStrength(estimatedOneRepMax, bodyWeight),
      volume: calculateSessionVolume(weight, repetitions, sets),
    }];
  });

  const categories = createCategoryAnalysis(exercises);
  const scoredCategories = categories.filter((category) => category.score !== undefined);
  const overallScore =
    exercises.length >= minimumActiveExercises && scoredCategories.length > 0
      ? Math.round(scoredCategories.reduce((sum, category) => sum + (category.score ?? 0), 0) / scoredCategories.length)
      : undefined;
  const availableCategories = scoredCategories.map((category) => category.category);
  const scores = scoredCategories.map((category) => category.score ?? 0);
  const maxScore = scores.length ? Math.max(...scores) : 0;
  const minScore = scores.length ? Math.min(...scores) : 0;
  const hasMeaningfulDifference = availableCategories.length >= 2 && maxScore - minScore >= 15;

  return {
    exercises,
    categories,
    overallScore,
    totalVolume: exercises.reduce((sum, exercise) => sum + exercise.volume, 0),
    estimatedWeeklyVolume:
      weeklyTrainingDays && weeklyTrainingDays > 0
        ? exercises.reduce((sum, exercise) => sum + exercise.volume, 0) * weeklyTrainingDays
        : undefined,
    confidence: getDataConfidence(exercises.length),
    activeExerciseCount: exercises.length,
    balancedCategories: hasMeaningfulDifference ? [] : availableCategories,
    strongerCategories: hasMeaningfulDifference
      ? scoredCategories.filter((category) => category.score === maxScore).map((category) => category.category)
      : [],
    opportunityCategories: hasMeaningfulDifference
      ? scoredCategories.filter((category) => category.score === minScore).map((category) => category.category)
      : [],
  };
}

function createCategoryAnalysis(
  exercises: readonly AnalyzedPerformanceExercise[],
): PerformanceCategoryAnalysis[] {
  const rawCategories = categoryOrder.map((category) => {
    const categoryExercises = exercises.filter((exercise) => exercise.category === category);
    const relativeStrengths = categoryExercises
      .map((exercise) => exercise.relativeStrength)
      .filter((value): value is number => value !== undefined);
    const averageRelativeStrength = relativeStrengths.length
      ? relativeStrengths.reduce((sum, value) => sum + value, 0) / relativeStrengths.length
      : undefined;
    const averageEstimatedOneRepMax = categoryExercises.length
      ? categoryExercises.reduce((sum, exercise) => sum + exercise.estimatedOneRepMax, 0) / categoryExercises.length
      : undefined;

    return {
      category,
      label: PERFORMANCE_CATEGORY_LABELS[category],
      exerciseCount: categoryExercises.length,
      averageRelativeStrength,
      averageEstimatedOneRepMax,
    };
  });

  const maximumComparableStrength = Math.max(
    0,
    ...rawCategories.map((category) => category.averageRelativeStrength ?? category.averageEstimatedOneRepMax ?? 0),
  );

  return rawCategories.map((category) => ({
    ...category,
    score:
      (category.averageRelativeStrength ?? category.averageEstimatedOneRepMax) !== undefined && maximumComparableStrength > 0
        ? Math.round(((category.averageRelativeStrength ?? category.averageEstimatedOneRepMax ?? 0) / maximumComparableStrength) * 100)
        : undefined,
  }));
}
