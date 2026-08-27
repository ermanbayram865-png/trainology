import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../components/energy-lab/EnergyLabExperience.tsx", import.meta.url),
  "utf8",
);
const page = readFileSync(
  new URL("../app/calculators/calorie/page.tsx", import.meta.url),
  "utf8",
);

test("Energy Lab presents the required three-step wizard and guarded navigation", () => {
  assert.match(source, /type WizardStep = 1 \| 2 \| 3/);
  assert.match(source, /validateBasics\(form\)/);
  assert.match(source, /validateActivity\(form\)/);
  assert.match(source, /step === 3 \? "Hedefimi Hesapla" : "Devam Et"/);
  assert.match(source, /setStep\(\(current\) => \(current === 3 \? 2 : 1\)\)/);
  assert.match(source, /aria-current=\{active \? "step" : undefined\}/);
});

test("Energy Lab removes unused personalization fields and keeps the real policy input", () => {
  assert.doesNotMatch(source, /workStyle|trainingDays|trainingMinutes|dailySteps|nasemLabel/);
  assert.match(source, /performancePriority/);
  assert.match(source, /generalScope/);
});

test("Activity Finder uses only existing profiles and adjacent two-profile selection", () => {
  for (const profile of ["inactive", "lowActive", "active", "veryActive"]) {
    assert.match(source, new RegExp(`value: "${profile}"`));
  }
  assert.match(source, /Math\.abs\(currentIndex - nextIndex\) === 1/);
  assert.match(source, /Bu bir istatistiksel güven aralığı değildir/);
  assert.doesNotMatch(source, /stepThreshold|trainingThreshold|automaticActivity/i);
});

test("goal options are progressive and retain the existing target engine", () => {
  assert.match(source, /useState<EnergyGoal \| "">\(""\)/);
  assert.match(source, /goal === "lose" &&/);
  assert.match(source, /goal === "gain" &&/);
  assert.match(source, /Kontrollü başlangıç/);
  assert.match(source, /Dengeli başlangıç/);
  assert.match(source, /Daha yüksek açık/);
  assert.match(source, /calculateTargetScenario\(/);
  assert.match(source, /evaluateEnergyLab\(/);
});

test("results preserve safety, estimation and RMR display contracts", () => {
  assert.match(source, /Sayısal hedef gösterilmiyor/);
  assert.match(source, /targetScenario\.status === "available"/);
  assert.match(source, /age <= 78/);
  assert.match(source, /Bu değer ölçülmüş kesin enerji ihtiyacın değil/);
  assert.match(source, /Bakım enerjisi, RMR ile bir aktivite/);
  assert.match(source, /en yakın 50 kcal’ye yuvarlanır/);
});

test("macro handoff transfers one exact scenario and requires a choice for two", () => {
  assert.match(source, /scenario\.points\.length === 1 \? 0 : null/);
  assert.match(source, /scenario\.points\.length === 2/);
  assert.match(source, /setSelectedPointIndex\(index\)/);
  assert.match(source, /calories=\$\{selectedPoint\.displayKcal\}/);
  assert.doesNotMatch(source, /displayMin \+ displayMax|\/ 2/);
});

test("page hero is compact and contains no Energy Lab 2.0 marketing panel", () => {
  assert.match(page, /Kalori Hedefi Simülatörü/);
  assert.match(page, /Günlük enerji ihtiyacın ve hedefin için tahmini bir başlangıç noktası oluştur/);
  assert.doesNotMatch(page, /Energy Lab 2\.0|processSteps|Enerji Protokolü/);
});
