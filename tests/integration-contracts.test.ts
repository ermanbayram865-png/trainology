import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import sitemap from "../app/sitemap";
import { ENERGY_LAB_PATH } from "../lib/routes";

function readSource(relativePath: string): string {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

function sourcePath(relativePath: string): URL {
  return new URL(`../${relativePath}`, import.meta.url);
}

const ENERGY_LAB_ENTRYPOINTS = [
  "components/layout/Navbar.tsx",
  "components/home/HeroSection.tsx",
  "components/home/FinalCTA.tsx",
  "components/home/ToolsShowcase.tsx",
  "app/about/page.tsx",
  "app/calculators/page.tsx",
  "app/calculators/calorie/layout.tsx",
  "app/analysis/page.tsx",
  "components/energy-lab/EnergyLabLegacyRedirect.tsx",
] as const;

test("Energy Lab has one canonical route and every public entry point consumes it", () => {
  assert.equal(ENERGY_LAB_PATH, "/calculators/calorie");

  for (const relativePath of ENERGY_LAB_ENTRYPOINTS) {
    const source = readSource(relativePath);
    assert.match(source, /\bENERGY_LAB_PATH\b/);
    assert.doesNotMatch(source, /(?:href\s*=\s*|href\s*:\s*)["']\/analysis["']/);
  }
});

test("sitemap lists the canonical Energy Lab route once and omits /analysis", () => {
  const paths = sitemap().map(({ url }) => {
    const pathname = new URL(url).pathname;
    return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  });

  assert.equal(paths.filter((path) => path === ENERGY_LAB_PATH).length, 1);
  assert.equal(paths.includes("/analysis"), false);
  assert.equal(paths.some((path) => path.startsWith("/movements")), false);
});

test("movement library routes and public entry points have been removed", () => {
  for (const relativePath of [
    "app/movements/page.tsx",
    "app/movements/[slug]/page.tsx",
    "components/home/MovementPreview.tsx",
    "data/movements/movements.ts",
  ]) {
    assert.equal(existsSync(sourcePath(relativePath)), false, `${relativePath} must not exist.`);
  }

  const publicSurfaces = [
    "app/page.tsx",
    "app/about/page.tsx",
    "app/layout.tsx",
    "components/layout/Navbar.tsx",
    "components/layout/Footer.tsx",
    "components/home/FinalCTA.tsx",
  ].map(readSource).join("\n");

  assert.doesNotMatch(publicSurfaces, /\/movements|Hareket Kütüphanesi/i);
});

test("the Energy Lab implementation contains no legacy RMR multiplier engine", () => {
  const implementation = [
    "lib/energy-lab/engine.ts",
    "lib/energy-lab/types.ts",
    "lib/calculators/calorie.ts",
  ].map(readSource).join("\n");

  assert.doesNotMatch(implementation, /\bactivityMultipliers\b/i);
  assert.doesNotMatch(implementation, /\b(?:1\.2|1\.375|1\.55|1\.725|1\.9)\b/);
  assert.doesNotMatch(implementation, /\b(?:bmr|rmr)\s*\*\s*(?:activity|pal)/i);
  assert.match(readSource("lib/calculators/calorie.ts"), /\bevaluateEnergyLab\b/);
});

test("calibration and macro handoff modules have been removed", () => {
  for (const relativePath of [
    "components/energy-lab/CalibrationPanel.tsx",
    "lib/energy-lab/calibration.ts",
    "lib/energy-lab/storage.ts",
    "lib/energy-lab/handoff.ts",
  ]) {
    assert.equal(existsSync(sourcePath(relativePath)), false, `${relativePath} must not exist.`);
  }

  const barrel = readSource("lib/energy-lab/index.ts");
  assert.doesNotMatch(barrel, /calibration|handoff|storage/i);
});

test("Energy Lab keeps personal form values transient and transfers only the selected calorie target", () => {
  const experience = readSource("components/energy-lab/EnergyLabExperience.tsx");
  const macro = readSource("app/calculators/macro/page.tsx");
  const combined = `${experience}\n${macro}`;

  assert.match(experience, /useState<FormState>\(initialForm\)/);
  assert.match(experience, /setEvaluation\(null\)/);
  assert.match(experience, /autoComplete="off"/);
  assert.match(experience, /pageshow/);
  assert.match(experience, /event\.persisted/);
  assert.doesNotMatch(combined, /localStorage|sessionStorage|indexedDB/i);
  assert.doesNotMatch(combined, /fetch\s*\(|XMLHttpRequest|sendBeacon|axios/i);
  assert.doesNotMatch(combined, /console\.(?:log|debug|table)|use server/i);
  assert.doesNotMatch(experience, /<form[^>]+\baction\s*=/);
  assert.doesNotMatch(experience, /router\.(?:push|replace)|window\.location|location\.hash/i);
});

test("the general scope gate collects no detailed health category", () => {
  const experience = readSource("components/energy-lab/EnergyLabExperience.tsx");
  const engine = readSource("lib/energy-lab/engine.ts");

  assert.match(experience, /Bu hesaplama senin için uygun mu\?/);
  assert.match(experience, /Genel yetişkin kapsamındayım\./);
  assert.match(experience, /Bu araç benim durumuma uygun olmayabilir/);
  assert.doesNotMatch(experience, /Yanıtın kaydedilmez veya sunucuya gönderilmez/);
  assert.doesNotMatch(experience, /safetyFlags|pregnancyOrBreastfeeding|eatingDisorderOrRedsRisk/);
  assert.doesNotMatch(experience, /medicalReviewContext|competitionOrExtremeAthleteContext/);
  assert.doesNotMatch(experience, /name="safetyFlags"|type="checkbox"[^>]+name="safety/);
  assert.match(engine, /generalScope === "mayBeOutsideScope"/);
  assert.match(engine, /bu durumda sayısal hedef göstermez/i);
});

test("removed calibration UI and storage keys do not remain in application source", () => {
  const sources = [
    "components/energy-lab/EnergyLabExperience.tsx",
    "components/energy-lab/EnergyLabMethodology.tsx",
    "app/calculators/calorie/page.tsx",
    "app/calculators/calorie/layout.tsx",
    "app/about/page.tsx",
  ].map(readSource).join("\n");

  assert.doesNotMatch(sources, /Kalibrasyon|Ağırlık trendi|Günlük kayıt|14 gün|28 gün/i);
  assert.doesNotMatch(sources, /trainology\.energy-lab\.(?:calibration|macro-handoff)\.v1/i);
});

test("Macro Planner accepts a validated calorie prefill while direct use stays blank", () => {
  const experience = readSource("components/energy-lab/EnergyLabExperience.tsx");
  const macro = readSource("app/calculators/macro/page.tsx");

  assert.match(experience, /\/calculators\/macro\?calories=\$\{selectedPoint\.displayKcal\}/);
  assert.match(experience, /Makrolarımı Planla/);
  assert.match(experience, /scenario\.points\.length === 1 \? 0 : null/);
  assert.match(experience, /Önce bir kalori hedefi seç/);
  assert.match(macro, /calories:\s*""/);
  assert.match(macro, /weight:\s*""/);
  assert.match(macro, /useSearchParams\(\)/);
  assert.match(macro, /getCaloriePrefill\(searchParams\.get\("calories"\)\)/);
  assert.match(macro, /calories >= 1000 && calories <= 8000/);
  assert.doesNotMatch(macro, /EnergyLab|handoff|source=energy-lab|sessionStorage/i);
});

test("governance separates scientific final locks from pending manual browser release QA", () => {
  const governance = readSource("docs/calculator-governance.md");
  for (const calculator of [
    "Energy Lab / Kalori Hedefi Simülatörü",
    "Makro Planlayıcı",
    "Günlük Protein Referansı",
    "FFMI Analizi",
  ]) {
    assert.match(
      governance,
      new RegExp(`${calculator.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}[^\\n]+SCIENTIFIC_FINAL_LOCK[^\\n]+MANUAL_BROWSER_PENDING`),
    );
  }
  assert.match(governance, /conservative Trainology calculation convention/);
  assert.match(governance, /1\.2 g\/kg\/day[\s\S]*not universal, optimal, mandatory, minimum, or maximum/);
  assert.match(governance, /Günlük Su Alımı Rehberi[^\n]+DECOMMISSIONED/);
  assert.match(governance, /insufficient calculator-specific personalization\/value/);
});

test("Energy Lab uses a compact responsive wizard instead of the legacy sticky profile", () => {
  const experience = readSource("components/energy-lab/EnergyLabExperience.tsx");
  assert.match(experience, /type WizardStep = 1 \| 2 \| 3/);
  assert.match(experience, /Temel Bilgiler/);
  assert.match(experience, /Günlük Hareket/);
  assert.match(experience, /Hedefimi Hesapla/);
  assert.doesNotMatch(experience, /sticky|overflow-y-auto/);
});

test("Energy Lab result actions stay visible and do not create a horizontal scroll container", () => {
  const experience = readSource("components/energy-lab/EnergyLabExperience.tsx");
  const page = readSource("app/calculators/calorie/page.tsx");
  const globals = readSource("app/globals.css");

  assert.match(experience, /Bu kalori hedefini protein, karbonhidrat ve yağlara dağıt/);
  assert.match(experience, /Makrolarımı Planla/);
  assert.match(experience, /w-full items-center[\s\S]+sm:w-auto/);
  assert.doesNotMatch(page, /<main className="[^"]*overflow-x-hidden/);
  assert.doesNotMatch(globals, /a\s*\{[\s\S]*?color:\s*inherit/);
});

test("legal pages describe Energy Lab transient processing without site-wide absolutes", () => {
  const legal = [
    "app/gizlilik-politikasi/page.tsx",
    "app/kvkk-aydinlatma-metni/page.tsx",
    "app/cerez-ve-yerel-depolama-politikasi/page.tsx",
  ].map(readSource).join("\n");

  assert.match(legal, /geçici (?:React durumu|çalışma belleği|olarak işlenir)/);
  assert.match(legal, /Trainology sunuc/);
  assert.match(legal, /hosting/i);
  assert.doesNotMatch(legal, /Trainology hiçbir veri toplamaz|Hiçbir veri hiçbir yerde saklanmaz/i);
  assert.doesNotMatch(legal, /Ağırlık Trendi Kalibrasyonu|günlük vücut ağırlığı|döngü notu/i);
});
