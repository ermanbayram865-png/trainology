import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateMacroDistribution,
  calculateProteinCalculationWeight,
  calculateProteinRequirement,
  calculateWaterRequirement,
  TOTAL_WATER_METADATA,
  type ProteinAgeGroup,
  type ProteinGoal,
  type ProteinInput,
  type ProteinTrainingProfile,
} from "../lib/calculators/index";

const baseProtein: ProteinInput = {
  ageGroup: "adult_18_64",
  heightCm: 175,
  weightKg: 80,
  goal: "maintenance",
  trainingProfile: "none",
  standardAdultScope: true,
};

test("18–64 egzersizsiz karar matrisi hedefe göre gerçek dalları uygular", () => {
  const maintain = calculateProteinRequirement(baseProtein);
  const loss = calculateProteinRequirement({ ...baseProtein, goal: "fat_loss" });
  const gain = calculateProteinRequirement({ ...baseProtein, goal: "muscle_gain" });

  assert.equal(maintain.type, "SINGLE_REFERENCE");
  assert.equal(loss.type, "SINGLE_REFERENCE");
  assert.equal(gain.type, "SINGLE_REFERENCE");
  if (maintain.type === "SINGLE_REFERENCE") {
    assert.equal(maintain.gPerKg, 0.83);
    assert.equal(maintain.dailyGrams, 80 * 0.83);
  }
  if (loss.type === "SINGLE_REFERENCE") assert.equal(loss.gPerKg, 1.2);
  if (gain.type === "SINGLE_REFERENCE") {
    assert.equal(gain.gPerKg, 0.83);
    assert.equal(gain.note, "no_hypertrophy_target");
  }
});

test("65+ egzersizsiz karar matrisi aralık ve yağ kaybı başlangıcını ayırır", () => {
  const input = { ...baseProtein, ageGroup: "adult_65_plus" as const };
  const maintain = calculateProteinRequirement(input);
  const loss = calculateProteinRequirement({ ...input, goal: "fat_loss" });
  const gain = calculateProteinRequirement({ ...input, goal: "muscle_gain" });

  for (const result of [maintain, gain]) {
    assert.equal(result.type, "PRACTICAL_RANGE");
    if (result.type === "PRACTICAL_RANGE") {
      assert.equal(result.lowGPerKg, 1);
      assert.equal(result.highGPerKg, 1.2);
    }
  }
  if (gain.type === "PRACTICAL_RANGE") assert.equal(gain.note, "no_hypertrophy_target");
  assert.equal(loss.type, "SINGLE_REFERENCE");
  if (loss.type === "SINGLE_REFERENCE") {
    assert.equal(loss.gPerKg, 1.2);
    assert.equal(loss.note, "older_adult_individualization");
  }
});

test("dayanıklılık ve karma profili tüm yaş ve hedeflerde yalnız 1,4–2,0 aralığı üretir", () => {
  for (const ageGroup of ["adult_18_64", "adult_65_plus"] as const) {
    for (const goal of ["maintenance", "fat_loss", "muscle_gain"] as const) {
      const result = calculateProteinRequirement({
        ...baseProtein,
        ageGroup,
        goal,
        trainingProfile: "endurance_mixed",
      });
      assert.equal(result.type, "PRACTICAL_RANGE");
      if (result.type === "PRACTICAL_RANGE") {
        assert.equal(result.lowGPerKg, 1.4);
        assert.equal(result.highGPerKg, 2);
        if (goal === "fat_loss") assert.equal(result.note, "fat_loss_context");
        if (goal === "muscle_gain") assert.equal(result.note, "no_hypertrophy_target");
      }
    }
  }
});

test("direnç antrenmanı tüm yaşlarda 1,6 başlangıç ve hedefe uygun aralık üretir", () => {
  for (const ageGroup of ["adult_18_64", "adult_65_plus"] as const) {
    for (const goal of ["maintenance", "fat_loss", "muscle_gain"] as const) {
      const result = calculateProteinRequirement({
        ...baseProtein,
        ageGroup,
        goal,
        trainingProfile: "resistance",
      });
      assert.equal(result.type, "ANCHOR_AND_RANGE");
      if (result.type === "ANCHOR_AND_RANGE") {
        assert.equal(result.anchorGPerKg, 1.6);
        assert.equal(result.lowGPerKg, goal === "fat_loss" ? 1.6 : 1.4);
        assert.equal(result.highGPerKg, 2);
      }
    }
  }
});

test("BMI 30 referans ağırlığı Protein ve Makro Planlayıcıda aynı helper üzerinden uygulanır", () => {
  const weight = calculateProteinCalculationWeight(100, 180);
  assert.equal(weight.bmi, 100 / 1.8 ** 2);
  assert.equal(weight.calculationWeightKg, 30 * 1.8 ** 2);
  assert.equal(weight.usesReferenceWeight, true);

  const protein = calculateProteinRequirement({
    ...baseProtein,
    heightCm: 180,
    weightKg: 100,
    trainingProfile: "resistance",
  });
  const macro = calculateMacroDistribution({
    calories: 2400,
    height: 180,
    weight: 100,
    goal: "maintain",
    resistanceTraining: "yes",
    scope: "standardAdult",
  });

  assert.equal(protein.type === "ANCHOR_AND_RANGE" && protein.calculationWeightKg, weight.calculationWeightKg);
  assert.equal(macro.status === "ok" && macro.distribution.proteinCalculationWeight, weight.calculationWeightKg);
});

test("BMI 30 altı gerçek ağırlığı ve ham hesap hassasiyetini korur", () => {
  const result = calculateProteinRequirement({ ...baseProtein, weightKg: 72.3, heightCm: 180 });
  assert.equal(result.type, "SINGLE_REFERENCE");
  if (result.type === "SINGLE_REFERENCE") {
    assert.equal(result.calculationWeightKg, 72.3);
    assert.equal(result.dailyGrams, 72.3 * 0.83);
    assert.equal(result.usesReferenceWeight, false);
  }
});

test("protein safety kapsamı sayısal sonucu fail-closed durdurur", () => {
  assert.deepEqual(
    calculateProteinRequirement({ ...baseProtein, standardAdultScope: false }),
    { type: "NO_NUMERIC_RESULT", reason: "outside_standard_scope" },
  );
});

test("protein motoru geçersiz sayıları ve tanınmayan enumları reddeder", () => {
  const invalidInputs: ProteinInput[] = [
    { ...baseProtein, ageGroup: "minor" as ProteinAgeGroup },
    { ...baseProtein, heightCm: Number.NaN },
    { ...baseProtein, weightKg: 0 },
    { ...baseProtein, goal: "bulk" as ProteinGoal },
    { ...baseProtein, trainingProfile: "unknown" as ProteinTrainingProfile },
    { ...baseProtein, standardAdultScope: "yes" as never },
  ];
  for (const input of invalidInputs) {
    assert.equal(calculateProteinRequirement(input).type, "VALIDATION_ERROR");
  }
});

test("kadın ve erkek su referansları tek canonical litre değerinden mL üretir", () => {
  const common = { adultConfirmed: true, standardAdultScope: true };
  const female = calculateWaterRequirement({
    ...common,
    efsaAdultReferenceCategory: "adult_female_reference",
  });
  const male = calculateWaterRequirement({
    ...common,
    efsaAdultReferenceCategory: "adult_male_reference",
  });

  assert.equal(female.type, "TOTAL_WATER_REFERENCE");
  assert.equal(male.type, "TOTAL_WATER_REFERENCE");
  if (female.type === "TOTAL_WATER_REFERENCE") {
    assert.equal(female.litersPerDay, 2);
    assert.equal(female.millilitersPerDay, female.litersPerDay * 1000);
  }
  if (male.type === "TOTAL_WATER_REFERENCE") {
    assert.equal(male.litersPerDay, 2.5);
    assert.equal(male.millilitersPerDay, male.litersPerDay * 1000);
  }
});

test("su motoru 18+ ve standart kapsam onayı yoksa sayısal sonuç üretmez", () => {
  const input = {
    adultConfirmed: true,
    standardAdultScope: true,
    efsaAdultReferenceCategory: "adult_female_reference" as const,
  };
  assert.deepEqual(calculateWaterRequirement({ ...input, adultConfirmed: false }), {
    type: "NO_NUMERIC_RESULT",
    reason: "under_18",
  });
  assert.deepEqual(calculateWaterRequirement({ ...input, standardAdultScope: false }), {
    type: "NO_NUMERIC_RESULT",
    reason: "outside_standard_scope",
  });
});

test("su motoru eksik boolean ve tanınmayan kategoriyi reddeder", () => {
  assert.equal(
    calculateWaterRequirement({
      adultConfirmed: "yes" as never,
      standardAdultScope: true,
      efsaAdultReferenceCategory: "adult_female_reference",
    }).type,
    "VALIDATION_ERROR",
  );
  assert.equal(
    calculateWaterRequirement({
      adultConfirmed: true,
      standardAdultScope: true,
      efsaAdultReferenceCategory: "unknown" as never,
    }).type,
    "VALIDATION_ERROR",
  );
});

test("su motoruna kapsam dışı kişiselleştirme alanları eklemek sonucu değiştirmez", () => {
  const result = calculateWaterRequirement({
    adultConfirmed: true,
    standardAdultScope: true,
    efsaAdultReferenceCategory: "adult_male_reference",
    weightKg: 200,
    activity: "high",
    creatine: true,
    temperature: 40,
  } as never);
  assert.equal(result.type, "TOTAL_WATER_REFERENCE");
  if (result.type === "TOTAL_WATER_REFERENCE") assert.equal(result.litersPerDay, 2.5);
});

test("toplam su metadata yiyecek, içme suyu ve diğer içecekleri kapsar", () => {
  assert.deepEqual(TOTAL_WATER_METADATA, {
    construct: "total_water_intake",
    includesFoodWater: true,
    includesDrinkingWater: true,
    includesOtherBeverages: true,
    personalExactRequirement: false,
  });
});
