import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateMifflinStJeorRmr,
  calculateNasem2023AdultEer,
  calculateTargetScenario,
  evaluateEnergyLab,
  getFatLossPolicy,
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
  performancePriority: false,
  generalScope: "standardAdult",
};

function readyEvaluation(overrides: Partial<EnergyLabInput> = {}) {
  const result = evaluateEnergyLab({ ...BASE_INPUT, ...overrides });
  assert.equal(result.status, "ready");
  if (result.status !== "ready") throw new Error("Expected a ready Energy Lab result.");
  return result;
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

test("BMI 18.5–24.9 defaults to 10%, disables 20%, and caps deficit at 500 kcal", () => {
  const result = readyEvaluation({ weightKg: 60 });
  const policy = getFatLossPolicy(result.bmi, false, result.scope.fatLossAllowed);
  assert.equal(policy.defaultRate, 0.1);
  assert.equal(policy.deficitCapKcal, 500);
  assert.equal(policy.options.find((option) => option.rate === 0.2)?.enabled, false);
});

test("BMI 25 or above defaults to 15%, enables 20%, and caps deficit at 750 kcal", () => {
  const result = readyEvaluation({ weightKg: 75 });
  const policy = getFatLossPolicy(result.bmi, false, result.scope.fatLossAllowed);
  assert.equal(policy.defaultRate, 0.15);
  assert.equal(policy.deficitCapKcal, 750);
  assert.equal(policy.options.find((option) => option.rate === 0.2)?.enabled, true);
});

test("fat-loss policy boundaries are enforced on raw BMI values", () => {
  assert.equal(getFatLossPolicy(18.499, false).defaultRate, null);
  assert.equal(getFatLossPolicy(18.5, false).defaultRate, 0.1);
  assert.equal(getFatLossPolicy(24.9, false).defaultRate, 0.1);
  assert.equal(getFatLossPolicy(25, false).defaultRate, 0.15);
  assert.throws(() => getFatLossPolicy(Number.NaN, false), RangeError);
});

test("performance priority disables 20% and applies the more protective 500 kcal cap", () => {
  const result = readyEvaluation({ weightKg: 100, performancePriority: true });
  const policy = getFatLossPolicy(result.bmi, true, result.scope.fatLossAllowed);
  assert.equal(policy.deficitCapKcal, 500);
  assert.equal(policy.options.find((option) => option.rate === 0.2)?.enabled, false);

  const scenario = calculateTargetScenario({
    evaluation: result,
    selection: { goal: "lose", rate: 0.15 },
    performancePriority: true,
  });
  assert.equal(scenario.status, "available");
  if (scenario.status === "available") {
    assert.ok(scenario.points.every((point) => (point.actualDeficitKcal ?? 0) <= 500));
  }
});

test("no 25% fat-loss option exists", () => {
  const policy = getFatLossPolicy(30, false, true);
  assert.deepEqual(
    policy.options.map((option) => option.rate),
    [0.1, 0.15, 0.2],
  );
});

test("runtime-invalid loss and gain modes are rejected by the calculation layer", () => {
  const evaluation = readyEvaluation({ weightKg: 80 });
  const invalidLoss = calculateTargetScenario({
    evaluation,
    selection: { goal: "lose", rate: 0.25 } as never,
    performancePriority: false,
  });
  const invalidGain = calculateTargetScenario({
    evaluation,
    selection: { goal: "gain", mode: "plus500" } as never,
    performancePriority: false,
  });

  assert.equal(invalidLoss.status, "unavailable");
  assert.equal(invalidGain.status, "unavailable");
  if (invalidLoss.status === "unavailable") assert.equal(invalidLoss.reason, "INVALID_SELECTION");
  if (invalidGain.status === "unavailable") assert.equal(invalidGain.reason, "INVALID_SELECTION");
});

test("the 1,200 kcal gate uses raw targets and permits the exact boundary", () => {
  const evaluation = readyEvaluation({ weightKg: 80 });
  const atBoundary = {
    ...evaluation,
    bmi: 30,
    maintenance: {
      kind: "single" as const,
      points: [{ profile: "inactive" as const, rawKcal: 1500, displayKcal: 1500 }],
      rawMin: 1500,
      rawMax: 1500,
      displayMin: 1500,
      displayMax: 1500,
    },
  };
  const belowBoundary = {
    ...atBoundary,
    maintenance: {
      ...atBoundary.maintenance,
      points: [{ profile: "inactive" as const, rawKcal: 1499.9875, displayKcal: 1500 }],
      rawMin: 1499.9875,
      rawMax: 1499.9875,
    },
  };

  const exact = calculateTargetScenario({
    evaluation: atBoundary,
    selection: { goal: "lose", rate: 0.2 },
    performancePriority: false,
  });
  const below = calculateTargetScenario({
    evaluation: belowBoundary,
    selection: { goal: "lose", rate: 0.2 },
    performancePriority: false,
  });

  assert.equal(exact.status, "available");
  if (exact.status === "available") assert.equal(exact.rawMin, 1200);
  assert.equal(below.status, "unavailable");
  if (below.status === "unavailable") assert.equal(below.reason, "TARGET_BELOW_1200");
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
    selection: { goal: "lose", rate: 0.1 },
    performancePriority: false,
  });
  assert.equal(scenario.status, "unavailable");
  if (scenario.status === "unavailable") {
    assert.equal(scenario.reason, "TARGET_BELOW_1200");
  }
});

test("under-19 inputs never run the adult numerical engine", () => {
  const result = evaluateEnergyLab({ ...BASE_INPUT, age: 18 });
  assert.equal(result.status, "blocked");
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

test("gain targets expose maintenance and a true 5% small-surplus option only", () => {
  const result = readyEvaluation();
  const maintenance = calculateTargetScenario({
    evaluation: result,
    selection: { goal: "gain", mode: "maintenance" },
    performancePriority: false,
  });
  const surplus = calculateTargetScenario({
    evaluation: result,
    selection: { goal: "gain", mode: "smallSurplus" },
    performancePriority: false,
  });
  assert.equal(maintenance.status, "available");
  assert.equal(surplus.status, "available");
  if (maintenance.status === "available" && surplus.status === "available") {
    assert.equal(maintenance.rawMin, result.maintenance.rawMin);
    assert.ok(Math.abs(surplus.rawMin - result.maintenance.rawMin * 1.05) < 1e-8);
    assert.notEqual(surplus.rawMin - result.maintenance.rawMin, 500);
  }
});
