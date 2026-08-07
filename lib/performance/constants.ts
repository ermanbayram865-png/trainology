import type {
  PerformanceCategory,
  PerformanceExerciseId,
} from "@/types/performance";

export type PerformanceExerciseDefinition = {
  id: PerformanceExerciseId;
  name: string;
  category: PerformanceCategory;
  categoryLabel: string;
  description: string;
};

export const PERFORMANCE_EXERCISES: readonly PerformanceExerciseDefinition[] = [
  {
    id: "bench-press",
    name: "Bench Press",
    category: "push",
    categoryLabel: "İtiş",
    description: "Yatay itiş performansını gözlemlemek için.",
  },
  {
    id: "squat",
    name: "Squat",
    category: "lower",
    categoryLabel: "Alt Vücut",
    description: "Alt vücut kuvveti için temel bir referans.",
  },
  {
    id: "deadlift",
    name: "Deadlift",
    category: "lower",
    categoryLabel: "Alt Vücut",
    description: "Kalça dominant alt vücut performansı için.",
  },
  {
    id: "overhead-press",
    name: "Overhead Press",
    category: "push",
    categoryLabel: "İtiş",
    description: "Dikey itiş performansını gözlemlemek için.",
  },
  {
    id: "vertical-pull",
    name: "Lat Pulldown / Pull-up",
    category: "pull",
    categoryLabel: "Çekiş",
    description: "Dikey çekiş performansı için.",
  },
  {
    id: "row",
    name: "Row",
    category: "pull",
    categoryLabel: "Çekiş",
    description: "Yatay çekiş performansını gözlemlemek için.",
  },
] as const;

export const PERFORMANCE_CATEGORY_LABELS: Record<PerformanceCategory, string> = {
  push: "İtiş",
  pull: "Çekiş",
  lower: "Alt Vücut",
};
