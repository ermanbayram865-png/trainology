import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateProteinRequirement,
  calculateWaterRequirement,
  TOTAL_WATER_METADATA,
} from "../lib/calculators/index";

test("30 yaş, 70 kg ve egzersiz yokken PRI yaklaşık 58 g/gün verir", () => {
  const result = calculateProteinRequirement({
    ageYears: 30,
    weightKg: 70,
    trainingProfile: "none",
    scopeRisk: false,
  });

  assert.equal(result.type, "PRI_REFERENCE");
  if (result.type === "PRI_REFERENCE") {
    assert.equal(result.gPerKg, 0.83);
    assert.equal(Math.round(result.dailyGrams), 58);
  }
});

test("düzenli egzersiz 80 kg için 112–160 g/gün verir", () => {
  const result = calculateProteinRequirement({
    ageYears: 30,
    weightKg: 80,
    trainingProfile: "regular_exercise",
    scopeRisk: false,
  });

  assert.equal(result.type, "PRACTICAL_RANGE");
  if (result.type === "PRACTICAL_RANGE") {
    assert.equal(Math.round(result.lowDailyGrams), 112);
    assert.equal(Math.round(result.highDailyGrams), 160);
  }
});

test("direnç antrenmanı 80 kg için 112–160 g ve yaklaşık 128 g anchor verir", () => {
  const result = calculateProteinRequirement({
    ageYears: 30,
    weightKg: 80,
    trainingProfile: "resistance_hypertrophy",
    scopeRisk: false,
  });

  assert.equal(result.type, "RESISTANCE_RANGE");
  if (result.type === "RESISTANCE_RANGE") {
    assert.equal(Math.round(result.lowDailyGrams), 112);
    assert.equal(Math.round(result.highDailyGrams), 160);
    assert.equal(Math.round(result.anchorDailyGrams), 128);
  }
});

test("yağ kaybı hedefi egzersiz yokken PRI katsayısını değiştirmez", () => {
  const baseInput = {
    ageYears: 30,
    weightKg: 80,
    trainingProfile: "none" as const,
    scopeRisk: false,
  };
  const withoutGoal = calculateProteinRequirement(baseInput);
  const withFatLoss = calculateProteinRequirement({
    ...baseInput,
    goal: "fat_loss",
  });

  assert.deepEqual(withFatLoss, withoutGoal);
  assert.equal(withFatLoss.type, "PRI_REFERENCE");
  if (withFatLoss.type === "PRI_REFERENCE") {
    assert.equal(Math.round(withFatLoss.dailyGrams), 66);
  }
});

test("70 yaş ve egzersiz yokken 70–84 g/gün ileri yaş aralığı verir", () => {
  const result = calculateProteinRequirement({
    ageYears: 70,
    weightKg: 70,
    trainingProfile: "none",
    scopeRisk: false,
  });

  assert.equal(result.type, "PRACTICAL_RANGE");
  if (result.type === "PRACTICAL_RANGE") {
    assert.equal(Math.round(result.lowDailyGrams), 70);
    assert.equal(Math.round(result.highDailyGrams), 84);
    assert.equal(result.certainty, "conditional");
  }
});

test("70 yaş ve düzenli egzersizde 112–160 g/gün koşullu aralık verir", () => {
  const result = calculateProteinRequirement({
    ageYears: 70,
    weightKg: 80,
    trainingProfile: "regular_exercise",
    scopeRisk: false,
  });

  assert.equal(result.type, "PRACTICAL_RANGE");
  if (result.type === "PRACTICAL_RANGE") {
    assert.equal(Math.round(result.lowDailyGrams), 112);
    assert.equal(Math.round(result.highDailyGrams), 160);
    assert.equal(result.certainty, "conditional");
  }
});

test("protein motoru 18 yaş altı ve kapsam riski için sayısal sonuç üretmez", () => {
  assert.deepEqual(
    calculateProteinRequirement({
      ageYears: 17,
      weightKg: 70,
      trainingProfile: "none",
      scopeRisk: false,
    }),
    { type: "NO_NUMERIC_RESULT", reason: "under_18" },
  );
  assert.deepEqual(
    calculateProteinRequirement({
      ageYears: 30,
      weightKg: 70,
      trainingProfile: "none",
      scopeRisk: true,
    }),
    { type: "NO_NUMERIC_RESULT", reason: "scope_risk" },
  );
});

test("obezite tanısı scopeRisk üzerinden sayısal protein sonucunu durdurur", () => {
  const obesityDiagnosisMeansScopeRisk = true;
  const result = calculateProteinRequirement({
    ageYears: 30,
    weightKg: 100,
    trainingProfile: "none",
    scopeRisk: obesityDiagnosisMeansScopeRisk,
  });

  assert.equal(result.type, "NO_NUMERIC_RESULT");
});

test("legacy ve tanınmayan training enum değerleri validation error üretir", () => {
  for (const trainingProfile of ["low", "moderate", "active", "veryActive", "unknown"]) {
    const result = calculateProteinRequirement({
      ageYears: 30,
      weightKg: 70,
      trainingProfile: trainingProfile as never,
      scopeRisk: false,
    });
    assert.equal(result.type, "VALIDATION_ERROR");
  }
});

test("protein motorunun hiçbir katsayı yolunda 2,2 veya 2,4 bulunmaz", () => {
  const coefficients = new Set<number>();
  for (const ageYears of [30, 70]) {
    for (const trainingProfile of [
      "none",
      "regular_exercise",
      "resistance_hypertrophy",
    ] as const) {
      const result = calculateProteinRequirement({
        ageYears,
        weightKg: 80,
        trainingProfile,
        scopeRisk: false,
      });
      if (result.type === "PRI_REFERENCE") coefficients.add(result.gPerKg);
      if (result.type === "PRACTICAL_RANGE" || result.type === "RESISTANCE_RANGE") {
        coefficients.add(result.lowGPerKg);
        coefficients.add(result.highGPerKg);
      }
      if (result.type === "RESISTANCE_RANGE") coefficients.add(result.optionalAnchorGPerKg);
    }
  }

  assert.equal(coefficients.has(2.2), false);
  assert.equal(coefficients.has(2.4), false);
});

test("EFSA yetişkin kategorileri 2,0 ve 2,5 L toplam su AI verir", () => {
  const female = calculateWaterRequirement({
    ageYears: 30,
    efsaAdultReferenceCategory: "adult_female_reference",
    scopeRisk: false,
  });
  const male = calculateWaterRequirement({
    ageYears: 30,
    efsaAdultReferenceCategory: "adult_male_reference",
    scopeRisk: false,
  });

  assert.equal(female.type, "TOTAL_WATER_AI");
  assert.equal(male.type, "TOTAL_WATER_AI");
  if (female.type === "TOTAL_WATER_AI") assert.equal(female.litersPerDay, 2);
  if (male.type === "TOTAL_WATER_AI") assert.equal(male.litersPerDay, 2.5);
});

test("70 yaşta EFSA yetişkin referansları değişmez", () => {
  const female = calculateWaterRequirement({
    ageYears: 70,
    efsaAdultReferenceCategory: "adult_female_reference",
    scopeRisk: false,
  });
  const male = calculateWaterRequirement({
    ageYears: 70,
    efsaAdultReferenceCategory: "adult_male_reference",
    scopeRisk: false,
  });

  assert.equal(female.type === "TOTAL_WATER_AI" && female.litersPerDay, 2);
  assert.equal(male.type === "TOTAL_WATER_AI" && male.litersPerDay, 2.5);
});

test("su motoru 18 yaş altı ve kapsam riski için sayısal sonuç üretmez", () => {
  const input = {
    efsaAdultReferenceCategory: "adult_female_reference" as const,
    scopeRisk: false,
  };
  assert.equal(calculateWaterRequirement({ ...input, ageYears: 17 }).type, "NO_NUMERIC_RESULT");
  assert.equal(calculateWaterRequirement({ ...input, ageYears: 30, scopeRisk: true }).type, "NO_NUMERIC_RESULT");
});

test("seçilmemiş veya tanınmayan su referans kategorisi validation error üretir", () => {
  for (const efsaAdultReferenceCategory of ["", "high", "unknown"]) {
    const result = calculateWaterRequirement({
      ageYears: 30,
      efsaAdultReferenceCategory: efsaAdultReferenceCategory as never,
      scopeRisk: false,
    });
    assert.equal(result.type, "VALIDATION_ERROR");
  }
});

test("legacy kilo ve aktivite alanları EFSA su referansını değiştirmez", () => {
  const result = calculateWaterRequirement({
    ageYears: 30,
    efsaAdultReferenceCategory: "adult_male_reference",
    scopeRisk: false,
    weightKg: 200,
    activityLevel: "high",
  } as never);

  assert.equal(result.type, "TOTAL_WATER_AI");
  if (result.type === "TOTAL_WATER_AI") assert.equal(result.litersPerDay, 2.5);
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
