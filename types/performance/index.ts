export type PerformanceGender = "female" | "male" | "prefer-not-to-say";

export type PerformanceExperience = "beginner" | "intermediate" | "advanced";

export type PerformanceGoal = "muscle" | "strength" | "general";

export type PerformanceCategory = "push" | "pull" | "lower";

export type PerformanceExerciseId =
  | "bench-press"
  | "squat"
  | "deadlift"
  | "overhead-press"
  | "vertical-pull"
  | "row";

export type PerformanceUserProfile = {
  gender: PerformanceGender;
  age: string;
  bodyWeight: string;
  experience: PerformanceExperience;
  weeklyTrainingDays: string;
  goal: PerformanceGoal;
};

export type PerformanceExerciseInput = {
  id: PerformanceExerciseId;
  enabled: boolean;
  weight: string;
  repetitions: string;
  sets: string;
  rir: string;
};

export type AnalyzedPerformanceExercise = {
  id: PerformanceExerciseId;
  name: string;
  category: PerformanceCategory;
  weight: number;
  repetitions: number;
  sets: number;
  rir?: number;
  estimatedOneRepMax: number;
  relativeStrength?: number;
  volume: number;
};

export type PerformanceCategoryAnalysis = {
  category: PerformanceCategory;
  label: string;
  score?: number;
  averageRelativeStrength?: number;
  averageEstimatedOneRepMax?: number;
  exerciseCount: number;
};

export type DataConfidence = "low" | "medium" | "high";

export type PerformanceAnalysis = {
  exercises: AnalyzedPerformanceExercise[];
  categories: PerformanceCategoryAnalysis[];
  overallScore?: number;
  totalVolume: number;
  estimatedWeeklyVolume?: number;
  confidence: DataConfidence;
  activeExerciseCount: number;
  balancedCategories: PerformanceCategory[];
  strongerCategories: PerformanceCategory[];
  opportunityCategories: PerformanceCategory[];
};
