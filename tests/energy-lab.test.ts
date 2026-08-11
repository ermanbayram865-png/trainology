import assert from "node:assert/strict";
import test from "node:test";

import {
  CALIBRATION_STORAGE_KEY,
  ENERGY_LAB_HANDOFF_KEY,
  calculateMifflinStJeorRmr,
  calculateNasem2023AdultEer,
  calculateTargetScenario,
  clearCalibrationEntries,
  evaluateEnergyLab,
  getFatLossPolicy,
  isValidActivitySelection,
  normalizeCalibrationEntries,
  readCalibrationEntries,
  readEnergyLabHandoff,
  removeCalibrationEntry,
  roundToNearest50,
  summarizeCalibration,
  upsertCalibrationEntry,
  writeCalibrationEntries,
  writeEnergyLabHandoff,
  type CalibrationEntry,
  type EnergyLabInput,
  type StorageLike,
} from "../lib/energy-lab/index";

const BASE_INPUT: EnergyLabInput = {
  age: 30,
  sex: "female",
  heightCm: 165,
  weightKg: 60,
  activityProfiles: ["inactive"],
  performancePriority: false,
  safetyFlags: [],
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

test("pregnancy/breastfeeding and eating-disorder/RED-S contexts block standard targets", () => {
  const pregnancy = evaluateEnergyLab({
    ...BASE_INPUT,
    safetyFlags: ["pregnancyOrBreastfeeding"],
  });
  const risk = evaluateEnergyLab({
    ...BASE_INPUT,
    safetyFlags: ["eatingDisorderOrRedsRisk"],
  });
  assert.equal(pregnancy.status, "blocked");
  assert.equal(risk.status, "blocked");
});

test("medical and extreme-athlete contexts route to professional review", () => {
  const medical = evaluateEnergyLab({ ...BASE_INPUT, safetyFlags: ["medicalReviewContext"] });
  const athlete = evaluateEnergyLab({
    ...BASE_INPUT,
    safetyFlags: ["competitionOrExtremeAthleteContext"],
  });
  assert.equal(medical.status, "blocked");
  assert.equal(athlete.status, "blocked");
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

test("calibration normalization removes invalid records and upserts duplicate dates", () => {
  const entries = normalizeCalibrationEntries([
    { date: "2026-01-01", weightKg: 80 },
    { date: "bad-date", weightKg: 79 },
    { date: "2026-01-01", weightKg: 79.5, note: " güncellendi " },
    { date: "2026-01-02", weightKg: Number.NaN },
  ]);
  assert.deepEqual(entries, [{ date: "2026-01-01", weightKg: 79.5, note: "güncellendi" }]);

  const updated = upsertCalibrationEntry(entries, { date: "2026-01-01", weightKg: 79 });
  assert.deepEqual(updated, [{ date: "2026-01-01", weightKg: 79 }]);
  assert.deepEqual(removeCalibrationEntry(updated, "2026-01-01"), []);
});

test("calibration stage messages switch at 14 and 28 valid days", () => {
  assert.match(summarizeCalibration(makeEntries(13)).stageMessage, /yeterli trend verisi yok/i);
  assert.match(summarizeCalibration(makeEntries(14)).stageMessage, /İlk trend oluşuyor/i);
  assert.match(summarizeCalibration(makeEntries(27)).stageMessage, /İlk trend oluşuyor/i);
  assert.match(summarizeCalibration(makeEntries(28)).stageMessage, /daha güçlü veri/i);
});

test("28 records spread across months are not treated as a 28-day calibration window", () => {
  const sparseEntries = Array.from({ length: 28 }, (_, index) => ({
    date: new Date(Date.UTC(2025, 0, 1 + index * 7)).toISOString().slice(0, 10),
    weightKg: 80 - index * 0.1,
  }));
  const summary = summarizeCalibration(sparseEntries);
  assert.equal(summary.dataQuality, "missing");
  assert.ok(summary.completedDays < 14);
  assert.ok(summary.observationDays <= 28);
});

test("calibration uses first and last seven-day averages and returns only a direction", () => {
  const summary = summarizeCalibration(makeEntries(28, (day) => 80 - day * 0.1));
  assert.equal(summary.firstSevenAverage, 79.7);
  assert.equal(summary.lastSevenAverage, 77.6);
  assert.equal(summary.direction, "down");
  assert.doesNotMatch(summary.directionMessage, /-100|-200|\+100|\+200/);
});

test("the 28-day, greater-than-4% loss caution is applied without diagnosis", () => {
  const summary = summarizeCalibration(
    makeEntries(28, (day) => (day < 7 ? 80 : day >= 21 ? 75 : 77.5)),
  );
  assert.equal(summary.rapidLossCaution, true);
});

test("the calibration caution is strict: exactly 4% does not trigger", () => {
  const entries = makeEntries(28, (day) => (day < 7 ? 80 : day >= 21 ? 76.8 : 78.4));
  const summary = summarizeCalibration(entries);
  assert.ok(
    summary.firstSevenAverage !== null &&
      summary.lastSevenAverage !== null &&
      Math.abs(
        (summary.firstSevenAverage - summary.lastSevenAverage) / summary.firstSevenAverage -
          0.04,
      ) < 1e-10,
  );
  assert.equal(summary.rapidLossCaution, false);
});

test("sub-0.1 kg average noise is not labelled as an up or down direction", () => {
  const summary = summarizeCalibration(
    makeEntries(14, (day) => (day < 7 ? 80 : 79.98)),
  );
  assert.equal(summary.direction, "stable");
  assert.match(summary.directionMessage, /0,1 kg gösterim çözünürlüğünde/i);
});

test("versioned local storage data is read safely, updated and cleared", () => {
  const storage = new MemoryStorage();
  storage.setItem(CALIBRATION_STORAGE_KEY, "not-json");
  assert.deepEqual(readCalibrationEntries(storage), []);

  const entries = writeCalibrationEntries(storage, [{ date: "2026-01-01", weightKg: 80 }]);
  assert.deepEqual(entries, [{ date: "2026-01-01", weightKg: 80 }]);
  assert.deepEqual(readCalibrationEntries(storage), entries);
  clearCalibrationEntries(storage);
  assert.deepEqual(readCalibrationEntries(storage), []);
});

test("macro handoff contains only validated planning fields", () => {
  const storage = new MemoryStorage();
  const written = writeEnergyLabHandoff(storage, {
    rawTargetKcal: 2275.37,
    displayTargetKcal: 2300,
    goal: "maintain",
    weightKg: 63,
    activityProfile: "lowActive",
  });
  assert.deepEqual(readEnergyLabHandoff(storage), written);

  const serialized = storage.getItem(ENERGY_LAB_HANDOFF_KEY) ?? "";
  assert.doesNotMatch(serialized, /pregnan|safety|eating|medication|sex|height|age/i);
  storage.setItem(ENERGY_LAB_HANDOFF_KEY, JSON.stringify({ ...written, rawTargetKcal: null }));
  assert.equal(readEnergyLabHandoff(storage), null);
});

function makeEntries(
  count: number,
  weightForDay: (day: number) => number = (day) => 80 - day * 0.05,
): CalibrationEntry[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(2026, 0, index + 1)).toISOString().slice(0, 10);
    return { date, weightKg: weightForDay(index) };
  });
}

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}
