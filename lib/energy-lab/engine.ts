import type {
  ActivityProfile,
  BiologicalSex,
  EnergyInputError,
  EnergyLabEvaluation,
  EnergyLabInput,
  GoalSelection,
  MaintenanceEstimate,
  ReadyEnergyEvaluation,
  ScopeDecision,
  ScopeReason,
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

export const FAT_LOSS_STARTING_RATE = 0.1;
export const FAT_LOSS_DEFICIT_CAP_KCAL = 500;
export const FAT_LOSS_OUTPUT_BOUNDARY_KCAL = 1200;

export function roundToNearest50(value: number): number {
  if (!Number.isFinite(value)) {
    throw new RangeError("Enerji değeri sonlu bir sayı olmalıdır.");
  }

  return Math.round(value / 50) * 50;
}

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError("Kilo geçerli ve pozitif bir sayı olmalıdır.");
  }
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new RangeError("Boy geçerli ve pozitif bir sayı olmalıdır.");
  }

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
  if (sex !== "female" && sex !== "male") {
    throw new RangeError("Geçerli biyolojik cinsiyet katsayısı seçilmelidir.");
  }
  if (!Number.isFinite(age) || age < 19) {
    throw new RangeError("Mifflin–St Jeor yetişkin tahmini yalnız 19 yaş ve üzeri için kullanılır.");
  }
  if (!Number.isFinite(heightCm) || heightCm <= 0 || !Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError("Boy ve kilo geçerli pozitif sayılar olmalıdır.");
  }

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
  if (!Number.isFinite(age) || age < 19) {
    throw new RangeError("NASEM 2023 yetişkin EER denklemi yalnız 19 yaş ve üzeri için kullanılır.");
  }

  if (!Number.isFinite(heightCm) || heightCm <= 0 || !Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError("Boy ve kilo geçerli pozitif sayılar olmalıdır.");
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
  const candidate =
    input && typeof input === "object"
      ? (input as Partial<EnergyLabInput>)
      : ({} as Partial<EnergyLabInput>);

  if (!Number.isInteger(candidate.age) || (candidate.age as number) < 19 || (candidate.age as number) > 120) {
    errors.push({
      code: "INVALID_AGE",
      field: "age",
      message: "Yaş 19 ile 120 arasında tam sayı olmalıdır.",
    });
  }

  if (candidate.sex !== "female" && candidate.sex !== "male") {
    errors.push({
      code: "INVALID_SEX",
      field: "sex",
      message: "Cinsiyet seçilmelidir.",
    });
  }

  if (!Number.isFinite(candidate.heightCm) || (candidate.heightCm as number) < 100 || (candidate.heightCm as number) > 250) {
    errors.push({
      code: "INVALID_HEIGHT",
      field: "heightCm",
      message: "Boy 100 ile 250 cm arasında olmalıdır.",
    });
  }

  if (!Number.isFinite(candidate.weightKg) || (candidate.weightKg as number) < 25 || (candidate.weightKg as number) > 400) {
    errors.push({
      code: "INVALID_WEIGHT",
      field: "weightKg",
      message: "Kilo 25 ile 400 kg arasında olmalıdır.",
    });
  }

  if (!isValidActivitySelection(candidate.activityProfiles)) {
    errors.push({
      code: "INVALID_ACTIVITY_SELECTION",
      field: "activityProfiles",
      message: "Bir hareket düzeyi veya yan yana olan iki hareket düzeyi seçilmelidir.",
    });
  }

  if (candidate.generalScope !== "standardAdult" && candidate.generalScope !== "mayBeOutsideScope") {
    errors.push({
      code: "INVALID_GENERAL_SCOPE",
      field: "generalScope",
      message: "Bu hesaplamanın sana uygun olup olmadığını seç.",
    });
  }

  return errors;
}

export function isValidActivitySelection(
  activityProfiles: unknown,
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
      title: "Bu hesaplama yaş grubun için uygun değil",
      message:
        "Energy Lab yetişkin denklemleri 19 yaş ve üzeri için tasarlanmıştır. Bu yaş grubunda kişiye uygun değerlendirme için sağlık profesyoneline başvurun.",
    });
  }

  if (bmi < 16) {
    blockingReasons.push({
      code: "BMI_UNDER_16",
      title: "Otomatik hedef için uygun değil",
      message:
        "Bu genel araç bu aralıkta sayısal hedef göstermez. Kişisel durumunuzu değerlendirebilecek bir hekim veya diyetisyenle görüşün.",
    });
  } else if (bmi < 18.5) {
    limitingReasons.push({
      code: "BMI_UNDER_18_5",
      title: "Yağ kaybı seçeneği kullanılamıyor",
      message:
        "Genel BMI referansında 18,5 altındaki değerlerde Energy Lab kilo kaybı hedefi üretmez. Bu, yargı veya tanı değil; genel kullanım için koruyucu bir sınırdır.",
    });
  }

  if (bmi >= 50) {
    blockingReasons.push({
      code: "BMI_50_OR_ABOVE",
      title: "Bireysel değerlendirme gerekli",
      message:
        "Bu genel başlangıç hesaplayıcısı bu aralıkta sonuç göstermez. Güvenli ve kişiye uygun planlama için hekim veya diyetisyen değerlendirmesi önerilir.",
    });
  }

  if (input.generalScope === "mayBeOutsideScope") {
    blockingReasons.push({
      code: "MAY_BE_OUTSIDE_GENERAL_SCOPE",
      title: "Bu araç durumun için uygun olmayabilir",
      message:
        "Energy Lab bu durumda sayısal hedef göstermez. Kişisel durumunu değerlendirebilecek uygun bir sağlık profesyoneliyle görüşebilirsin.",
    });
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

export function calculateTargetScenario({
  evaluation,
  selection,
}: {
  evaluation: ReadyEnergyEvaluation;
  selection: GoalSelection;
}): TargetScenario {
  if (!isValidGoalSelection(selection)) {
    return {
      status: "unavailable",
      goal: readGoal(selection),
      reason: "INVALID_SELECTION",
      message: "Hedef seçimi bu bilgilerle kullanılamıyor. Seçimini kontrol et.",
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

  const points: TargetPoint[] = evaluation.maintenance.points.map((point) => {
    const requestedDeficitRaw = point.rawKcal * FAT_LOSS_STARTING_RATE;
    const actualDeficitKcal = Math.min(requestedDeficitRaw, FAT_LOSS_DEFICIT_CAP_KCAL);
    const rawKcal = point.rawKcal - actualDeficitKcal;
    return {
      profile: point.profile,
      rawKcal,
      displayKcal: roundToNearest50(rawKcal),
      actualDeficitKcal,
    };
  });

  if (points.some((point) => point.rawKcal <= FAT_LOSS_OUTPUT_BOUNDARY_KCAL)) {
    return {
      status: "unavailable",
      goal: "lose",
      reason: "TARGET_AT_OR_BELOW_1200",
      message:
        "Yuvarlama öncesindeki hedef, Energy Lab’ın genel kullanım için belirlediği sınırda veya altında kalıyor. Kişisel değerlendirme için diyetisyen veya hekime başvurun. 1.200 kcal biyolojik minimum değildir.",
    };
  }

  return availableTarget(selection, points);
}

function isValidGoalSelection(value: GoalSelection): boolean {
  if (!value || typeof value !== "object") return false;
  const candidate = value as unknown as Record<string, unknown>;
  if (candidate.goal === "maintain") return true;
  if (candidate.goal === "lose") return Object.keys(candidate).length === 1;
  if (candidate.goal === "gain") {
    return candidate.mode === "maintenance" || candidate.mode === "smallSurplus";
  }
  return false;
}

function readGoal(value: GoalSelection): "maintain" | "lose" | "gain" {
  if (!value || typeof value !== "object") return "maintain";
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
