export type MovementCategory =
  | "Push"
  | "Pull"
  | "Legs"
  | "Core"
  | "Full Body / Olympic";

export type MuscleGroup =
  | "Chest"
  | "Back"
  | "Legs"
  | "Shoulders"
  | "Arms"
  | "Core"
  | "Full Body";

export type Equipment = "Barbell" | "Dumbbell" | "Bodyweight" | "Machine" | "Cable";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Movement = {
  id: string;
  name: string;
  slug: string;
  category: MovementCategory;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  difficulty: Difficulty;
  description: string;
  instructions: string[];
  commonMistakes: string[];
  tags: readonly string[];
  image: string;
};

export type MovementFilters = {
  muscleGroup?: MuscleGroup;
  equipment?: Equipment;
  difficulty?: Difficulty;
};
