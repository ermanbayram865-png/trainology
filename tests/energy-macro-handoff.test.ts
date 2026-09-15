import assert from "node:assert/strict";
import test from "node:test";

import {
  getMacroCalorieHandoffHref,
  parseMacroCaloriePrefill,
} from "../lib/calculators/macro-prefill";

test("Energy yalnız Macro aralığındaki hedefler için handoff üretir", () => {
  assert.equal(getMacroCalorieHandoffHref(999), null);
  assert.equal(getMacroCalorieHandoffHref(1000), "/calculators/macro?calories=1000");
  assert.equal(getMacroCalorieHandoffHref(2450), "/calculators/macro?calories=2450");
  assert.equal(getMacroCalorieHandoffHref(8000), "/calculators/macro?calories=8000");
  assert.equal(getMacroCalorieHandoffHref(8001), null);
});

test("Macro query calorie parametresini fail-closed doğrular", () => {
  for (const value of [null, "", " ", "999", "8001", "1000.5", "NaN", "Infinity", "abc"]) {
    assert.equal(parseMacroCaloriePrefill(value), "");
  }

  assert.equal(parseMacroCaloriePrefill("1000"), "1000");
  assert.equal(parseMacroCaloriePrefill("8000"), "8000");
});
