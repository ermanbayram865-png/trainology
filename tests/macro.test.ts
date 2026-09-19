import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  calculateMacroDistribution,
  type MacroInput,
} from "../lib/calculators/index";

const baseInput: MacroInput = {
  calories: 2_400,
  weight: 75,
  height: 175,
  goal: "maintain",
  resistanceTraining: "yes",
  scope: "standardAdult",
};

function getDistribution(overrides: Partial<MacroInput> = {}) {
  const evaluation = calculateMacroDistribution({ ...baseInput, ...overrides });
  assert.equal(evaluation.status, "ok");
  if (evaluation.status !== "ok") throw new Error("Sayısal dağılım bekleniyordu.");
  return evaluation.distribution;
}

test("direnç antrenmanında tüm hedefler 1,6 g/kg başlangıç değerini kullanır", () => {
  for (const goal of ["maintain", "gain", "lose"] as const) {
    const distribution = getDistribution({ goal, resistanceTraining: "yes" });
    assert.equal(distribution.proteinPerKg, 1.6);
    assert.equal(distribution.proteinGramsRaw, 120);
  }
});

test("direnç antrenmanı yokken yalnız desteklenen hedef katsayıları uygulanır", () => {
  assert.equal(
    getDistribution({ goal: "maintain", resistanceTraining: "no" }).proteinPerKg,
    0.83,
  );
  assert.equal(
    getDistribution({ goal: "lose", resistanceTraining: "no" }).proteinPerKg,
    1.2,
  );

  const gain = calculateMacroDistribution({
    ...baseInput,
    goal: "gain",
    resistanceTraining: "no",
  });
  assert.deepEqual(gain.status === "blocked" && gain.reason, "gainWithoutResistanceTraining");
});

test("BMI 30 altında gerçek ağırlık, BMI 30 ve üzerinde referans ağırlık kullanılır", () => {
  const below = getDistribution({ weight: 80, height: 180 });
  assert.equal(below.proteinCalculationWeight, 80);
  assert.equal(below.usesReferenceWeight, false);

  const above = getDistribution({ weight: 120, height: 180 });
  assert.equal(above.proteinCalculationWeight, 30 * 1.8 ** 2);
  assert.equal(above.usesReferenceWeight, true);
  assert.ok(above.warnings.includes("referenceWeightUsed"));
});

test("yağ enerjinin sabit yüzde 30'udur ve karbonhidrat ham kalan enerjiden gelir", () => {
  const distribution = getDistribution();
  assert.equal(distribution.fatPercentage, 30);
  assert.equal(distribution.fatGramsRaw, (2_400 * 0.3) / 9);
  assert.equal(
    distribution.carbohydrateGramsRaw,
    (2_400 - distribution.proteinGramsRaw * 4 - 2_400 * 0.3) / 4,
  );
  assert.equal(
    distribution.proteinPercentage +
      distribution.carbohydratePercentage +
      distribution.fatPercentage,
    100,
  );
});

test("ara hesaplamalar yuvarlanmaz; yalnız görünür gramlar tam sayıya yuvarlanır", () => {
  const distribution = getDistribution({ calories: 2_301, weight: 72.3 });
  assert.equal(distribution.proteinGramsRaw, 72.3 * 1.6);
  assert.equal(distribution.protein, Math.round(distribution.proteinGramsRaw));
  assert.equal(distribution.fat, Math.round(distribution.fatGramsRaw));
  assert.equal(
    distribution.carbohydrates,
    Math.round(distribution.carbohydrateGramsRaw),
  );

  const displayedEnergy =
    distribution.protein * 4 +
    distribution.carbohydrates * 4 +
    distribution.fat * 9;
  assert.notEqual(displayedEnergy, 2_301);
});

test("uyumsuz enerji bütçesinde katsayıları değiştirmeden sayısal sonucu durdurur", () => {
  const evaluation = calculateMacroDistribution({
    ...baseInput,
    calories: 1_000,
    weight: 400,
    height: 250,
  });
  assert.deepEqual(
    evaluation.status === "blocked" && evaluation.reason,
    "incompatibleEnergyBudget",
  );
});

test("standart kapsam dışındaki tüm belirtilen durumlar aynı kompakt gate ile durdurulur", () => {
  const representedConditions = [
    "under18",
    "pregnancyOrBreastfeeding",
    "activeEatingDisorderOrHighRisk",
    "redsOrLowEnergyAvailabilityRisk",
    "clinicalDiseaseOrSpecialDiet",
    "physiqueCompetitionPreparation",
  ];

  for (const condition of representedConditions) {
    const evaluation = calculateMacroDistribution({
      ...baseInput,
      scope: "outsideStandardScope",
    });
    assert.deepEqual(
      evaluation.status === "blocked" && evaluation.reason,
      "outsideStandardScope",
      condition,
    );
  }
});

test("BMI 18,5 altında yağ kaybı durur; koruma ve kazanım uyarıyla devam eder", () => {
  const fatLoss = calculateMacroDistribution({
    ...baseInput,
    weight: 50,
    height: 175,
    goal: "lose",
  });
  assert.deepEqual(fatLoss.status === "blocked" && fatLoss.reason, "underweightFatLoss");

  for (const goal of ["maintain", "gain"] as const) {
    const distribution = getDistribution({ weight: 50, height: 175, goal });
    assert.ok(distribution.warnings.includes("lowBmi"));
  }
});

test("lif referansı makro enerjisine eklenmeden 25 g/gün olarak taşınır", () => {
  assert.equal(getDistribution().fiberReferenceGrams, 25);
});

test("geçersiz sayılar ve tanınmayan enum değerleri fail-closed davranır", () => {
  for (const input of [
    { ...baseInput, calories: Number.NaN },
    { ...baseInput, weight: 0 },
    { ...baseInput, height: Number.POSITIVE_INFINITY },
    { ...baseInput, goal: "bulk" as never },
    { ...baseInput, resistanceTraining: "sometimes" as never },
    { ...baseInput, scope: "unknown" as never },
  ]) {
    assert.throws(() => calculateMacroDistribution(input), RangeError);
  }
});

test("motor UI ile aynı ağırlık, boy ve kalori sınırlarında fail-closed davranır", () => {
  for (const [field, value] of [
    ["weight", 24.9],
    ["weight", 400.1],
    ["height", 99.9],
    ["height", 250.1],
    ["calories", 999.9],
    ["calories", 8000.1],
  ] as const) {
    assert.throws(() => getDistribution({ [field]: value }), RangeError);
  }

  assert.doesNotThrow(() => getDistribution({ weight: 25, height: 100, calories: 1000 }));
  assert.doesNotThrow(() => getDistribution({ weight: 400, height: 250, calories: 8000 }));
});

test("kalori hedefi yalnız 1000–8000 aralığındaki tam sayıları kabul eder", () => {
  for (const calories of [999, 3150.5, 8001, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => calculateMacroDistribution({ ...baseInput, calories }), RangeError);
  }

  for (const calories of [1000, 3150, 8000]) {
    assert.doesNotThrow(() => calculateMacroDistribution({ ...baseInput, calories }));
  }
});

test("legacy aktivite protein ve yağ tabloları motordan kaldırılmıştır", () => {
  const source = readFileSync(
    new URL("../lib/calculators/macro.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /activityLevel|MACRO_PROTEIN_PER_KG|fatPercentages/);
  assert.doesNotMatch(source, /\b(?:1\.4|1\.5|1\.9|2\.1|2\.2|0\.25|0\.2)\b/);
});
