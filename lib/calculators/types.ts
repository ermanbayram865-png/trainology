export type Gender = "female" | "male" | "other";

export type CalorieGender = Exclude<Gender, "other">;

export type Goal = "lose" | "maintain" | "gain";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "veryActive";

export type ProteinGoal =
  | "general_health"
  | "maintenance"
  | "muscle_gain"
  | "fat_loss";

export type ProteinTrainingProfile =
  | "none"
  | "regular_exercise"
  | "resistance_hypertrophy";

export type EfsaAdultReferenceCategory =
  | "adult_female_reference"
  | "adult_male_reference";

export type MacroProteinPreference = "standard" | "highProtein";

export type MacroActivityLevel = "low" | "moderate" | "high";

export type CalculatorFieldType = "number" | "select" | "radio" | "toggle";

export type CalculatorFieldValue = string | boolean;

export type CalculatorFormValues = Record<string, CalculatorFieldValue>;

export type CalculatorOption = {
  label: string;
  value: string;
  description?: string;
};

export type CalculatorField = {
  name: string;
  label: string;
  type: CalculatorFieldType;
  helperText?: string;
  required?: boolean;
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: readonly CalculatorOption[];
};

export type CalculatorResultColor = "gold" | "success" | "neutral" | "warning";

export type CalculatorResult = {
  title: string;
  value: string | number;
  unit?: string;
  color?: CalculatorResultColor;
  explanation?: string;
};

export type CalculatorValidationErrors = Record<string, string | undefined>;
