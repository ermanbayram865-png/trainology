export type HydrationEnvironment = "cool" | "normal" | "hot_humid";
export type PerceivedSweat = "low" | "moderate" | "high";
export type HydrationExerciseType = "resistance" | "cardio_running" | "team_sport" | "other";
export type UrinationStatus = "no" | "yes";

export type QuickHydrationInput = {
  durationMinutes: number;
  environment: HydrationEnvironment;
  perceivedSweat: PerceivedSweat;
  standardAdultScope: boolean;
};

export type QuickHydrationEvaluation =
  | { status: "invalid"; field: keyof QuickHydrationInput; message: string }
  | { status: "blocked"; reason: "outside_standard_scope" }
  | {
      status: "ready";
      summary: string;
      durationGuidance: string;
      environmentGuidance: string;
      sweatGuidance: string;
    };

export type SweatRateInput = {
  preWeightKg: number;
  postWeightKg: number;
  fluidConsumedMl: number;
  durationMinutes: number;
  exerciseType: HydrationExerciseType;
  environment: HydrationEnvironment;
  urinationStatus: UrinationStatus;
  urineMl?: number;
  standardAdultScope: boolean;
};

export type SweatRateResult = {
  status: "ready";
  preWeightKg: number;
  postWeightKg: number;
  bodyMassChangeKg: number;
  bodyMassLossEquivalentLiters: number;
  bodyMassChangePercentage: number;
  fluidConsumedLiters: number;
  urineLiters: number;
  durationHours: number;
  estimatedSweatLossLiters: number;
  sweatRateLitersPerHour: number;
  exerciseType: HydrationExerciseType;
  environment: HydrationEnvironment;
};

export type SweatRateEvaluation =
  | { status: "invalid"; field: keyof SweatRateInput | "estimatedSweatLoss"; message: string }
  | { status: "blocked"; reason: "outside_standard_scope" }
  | SweatRateResult;

const ENVIRONMENTS: readonly HydrationEnvironment[] = ["cool", "normal", "hot_humid"];
const SWEAT_LEVELS: readonly PerceivedSweat[] = ["low", "moderate", "high"];
const EXERCISE_TYPES: readonly HydrationExerciseType[] = [
  "resistance",
  "cardio_running",
  "team_sport",
  "other",
];
const URINATION_STATUSES: readonly UrinationStatus[] = ["no", "yes"];
const MILLILITERS_PER_LITER = 1000;
const LITERS_PER_KILOGRAM_BODY_MASS_CHANGE = 1;
const MINUTES_PER_HOUR = 60;

export function buildQuickHydrationGuide(
  input: QuickHydrationInput,
): QuickHydrationEvaluation {
  if (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) {
    return { status: "invalid", field: "durationMinutes", message: "Süre pozitif ve sonlu olmalıdır." };
  }
  if (!ENVIRONMENTS.includes(input.environment)) {
    return { status: "invalid", field: "environment", message: "Geçerli bir ortam seçilmelidir." };
  }
  if (!SWEAT_LEVELS.includes(input.perceivedSweat)) {
    return { status: "invalid", field: "perceivedSweat", message: "Geçerli bir terleme algısı seçilmelidir." };
  }
  if (typeof input.standardAdultScope !== "boolean") {
    return { status: "invalid", field: "standardAdultScope", message: "Kapsam onayı yanıtlanmalıdır." };
  }
  if (!input.standardAdultScope) {
    return { status: "blocked", reason: "outside_standard_scope" };
  }

  const needsMorePlanning = input.environment === "hot_humid" || input.perceivedSweat === "high";

  return {
    status: "ready",
    summary: needsMorePlanning
      ? "Bu antrenmanda hidrasyon planlaması daha önemli olabilir. Bu bağlamsal bir rehberdir; klinik risk sınıfı veya sıvı reçetesi değildir."
      : "Bu antrenmanda susama sinyallerini ve sıvıya erişimi önceden düşünmek pratik olabilir. Bu değerlendirme sıvı miktarı hesaplamaz.",
    durationGuidance: `${input.durationMinutes} dakikalık seans boyunca sıvıya erişimini önceden planla; sabit aralıklarla zorunlu tüketim hedefi uygulanmaz.`,
    environmentGuidance:
      input.environment === "hot_humid"
        ? "Sıcak veya nemli koşullarda planlamaya daha fazla dikkat et; ortam için otomatik sıvı eklemesi yapılmaz."
        : input.environment === "cool"
          ? "Serin veya kontrollü ortam seçtin; yine de susama sinyallerini göz ardı etme."
          : "Ilıman koşullar seçtin; sıvıya erişimi seans bağlamına göre planla.",
    sweatGuidance:
      input.perceivedSweat === "high"
        ? "Terlemeyi yüksek algılıyorsun. Daha hassas kişiselleştirme için tartı temelli terleme hızı ölçümünü kullanabilirsin."
        : input.perceivedSweat === "low"
          ? "Terlemeyi düşük algılıyorsun; bu öznel seçim L/saat değerine dönüştürülmez."
          : "Terleme algın orta; bu öznel seçim sayısal ter kaybı hesabı değildir.",
  };
}

export function calculateSweatRate(input: SweatRateInput): SweatRateEvaluation {
  if (!Number.isFinite(input.preWeightKg) || input.preWeightKg <= 0) {
    return { status: "invalid", field: "preWeightKg", message: "Antrenman öncesi kilo pozitif ve sonlu olmalıdır." };
  }
  if (!Number.isFinite(input.postWeightKg) || input.postWeightKg <= 0) {
    return { status: "invalid", field: "postWeightKg", message: "Antrenman sonrası kilo pozitif ve sonlu olmalıdır." };
  }
  if (!Number.isFinite(input.fluidConsumedMl) || input.fluidConsumedMl < 0) {
    return { status: "invalid", field: "fluidConsumedMl", message: "İçilen sıvı negatif olmayan sonlu bir sayı olmalıdır." };
  }
  if (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) {
    return { status: "invalid", field: "durationMinutes", message: "Süre pozitif ve sonlu olmalıdır." };
  }
  if (!EXERCISE_TYPES.includes(input.exerciseType)) {
    return { status: "invalid", field: "exerciseType", message: "Geçerli bir egzersiz türü seçilmelidir." };
  }
  if (!ENVIRONMENTS.includes(input.environment)) {
    return { status: "invalid", field: "environment", message: "Geçerli bir ortam seçilmelidir." };
  }
  if (!URINATION_STATUSES.includes(input.urinationStatus)) {
    return { status: "invalid", field: "urinationStatus", message: "İdrar durumu yanıtlanmalıdır." };
  }
  if (input.urinationStatus === "yes" && (!Number.isFinite(input.urineMl) || (input.urineMl ?? -1) < 0)) {
    return { status: "invalid", field: "urineMl", message: "İdrar miktarı negatif olmayan sonlu bir sayı olmalıdır." };
  }
  if (typeof input.standardAdultScope !== "boolean") {
    return { status: "invalid", field: "standardAdultScope", message: "Kapsam onayı yanıtlanmalıdır." };
  }
  if (!input.standardAdultScope) {
    return { status: "blocked", reason: "outside_standard_scope" };
  }

  const bodyMassChangeKg = input.preWeightKg - input.postWeightKg;
  const bodyMassLossEquivalentLiters =
    bodyMassChangeKg * LITERS_PER_KILOGRAM_BODY_MASS_CHANGE;
  const fluidConsumedLiters = input.fluidConsumedMl / MILLILITERS_PER_LITER;
  const urineLiters =
    input.urinationStatus === "yes" ? (input.urineMl ?? 0) / MILLILITERS_PER_LITER : 0;
  const durationHours = input.durationMinutes / MINUTES_PER_HOUR;
  const estimatedSweatLossLiters =
    bodyMassLossEquivalentLiters + fluidConsumedLiters - urineLiters;

  if (!Number.isFinite(estimatedSweatLossLiters) || estimatedSweatLossLiters < 0) {
    return {
      status: "invalid",
      field: "estimatedSweatLoss",
      message: "Bu girdiler negatif veya geçersiz tahmini ter kaybı üretiyor. Ölçümleri kontrol et.",
    };
  }

  const sweatRateLitersPerHour = estimatedSweatLossLiters / durationHours;
  if (!Number.isFinite(sweatRateLitersPerHour)) {
    return {
      status: "invalid",
      field: "estimatedSweatLoss",
      message: "Bu girdilerle sonlu bir terleme hızı hesaplanamadı.",
    };
  }

  return {
    status: "ready",
    preWeightKg: input.preWeightKg,
    postWeightKg: input.postWeightKg,
    bodyMassChangeKg,
    bodyMassLossEquivalentLiters,
    bodyMassChangePercentage: (bodyMassChangeKg / input.preWeightKg) * 100,
    fluidConsumedLiters,
    urineLiters,
    durationHours,
    estimatedSweatLossLiters,
    sweatRateLitersPerHour,
    exerciseType: input.exerciseType,
    environment: input.environment,
  };
}
