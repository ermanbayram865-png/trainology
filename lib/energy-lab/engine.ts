import type {
  ActivityProfile,
  BiologicalSex,
  DeficitRate,
  EnergyInputError,
  EnergyLabEvaluation,
  EnergyLabInput,
  FatLossPolicy,
  GoalSelection,
  MaintenanceEstimate,
  ReadyEnergyEvaluation,
  ScopeDecision,
  ScopeReason,
  SafetyFlag,
  TargetPoint,
  TargetScenario,
} from "./types";

type NasemCoefficients = {
  intercept: number;
  age: number;
  heightCm: number;
  weightKg: number;
};

/**
 * NASEM 2023, Dietary Reference Intakes for Energy, Table 5-16 / Table S-3.
 * Adult equations use age in years, height in centimetres and weight in kilograms.
 * https://www.ncbi.nlm.nih.gov/books/NBK591021/table/tab_5_16/
 */
export const NASEM_2023_ADULT_EER_COEFFICIENTS: Readonly<
  Record<BiologicalSex, Readonly<Record<ActivityProfile, NasemCoefficients>>>
> = {
  male: {
    inactive: { intercept: 753.07, age: -10.83, heightCm: 6.5, weightKg: 14.1 },
    lowActive: { intercept: 581.47, age: -10.83, heightCm: 8.3, weightKg: 14.94 },
    active: { intercept: 1004.82, age: -10.83, heightCm: 6.52, weightKg: 15.91 },
    veryActive: { intercept: -517.88, age: -10.83, heightCm: 15.61, weightKg: 19.11 },
  },
  female: {
    inactive: { intercept: 584.9, age: -7.01, heightCm: 5.72, weightKg: 11.71 },
    lowActive: { intercept: 575.77, age: -7.01, heightCm: 6.6, weightKg: 12.14 },
    active: { intercept: 710.25, age: -7.01, heightCm: 6.54, weightKg: 12.34 },
    veryActive: { intercept: 511.83, age: -7.01, heightCm: 9.07, weightKg: 12.56 },
  },
};

export const ACTIVITY_PROFILE_ORDER: readonly ActivityProfile[] = [
  "inactive",
  "lowActive",
  "active",
  "veryActive",
];

const VALID_SAFETY_FLAGS: readonly SafetyFlag[] = [
  "pregnancyOrBreastfeeding",
  "eatingDisorderOrRedsRisk",
  "competitionOrExtremeAthleteContext",
  "medicalReviewContext",
];

const DEFICIT_RATES: readonly DeficitRate[] = [0.1, 0.15, 0.2];

export function roundToNearest50(value: number): number {
  if (!Number.isFinite(value)) {
    throw new RangeError("Enerji değeri sonlu bir sayı olmalıdır.");
  }

  return Math.round(value / 50) * 50;
}

export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightMetres = heightCm / 100;
  return weightKg / heightMetres ** 2;
}

export function calculateMifflinStJeorRmr({
  sex,
  age,
  heightCm,
  weightKg,
}: {
  sex: BiologicalSex;
  age: number;
  heightCm: number;
  weightKg: number;
}): number {
  const sexAdjustment = sex === "male" ? 5 : -161;
  return 10 * weightKg + 6.25 * heightCm - 5 * age + sexAdjustment;
}

export function calculateNasem2023AdultEer({
  sex,
  age,
  heightCm,
  weightKg,
  activityProfile,
}: {
  sex: BiologicalSex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityProfile: ActivityProfile;
}): number {
  if (age < 19) {
    throw new RangeError("NASEM 2023 yetişkin EER denklemi yalnız 19 yaş ve üzeri için kullanılır.");
  }

  const coefficients = NASEM_2023_ADULT_EER_COEFFICIENTS[sex]?.[activityProfile];

  if (!coefficients) {
    throw new RangeError("Geçersiz biyolojik cinsiyet veya aktivite profili.");
  }

  const result =
    coefficients.intercept +
    coefficients.age * age +
    coefficients.heightCm * heightCm +
    coefficients.weightKg * weightKg;

  if (!Number.isFinite(result) || result <= 0) {
    throw new RangeError("NASEM sonucu geçerli bir pozitif enerji değeri üretmedi.");
  }

  return result;
}

export function validateEnergyLabInput(input: EnergyLabInput): readonly EnergyInputError[] {
  const errors: EnergyInputError[] = [];

  if (!Number.isInteger(input.age) || input.age < 13 || input.age > 120) {
    errors.push({
      code: "INVALID_AGE",
      field: "age",
      message: "Yaş 13 ile 120 arasında tam sayı olmalıdır.",
    });
  }

  if (input.sex !== "female" && input.sex !== "male") {
    errors.push({
      code: "INVALID_SEX",
      field: "sex",
      message: "Hesaplama için gerekli biyolojik cinsiyet seçilmelidir.",
    });
  }

  if (!Number.isFinite(input.heightCm) || input.heightCm < 100 || input.heightCm > 250) {
    errors.push({
      code: "INVALID_HEIGHT",
      field: "heightCm",
      message: "Boy 100 ile 250 cm arasında olmalıdır.",
    });
  }

  if (!Number.isFinite(input.weightKg) || input.weightKg < 25 || input.weightKg > 400) {
    errors.push({
      code: "INVALID_WEIGHT",
      field: "weightKg",
      message: "Kilo 25 ile 400 kg arasında olmalıdır.",
    });
  }

  if (!isValidActivitySelection(input.activityProfiles)) {
    errors.push({
      code: "INVALID_ACTIVITY_SELECTION",
      field: "activityProfiles",
      message: "Bir aktivite profili veya birbirine komşu iki profil seçilmelidir.",
    });
  }

  if (
    !Array.isArray(input.safetyFlags) ||
    input.safetyFlags.some((flag) => !VALID_SAFETY_FLAGS.includes(flag))
  ) {
    errors.push({
      code: "INVALID_SAFETY_FLAGS",
      field: "safetyFlags",
      message: "Kapsam ve güvenlik seçimi geçerli değil.",
    });
  }

  return errors;
}

export function isValidActivitySelection(
  activityProfiles: readonly ActivityProfile[],
): boolean {
  if (!Array.isArray(activityProfiles) || activityProfiles.length < 1 || activityProfiles.length > 2) {
    return false;
  }

  const indexes = activityProfiles.map((profile) => ACTIVITY_PROFILE_ORDER.indexOf(profile));
  if (indexes.some((index) => index < 0) || new Set(indexes).size !== indexes.length) {
    return false;
  }

  return indexes.length === 1 || Math.abs(indexes[0] - indexes[1]) === 1;
}

export function evaluateScope(input: EnergyLabInput, bmi: number): ScopeDecision {
  const blockingReasons: ScopeReason[] = [];
  const limitingReasons: ScopeReason[] = [];

  if (input.age < 19) {
    blockingReasons.push({
      code: "UNDER_19",
      title: "Yetişkin motorunun kapsamı dışında",
      message:
        "Energy Lab yetişkin denklemleri 19 yaş ve üzeri için tasarlanmıştır. Bu yaş grubunda kişiye uygun değerlendirme için sağlık profesyoneline başvurun.",
    });
  }

  if (bmi < 16) {
    blockingReasons.push({
      code: "BMI_UNDER_16",
      title: "Otomatik hedef için uygun değil",
      message:
        "Bu genel araç bu aralıkta standart sayısal hedef üretmez. Kişisel durumunuzu değerlendirebilecek bir hekim veya diyetisyenle görüşün.",
    });
  } else if (bmi < 18.5) {
    limitingReasons.push({
      code: "BMI_UNDER_18_5",
      title: "Yağ kaybı seçeneği kullanılamıyor",
      message:
        "Genel BMI referansında 18,5 altındaki değerlerde Energy Lab kilo kaybı hedefi üretmez. Bu, yargı veya tanı değil; ürün içi koruyucu bir sınırdır.",
    });
  }

  if (bmi >= 50) {
    blockingReasons.push({
      code: "BMI_50_OR_ABOVE",
      title: "Bireysel değerlendirme gerekli",
      message:
        "Bu genel başlangıç hesaplayıcısı bu aralıkta standart sonuç sunmaz. Güvenli ve kişiye uygun planlama için hekim veya diyetisyen değerlendirmesi önerilir.",
    });
  }

  const safetyReasonMap: Record<SafetyFlag, ScopeReason> = {
    pregnancyOrBreastfeeding: {
      code: "PREGNANCY_OR_BREASTFEEDING",
      title: "Hamilelik veya emzirme için ayrı değerlendirme gerekir",
      message:
        "Bu yetişkin genel amaçlı motor hamilelik ve emzirme dönemlerine yönelik sayısal hedef üretmez. Kişisel değerlendirme için sağlık profesyoneline başvurun.",
    },
    eatingDisorderOrRedsRisk: {
      code: "EATING_DISORDER_OR_REDS_RISK",
      title: "Enerji hedefi yerine profesyonel destek",
      message:
        "Aktif veya şüpheli yeme bozukluğu ya da RED-S riski varsa otomatik enerji hedefi uygun değildir. Nitelikli bir sağlık profesyonelinden destek alın.",
    },
    competitionOrExtremeAthleteContext: {
      code: "COMPETITION_OR_EXTREME_ATHLETE_CONTEXT",
      title: "Sporcu bağlamı genel aracın kapsamını aşıyor",
      message:
        "Yarışma hazırlığı, çok düşük yağ oranı, elit sporculuk veya aşırı yüksek antrenman hacmi bireysel takip gerektirir. Energy Lab bu bağlamda standart hedef üretmez.",
    },
    medicalReviewContext: {
      code: "MEDICAL_REVIEW_CONTEXT",
      title: "Kişisel sağlık değerlendirmesi gerekli",
      message:
        "Metabolik/endokrin durum, enerjiyi etkileyen ilaç, frailty/sarkopeni endişesi veya geçmiş yeme bozukluğu öyküsü varsa otomatik hedef yerine profesyonel değerlendirme gerekir.",
    },
  };

  for (const flag of input.safetyFlags) {
    const reason = safetyReasonMap[flag];
    if (reason && !blockingReasons.some((item) => item.code === reason.code)) {
      blockingReasons.push(reason);
    }
  }

  if (blockingReasons.length > 0) {
    return { status: "blocked", fatLossAllowed: false, reasons: blockingReasons };
  }

  if (limitingReasons.length > 0) {
    return { status: "limited", fatLossAllowed: false, reasons: limitingReasons };
  }

  return { status: "eligible", fatLossAllowed: true, reasons: [] };
}

export function evaluateEnergyLab(input: EnergyLabInput): EnergyLabEvaluation {
  const errors = validateEnergyLabInput(input);
  if (errors.length > 0) {
    return { status: "invalid", errors };
  }

  const bmi = calculateBmi(input.weightKg, input.heightCm);
  const scope = evaluateScope(input, bmi);

  if (scope.status === "blocked") {
    return { status: "blocked", bmi, scope };
  }

  const points = input.activityProfiles
    .map((profile) => {
      const rawKcal = calculateNasem2023AdultEer({
        sex: input.sex,
        age: input.age,
        heightCm: input.heightCm,
        weightKg: input.weightKg,
        activityProfile: profile,
      });

      return { profile, rawKcal, displayKcal: roundToNearest50(rawKcal) };
    })
    .sort((left, right) => left.rawKcal - right.rawKcal);

  const maintenance: MaintenanceEstimate = {
    kind: points.length === 1 ? "single" : "range",
    points,
    rawMin: points[0].rawKcal,
    rawMax: points[points.length - 1].rawKcal,
    displayMin: points[0].displayKcal,
    displayMax: points[points.length - 1].displayKcal,
  };

  return {
    status: "ready",
    bmi,
    mifflinRmr: calculateMifflinStJeorRmr({
      sex: input.sex,
      age: input.age,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
    }),
    scope,
    maintenance,
  };
}

export function getFatLossPolicy(
  bmi: number,
  performancePriority: boolean,
  fatLossAllowed = true,
): FatLossPolicy {
  if (!Number.isFinite(bmi) || bmi <= 0) {
    throw new RangeError("BMI geçerli ve pozitif bir sayı olmalıdır.");
  }

  if (!fatLossAllowed || bmi < 18.5) {
    return {
      defaultRate: null,
      deficitCapKcal: null,
      options: DEFICIT_RATES.map((rate) => ({
        rate,
        label: deficitRateLabel(rate),
        enabled: false,
        reason: "BMI 18,5 altındayken yağ kaybı hedefi sunulmaz.",
      })),
    };
  }

  const deficitCapKcal = performancePriority || bmi < 25 ? 500 : 750;

  return {
    defaultRate: bmi >= 25 ? 0.15 : 0.1,
    deficitCapKcal,
    options: DEFICIT_RATES.map((rate) => {
      const blockedByBmi = rate === 0.2 && bmi < 25;
      const blockedByPerformance = rate === 0.2 && performancePriority;
      const reason = blockedByPerformance
        ? "Direnç antrenmanı veya performans önceliğinde %20 seçeneği kapalıdır."
        : blockedByBmi
          ? "BMI 18,5–24,9 aralığında %20 seçeneği kapalıdır."
          : undefined;

      return {
        rate,
        label: deficitRateLabel(rate),
        enabled: !reason,
        reason,
      };
    }),
  };
}

export function calculateTargetScenario({
  evaluation,
  selection,
  performancePriority,
}: {
  evaluation: ReadyEnergyEvaluation;
  selection: GoalSelection;
  performancePriority: boolean;
}): TargetScenario {
  if (!isValidGoalSelection(selection)) {
    return {
      status: "unavailable",
      goal: readGoal(selection),
      reason: "INVALID_SELECTION",
      message: "Seçilen hedef senaryosu Energy Lab kuralları içinde kullanılamıyor.",
    };
  }

  if (selection.goal === "maintain") {
    return availableTarget(selection, evaluation.maintenance.points);
  }

  if (selection.goal === "gain") {
    const multiplier = selection.mode === "smallSurplus" ? 1.05 : 1;
    const points = evaluation.maintenance.points.map((point) => ({
      profile: point.profile,
      rawKcal: point.rawKcal * multiplier,
      displayKcal: roundToNearest50(point.rawKcal * multiplier),
    }));
    return availableTarget(selection, points);
  }

  const policy = getFatLossPolicy(
    evaluation.bmi,
    performancePriority,
    evaluation.scope.fatLossAllowed,
  );
  const option = policy.options.find((item) => item.rate === selection.rate);

  if (!evaluation.scope.fatLossAllowed) {
    return {
      status: "unavailable",
      goal: "lose",
      reason: "FAT_LOSS_NOT_AVAILABLE",
      message:
        evaluation.scope.reasons[0]?.message ??
        "Bu değerlendirmede yağ kaybı hedefi kullanılamıyor.",
    };
  }

  if (!option?.enabled || policy.deficitCapKcal === null) {
    return {
      status: "unavailable",
      goal: "lose",
      reason: "OPTION_NOT_AVAILABLE",
      message: option?.reason ?? "Bu yağ kaybı seçeneği mevcut profiliniz için kullanılamıyor.",
    };
  }

  const points: TargetPoint[] = evaluation.maintenance.points.map((point) => {
    const actualDeficitKcal = Math.min(
      point.rawKcal * selection.rate,
      policy.deficitCapKcal as number,
    );
    const rawKcal = point.rawKcal - actualDeficitKcal;
    return {
      profile: point.profile,
      rawKcal,
      displayKcal: roundToNearest50(rawKcal),
      actualDeficitKcal,
    };
  });

  if (points.some((point) => point.rawKcal < 1200)) {
    return {
      status: "unavailable",
      goal: "lose",
      reason: "TARGET_BELOW_1200",
      message:
        "Bu senaryoda hedef 1.200 kcal/gün altına düşüyor. Energy Lab sayısal hedef göstermiyor; kişisel değerlendirme için diyetisyen veya hekime başvurun. 1.200 kcal biyolojik minimum olarak sunulmaz.",
    };
  }

  return availableTarget(selection, points);
}

function isValidGoalSelection(value: GoalSelection): boolean {
  const candidate = value as unknown as Record<string, unknown>;
  if (candidate.goal === "maintain") return true;
  if (candidate.goal === "lose") return DEFICIT_RATES.includes(candidate.rate as DeficitRate);
  if (candidate.goal === "gain") {
    return candidate.mode === "maintenance" || candidate.mode === "smallSurplus";
  }
  return false;
}

function readGoal(value: GoalSelection): "maintain" | "lose" | "gain" {
  const goal = (value as unknown as Record<string, unknown>).goal;
  return goal === "lose" || goal === "gain" ? goal : "maintain";
}

function availableTarget(
  selection: GoalSelection,
  points: readonly TargetPoint[] | MaintenanceEstimate["points"],
): TargetScenario {
  const normalizedPoints = points
    .map((point) => ({ ...point }))
    .sort((left, right) => left.rawKcal - right.rawKcal);

  return {
    status: "available",
    goal: selection.goal,
    selection,
    points: normalizedPoints,
    rawMin: normalizedPoints[0].rawKcal,
    rawMax: normalizedPoints[normalizedPoints.length - 1].rawKcal,
    displayMin: normalizedPoints[0].displayKcal,
    displayMax: normalizedPoints[normalizedPoints.length - 1].displayKcal,
  };
}

function deficitRateLabel(rate: DeficitRate): string {
  if (rate === 0.1) return "Kontrollü başlangıç · %10";
  if (rate === 0.15) return "Standart başlangıç · %15";
  return "Daha hızlı başlangıç · %20";
}
