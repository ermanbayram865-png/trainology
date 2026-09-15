import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateBmi,
  calculateMifflinStJeorRmr,
  calculateNasem2023AdultEer,
  calculateTargetScenario,
  ENERGY_LAB_SOURCES,
  ENERGY_SCIENTIFIC_DECISIONS,
  evaluateEnergyLab,
  isValidActivitySelection,
  roundToNearest50,
  type EnergyLabInput,
} from "../lib/energy-lab/index";

const BASE_INPUT: EnergyLabInput = {
  age: 30,
  sex: "female",
  heightCm: 165,
  weightKg: 60,
  activityProfiles: ["inactive"],
  generalScope: "standardAdult",
};

test("scientific source metadata separates evidence from the conservative product rules", () => {
  for (const source of ENERGY_LAB_SOURCES) {
    assert.ok(source.id.length > 0);
    assert.ok(source.title.length > 0);
    assert.ok(source.authors.length > 0);
    assert.ok(source.year >= 1990);
    assert.match(source.url, /^https:\/\//);
    assert.ok(source.supports.length > 0);
    assert.ok(source.limits.length > 0);
  }

  const startingRule = ENERGY_SCIENTIFIC_DECISIONS.find(
    (item) => item.id === "fat-loss-starting-rule",
  );
  const ceiling = ENERGY_SCIENTIFIC_DECISIONS.find((item) => item.id === "deficit-cap");
  const outputGate = ENERGY_SCIENTIFIC_DECISIONS.find((item) => item.id === "low-calorie-gate");
  assert.equal(startingRule?.decision, "acceptable-safety-rule");
  assert.equal(ceiling?.decision, "acceptable-safety-rule");
  assert.equal(outputGate?.decision, "acceptable-safety-rule");
  assert.ok(ENERGY_LAB_SOURCES.some((source) => source.id === "das-2009-energy-restriction"));
  assert.ok(ENERGY_LAB_SOURCES.some((source) => source.id === "nice-2025-overweight-obesity"));
});

function readyEvaluation(overrides: Partial<EnergyLabInput> = {}) {
  const result = evaluateEnergyLab({ ...BASE_INPUT, ...overrides });
  assert.equal(result.status, "ready");
  if (result.status !== "ready") throw new Error("Expected a ready Energy Lab result.");
  return result;
}

function evaluationWithMaintenance(rawKcal: number, bmi = 24.9) {
  const evaluation = readyEvaluation();
  return {
    ...evaluation,
    bmi,
    maintenance: {
      kind: "single" as const,
      points: [{ profile: "inactive" as const, rawKcal, displayKcal: roundToNearest50(rawKcal) }],
      rawMin: rawKcal,
      rawMax: rawKcal,
      displayMin: roundToNearest50(rawKcal),
      displayMax: roundToNearest50(rawKcal),
    },
  };
}

test("NASEM 2023 adult female equations match the published Table 5-16 coefficients", () => {
  const expected = {
    inactive: 2021,
    lowActive: 2182.87,
    active: 2319.45,
    veryActive: 2551.68,
  } as const;

  for (const [activityProfile, expectedKcal] of Object.entries(expected)) {
    const result = calculateNasem2023AdultEer({
      sex: "female",
      age: 30,
      heightCm: 165,
      weightKg: 60,
      activityProfile: activityProfile as keyof typeof expected,
    });
    assert.ok(Math.abs(result - expectedKcal) < 1e-8);
  }
});

test("NASEM 2023 adult male equations match the published Table 5-16 coefficients", () => {
  const expected = {
    inactive: 2726.17,
    lowActive: 2945.77,
    active: 3126.32,
    veryActive: 3495.82,
  } as const;

  for (const [activityProfile, expectedKcal] of Object.entries(expected)) {
    const result = calculateNasem2023AdultEer({
      sex: "male",
      age: 30,
      heightCm: 180,
      weightKg: 80,
      activityProfile: activityProfile as keyof typeof expected,
    });
    assert.ok(Math.abs(result - expectedKcal) < 1e-8);
  }
});

test("Mifflin–St Jeor is available only as a separate resting-energy result", () => {
  assert.equal(
    calculateMifflinStJeorRmr({
      sex: "female",
      age: 30,
      heightCm: 165,
      weightKg: 60,
    }),
    1320.25,
  );
  const result = readyEvaluation();
  assert.equal(result.mifflinRmr, 1320.25);
  assert.notEqual(result.maintenance.rawMin, result.mifflinRmr);
});

test("NASEM official adult examples preserve their published raw results", () => {
  const fixtures = [
    { sex: "female", age: 22, heightCm: 165, weightKg: 63, activityProfile: "lowActive", expected: 2275.37 },
    { sex: "female", age: 70, heightCm: 157, weightKg: 70, activityProfile: "inactive", expected: 1811.94 },
    { sex: "male", age: 45, heightCm: 175, weightKg: 100, activityProfile: "lowActive", expected: 3040.62 },
  ] as const;

  for (const fixture of fixtures) {
    const result = calculateNasem2023AdultEer(fixture);
    assert.ok(Math.abs(result - fixture.expected) < 1e-8);
  }
});

test("visible energy values round to the nearest 50 while raw precision remains intact", () => {
  assert.equal(roundToNearest50(2473), 2450);
  assert.equal(roundToNearest50(2475), 2500);
  const result = readyEvaluation();
  assert.equal(result.maintenance.rawMin, 2021);
  assert.equal(result.maintenance.displayMin, 2000);
});

test("only one profile or two adjacent profiles are valid", () => {
  assert.equal(isValidActivitySelection(["inactive"]), true);
  assert.equal(isValidActivitySelection(["inactive", "lowActive"]), true);
  assert.equal(isValidActivitySelection(["inactive", "active"]), false);
  assert.equal(isValidActivitySelection(["active", "active"]), false);
});

test("two adjacent activity profiles produce a correctly ordered scenario range", () => {
  const result = readyEvaluation({ activityProfiles: ["lowActive", "inactive"] });
  assert.equal(result.maintenance.kind, "range");
  assert.deepEqual(
    result.maintenance.points.map((point) => point.profile),
    ["inactive", "lowActive"],
  );
  assert.ok(result.maintenance.rawMin < result.maintenance.rawMax);
});

test("fat loss uses exactly 10% below the cap and exactly 500 kcal at and above it", () => {
  for (const [maintenance, expectedDeficit, expectedTarget] of [
    [3000, 300, 2700],
    [5000, 500, 4500],
    [6000, 500, 5500],
  ] as const) {
    const scenario = calculateTargetScenario({
      evaluation: evaluationWithMaintenance(maintenance),
      selection: { goal: "lose" },
    });
    assert.equal(scenario.status, "available");
    if (scenario.status === "available") {
      assert.equal(scenario.points[0].actualDeficitKcal, expectedDeficit);
      assert.equal(scenario.points[0].rawKcal, expectedTarget);
    }
  }
});

test("BMI 24.9 and 25.0 use the identical fat-loss calculation", () => {
  const below = calculateTargetScenario({
    evaluation: evaluationWithMaintenance(3000, 24.9),
    selection: { goal: "lose" },
  });
  const at = calculateTargetScenario({
    evaluation: evaluationWithMaintenance(3000, 25),
    selection: { goal: "lose" },
  });
  assert.deepEqual(below, at);
});

test("legacy 15% and 20% selections are unavailable and no 750 kcal branch remains", () => {
  for (const rate of [0.15, 0.2]) {
    const scenario = calculateTargetScenario({
      evaluation: evaluationWithMaintenance(8000, 30),
      selection: { goal: "lose", rate } as never,
    });
    assert.equal(scenario.status, "unavailable");
    if (scenario.status === "unavailable") assert.equal(scenario.reason, "INVALID_SELECTION");
  }

  const valid = calculateTargetScenario({
    evaluation: evaluationWithMaintenance(8000, 30),
    selection: { goal: "lose" },
  });
  assert.equal(valid.status, "available");
  if (valid.status === "available") assert.equal(valid.points[0].actualDeficitKcal, 500);
});

test("a legacy performance-priority property cannot change any numeric result", () => {
  const withPriority = evaluateEnergyLab({ ...BASE_INPUT, performancePriority: true } as EnergyLabInput);
  const withoutPriority = evaluateEnergyLab({ ...BASE_INPUT, performancePriority: false } as EnergyLabInput);
  assert.deepEqual(withPriority, withoutPriority);
});

test("runtime-invalid loss and gain modes are rejected by the calculation layer", () => {
  const evaluation = readyEvaluation({ weightKg: 80 });
  const invalidLoss = calculateTargetScenario({
    evaluation,
    selection: { goal: "lose", rate: 0.25 } as never,
  });
  const invalidGain = calculateTargetScenario({
    evaluation,
    selection: { goal: "gain", mode: "plus500" } as never,
  });

  assert.equal(invalidLoss.status, "unavailable");
  assert.equal(invalidGain.status, "unavailable");
  if (invalidLoss.status === "unavailable") assert.equal(invalidLoss.reason, "INVALID_SELECTION");
  if (invalidGain.status === "unavailable") assert.equal(invalidGain.reason, "INVALID_SELECTION");
});

test("the low-output gate uses raw target values below, at, and slightly above 1,200", () => {
  for (const [targetRaw, expectedStatus] of [
    [1199.9, "unavailable"],
    [1200, "unavailable"],
    [1200.1, "available"],
  ] as const) {
    const scenario = calculateTargetScenario({
      evaluation: evaluationWithMaintenance(targetRaw / 0.9),
      selection: { goal: "lose" },
    });
    assert.equal(scenario.status, expectedStatus);
  }
});

test("display rounding to 1,200 cannot withhold a raw target above 1,200", () => {
  const scenario = calculateTargetScenario({
    evaluation: evaluationWithMaintenance(1200.1 / 0.9),
    selection: { goal: "lose" },
  });
  assert.equal(scenario.status, "available");
  if (scenario.status === "available") {
    assert.ok(scenario.rawMin > 1200);
    assert.equal(scenario.displayMin, 1200);
  }
});

test("a fat-loss target below 1,200 kcal is withheld", () => {
  const result = readyEvaluation({
    sex: "female",
    age: 90,
    heightCm: 145,
    weightKg: 39,
    activityProfiles: ["inactive"],
  });
  const scenario = calculateTargetScenario({
    evaluation: result,
    selection: { goal: "lose" },
  });
  assert.equal(scenario.status, "unavailable");
  if (scenario.status === "unavailable") {
    assert.equal(scenario.reason, "TARGET_AT_OR_BELOW_1200");
  }
});

test("under-19 inputs fail validation and never run the adult numerical engine", () => {
  const result = evaluateEnergyLab({ ...BASE_INPUT, age: 18 });
  assert.equal(result.status, "invalid");
  if (result.status === "invalid") assert.equal(result.errors[0]?.code, "INVALID_AGE");
  assert.throws(
    () =>
      calculateNasem2023AdultEer({
        sex: "female",
        age: 18,
        heightCm: 165,
        weightKg: 60,
        activityProfile: "inactive",
      }),
    RangeError,
  );
});

test("age 19 enters the adult engine and BMI 50 routes out of the general flow", () => {
  assert.equal(evaluateEnergyLab({ ...BASE_INPUT, age: 19 }).status, "ready");
  assert.equal(evaluateEnergyLab({ ...BASE_INPUT, weightKg: 140 }).status, "blocked");
});

test("BMI under 18.5 disables fat loss and BMI under 16 blocks standard targets", () => {
  const limited = evaluateEnergyLab({ ...BASE_INPUT, weightKg: 48 });
  assert.equal(limited.status, "ready");
  if (limited.status === "ready") assert.equal(limited.scope.fatLossAllowed, false);

  const blocked = evaluateEnergyLab({ ...BASE_INPUT, weightKg: 40 });
  assert.equal(blocked.status, "blocked");
});

test("the general scope gate allows standard adults and blocks uncertain scope without details", () => {
  assert.equal(evaluateEnergyLab({ ...BASE_INPUT, generalScope: "standardAdult" }).status, "ready");

  const outsideScope = evaluateEnergyLab({
    ...BASE_INPUT,
    generalScope: "mayBeOutsideScope",
  });
  assert.equal(outsideScope.status, "blocked");
  if (outsideScope.status === "blocked") {
    assert.equal(outsideScope.scope.reasons[0]?.code, "MAY_BE_OUTSIDE_GENERAL_SCOPE");
    assert.match(outsideScope.scope.reasons[0]?.message ?? "", /sağlık profesyoneli/i);
  }
});

test("invalid or missing general scope choices never reach a numerical result", () => {
  const invalid = evaluateEnergyLab({ ...BASE_INPUT, generalScope: "" as never });
  assert.equal(invalid.status, "invalid");
  if (invalid.status === "invalid") {
    assert.equal(invalid.errors[0]?.field, "generalScope");
  }
});

test("empty, NaN and invalid activity combinations never reach a result", () => {
  const result = evaluateEnergyLab({
    ...BASE_INPUT,
    weightKg: Number.NaN,
    activityProfiles: ["inactive", "active"],
  });
  assert.equal(result.status, "invalid");
  if (result.status === "invalid") assert.equal(result.errors.length, 2);
});

test("malformed runtime inputs fail closed instead of producing numeric results", () => {
  const missing = evaluateEnergyLab({} as never);
  assert.equal(missing.status, "invalid");
  if (missing.status === "invalid") {
    assert.deepEqual(
      new Set(missing.errors.map((error) => error.field)),
      new Set(["age", "sex", "heightCm", "weightKg", "activityProfiles", "generalScope"]),
    );
  }

  assert.throws(() => calculateBmi(Number.NaN, 170), RangeError);
  assert.throws(
    () =>
      calculateMifflinStJeorRmr({
        sex: "female",
        age: 18,
        heightCm: 165,
        weightKg: 60,
      }),
    RangeError,
  );
});

test("gain targets expose maintenance and a true 5% small-surplus option only", () => {
  const result = readyEvaluation();
  const maintenance = calculateTargetScenario({
    evaluation: result,
    selection: { goal: "gain", mode: "maintenance" },
  });
  const surplus = calculateTargetScenario({
    evaluation: result,
    selection: { goal: "gain", mode: "smallSurplus" },
  });
  assert.equal(maintenance.status, "available");
  assert.equal(surplus.status, "available");
  if (maintenance.status === "available" && surplus.status === "available") {
    assert.equal(maintenance.rawMin, result.maintenance.rawMin);
    assert.ok(Math.abs(surplus.rawMin - result.maintenance.rawMin * 1.05) < 1e-8);
    assert.notEqual(surplus.rawMin - result.maintenance.rawMin, 500);
  }
});
