export type BiologicalSex = "female" | "male";

export type ActivityProfile =
  | "inactive"
  | "lowActive"
  | "active"
  | "veryActive";

export type EnergyGoal = "maintain" | "lose" | "gain";

export type DeficitRate = 0.1 | 0.15 | 0.2;

export type GainMode = "maintenance" | "smallSurplus";

export type SafetyFlag =
  | "pregnancyOrBreastfeeding"
  | "eatingDisorderOrRedsRisk"
  | "competitionOrExtremeAthleteContext"
  | "medicalReviewContext";

export type EnergyLabInput = {
  age: number;
  sex: BiologicalSex;
  heightCm: number;
  weightKg: number;
  activityProfiles: readonly ActivityProfile[];
  performancePriority: boolean;
  safetyFlags: readonly SafetyFlag[];
};

export type ScopeReasonCode =
  | "UNDER_19"
  | "BMI_UNDER_16"
  | "BMI_UNDER_18_5"
  | "BMI_50_OR_ABOVE"
  | "PREGNANCY_OR_BREASTFEEDING"
  | "EATING_DISORDER_OR_REDS_RISK"
  | "COMPETITION_OR_EXTREME_ATHLETE_CONTEXT"
  | "MEDICAL_REVIEW_CONTEXT";

export type ScopeReason = {
  code: ScopeReasonCode;
  title: string;
  message: string;
};

export type ScopeDecision = {
  status: "eligible" | "limited" | "blocked";
  fatLossAllowed: boolean;
  reasons: readonly ScopeReason[];
};

export type EnergyInputErrorCode =
  | "INVALID_AGE"
  | "INVALID_SEX"
  | "INVALID_HEIGHT"
  | "INVALID_WEIGHT"
  | "INVALID_ACTIVITY_SELECTION"
  | "INVALID_SAFETY_FLAGS";

export type EnergyInputError = {
  code: EnergyInputErrorCode;
  field: "age" | "sex" | "heightCm" | "weightKg" | "activityProfiles" | "safetyFlags";
  message: string;
};

export type MaintenancePoint = {
  profile: ActivityProfile;
  rawKcal: number;
  displayKcal: number;
};

export type MaintenanceEstimate = {
  kind: "single" | "range";
  points: readonly MaintenancePoint[];
  rawMin: number;
  rawMax: number;
  displayMin: number;
  displayMax: number;
};

export type InvalidEnergyEvaluation = {
  status: "invalid";
  errors: readonly EnergyInputError[];
};

export type BlockedEnergyEvaluation = {
  status: "blocked";
  bmi: number;
  scope: ScopeDecision;
};

export type ReadyEnergyEvaluation = {
  status: "ready";
  bmi: number;
  mifflinRmr: number;
  scope: ScopeDecision;
  maintenance: MaintenanceEstimate;
};

export type EnergyLabEvaluation =
  | InvalidEnergyEvaluation
  | BlockedEnergyEvaluation
  | ReadyEnergyEvaluation;

export type FatLossOption = {
  rate: DeficitRate;
  label: string;
  enabled: boolean;
  reason?: string;
};

export type FatLossPolicy = {
  defaultRate: DeficitRate | null;
  deficitCapKcal: number | null;
  options: readonly FatLossOption[];
};

export type GoalSelection =
  | { goal: "maintain" }
  | { goal: "lose"; rate: DeficitRate }
  | { goal: "gain"; mode: GainMode };

export type TargetPoint = {
  profile: ActivityProfile;
  rawKcal: number;
  displayKcal: number;
  actualDeficitKcal?: number;
};

export type AvailableTargetScenario = {
  status: "available";
  goal: EnergyGoal;
  selection: GoalSelection;
  points: readonly TargetPoint[];
  rawMin: number;
  rawMax: number;
  displayMin: number;
  displayMax: number;
};

export type UnavailableTargetReason =
  | "SCOPE_BLOCKED"
  | "FAT_LOSS_NOT_AVAILABLE"
  | "OPTION_NOT_AVAILABLE"
  | "TARGET_BELOW_1200"
  | "INVALID_SELECTION";

export type UnavailableTargetScenario = {
  status: "unavailable";
  goal: EnergyGoal;
  reason: UnavailableTargetReason;
  message: string;
};

export type TargetScenario =
  | AvailableTargetScenario
  | UnavailableTargetScenario;
