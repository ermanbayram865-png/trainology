import type {
  ActivityLevel,
  CalorieGender,
  CalculatorOption,
  Gender,
  Goal,
  MacroActivityLevel,
  MacroProteinPreference,
  ProteinGoal,
  ProteinTrainingProfile,
} from "./types";

export const ACTIVITY_LEVELS: readonly CalculatorOption[] = [
  { label: "Hareketsiz", value: "sedentary", description: "Masa başı yaşam" },
  { label: "Hafif aktif", value: "light", description: "Haftada 1-3 gün" },
  { label: "Orta aktif", value: "moderate", description: "Haftada 3-5 gün" },
  { label: "Aktif", value: "active", description: "Haftada 6-7 gün" },
  { label: "Çok aktif", value: "veryActive", description: "Yoğun fiziksel aktivite" },
] as const;

export const GOALS: readonly CalculatorOption[] = [
  { label: "Yağ kaybı", value: "lose" },
  { label: "Koruma", value: "maintain" },
  { label: "Kas kazanımı", value: "gain" },
] as const;

export const GENDERS: readonly CalculatorOption[] = [
  { label: "Kadın", value: "female" },
  { label: "Erkek", value: "male" },
  { label: "Diğer", value: "other" },
] as const;

export const CALORIE_GENDERS: readonly CalculatorOption[] = [
  { label: "Erkek", value: "male" },
  { label: "Kadın", value: "female" },
] as const;

export const CALORIE_ACTIVITY_LEVELS: readonly CalculatorOption[] = [
  { label: "Sedanter", value: "sedentary" },
  { label: "Hafif aktif", value: "light" },
  { label: "Orta aktif", value: "moderate" },
  { label: "Çok aktif", value: "active" },
  { label: "Ekstra aktif", value: "veryActive" },
] as const;

export const CALORIE_GOALS: readonly CalculatorOption[] = [
  { label: "Kilo koruma", value: "maintain" },
  { label: "Yağ kaybı", value: "lose" },
  { label: "Kas kazanımı", value: "gain" },
] as const;

export const MACRO_PROTEIN_PREFERENCES: readonly CalculatorOption[] = [
  { label: "Standart", value: "standard" },
  { label: "Yüksek protein", value: "highProtein" },
] as const;

export const MACRO_ACTIVITY_LEVELS: readonly CalculatorOption[] = [
  { label: "Düşük", value: "low" },
  { label: "Orta", value: "moderate" },
  { label: "Yüksek", value: "high" },
] as const;

export const ONE_REP_MAX_EXERCISES: readonly CalculatorOption[] = [
  { label: "Bench Press", value: "benchPress" },
  { label: "Squat", value: "squat" },
  { label: "Deadlift", value: "deadlift" },
  { label: "Overhead Press", value: "overheadPress" },
  { label: "Diğer", value: "other" },
] as const;

export const PROTEIN_TRAINING_PROFILES: readonly CalculatorOption[] = [
  { label: "Düzenli egzersiz yapmıyorum", value: "none" },
  { label: "Düzenli egzersiz yapıyorum", value: "regular_exercise" },
  {
    label: "Direnç / hipertrofi antrenmanı yapıyorum",
    value: "resistance_hypertrophy",
  },
] as const;

export const EFSA_ADULT_REFERENCE_CATEGORIES: readonly CalculatorOption[] = [
  { label: "Kadın yetişkin referansı", value: "adult_female_reference" },
  { label: "Erkek yetişkin referansı", value: "adult_male_reference" },
] as const;

export const PROTEIN_GOALS: readonly CalculatorOption[] = [
  { label: "Genel sağlık", value: "general_health" },
  { label: "Kilo koruma", value: "maintenance" },
  { label: "Kas kazanımı", value: "muscle_gain" },
  { label: "Yağ kaybı", value: "fat_loss" },
] as const;

export const SCOPE_RISK_OPTIONS: readonly CalculatorOption[] = [
  { label: "Hayır", value: "false" },
  { label: "Evet", value: "true" },
] as const;

export const DEFAULT_ACTIVITY_LEVEL: ActivityLevel = "moderate";
export const DEFAULT_GOAL: Goal = "maintain";
export const DEFAULT_GENDER: Gender = "other";
export const DEFAULT_CALORIE_GENDER: CalorieGender = "female";
export const DEFAULT_CALORIE_ACTIVITY_LEVEL: ActivityLevel = "moderate";
export const DEFAULT_CALORIE_GOAL: Goal = "maintain";
export const DEFAULT_MACRO_PROTEIN_PREFERENCE: MacroProteinPreference = "standard";
export const DEFAULT_MACRO_ACTIVITY_LEVEL: MacroActivityLevel = "moderate";
export const DEFAULT_PROTEIN_TRAINING_PROFILE: ProteinTrainingProfile | "" = "";
export const DEFAULT_PROTEIN_GOAL: ProteinGoal | "" = "";

export const CALCULATOR_LIMITS = {
  age: { min: 13, max: 120 },
  height: { min: 100, max: 250 },
  weight: { min: 25, max: 400 },
} as const;
