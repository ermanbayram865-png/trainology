export type BiologicalSex = "female" | "male";

export type ActivityProfile =
  | "inactive"
  | "lowActive"
  | "active"
  | "veryActive";

export type EnergyGoal = "maintain" | "lose" | "gain";

export type GainMode = "maintenance" | "smallSurplus";

export type GeneralScopeSelection = "standardAdult" | "mayBeOutsideScope";

export type EnergyLabInput = {
  age: number;
  sex: BiologicalSex;
  heightCm: number;
  weightKg: number;
  activityProfiles: readonly ActivityProfile[];
  generalScope: GeneralScopeSelection;
};

export type ScopeReasonCode =
  | "UNDER_19"
  | "BMI_UNDER_16"
  | "BMI_UNDER_18_5"
  | "BMI_50_OR_ABOVE"
  | "MAY_BE_OUTSIDE_GENERAL_SCOPE";

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
  | "INVALID_GENERAL_SCOPE";

export type EnergyInputError = {
  code: EnergyInputErrorCode;
  field: "age" | "sex" | "heightCm" | "weightKg" | "activityProfiles" | "generalScope";
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

export type GoalSelection =
  | { goal: "maintain" }
  | { goal: "lose" }
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
  | "FAT_LOSS_NOT_AVAILABLE"
  | "TARGET_AT_OR_BELOW_1200"
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
