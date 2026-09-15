import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readSource(relativePath: string): string {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("calculator detail layout uses the compact desktop spacing contract", () => {
  const layout = readSource("components/calculators/CalculatorLayout.tsx");
  const form = readSource("components/calculators/CalculatorForm.tsx");
  const section = readSource("components/calculators/CalculatorSection.tsx");

  assert.match(layout, /!px-4 !py-7 sm:!px-6 sm:!py-9 lg:!py-10/);
  assert.match(layout, /space-y-6 lg:space-y-7/);
  assert.match(layout, /calculator-shell/);
  assert.match(layout, /calculator-content/);
  assert.match(layout, /\[&>h1\]:!mt-0[\s\S]*\[&>p\]:!mt-3/);
  assert.match(form, /space-y-5/);
  assert.match(section, /<header className="mb-5">/);
});

test("standard calculators use compact desktop field grids where appropriate", () => {
  const pages = {
    ffmi: readSource("components/ffmi/FFMIExperience.tsx"),
    protein: readSource("app/calculators/protein/page.tsx"),
  };

  assert.match(pages.ffmi, /lg:grid-cols-3/);
  assert.match(pages.protein, /sm:grid-cols-3/);
  assert.match(pages.protein, /lg:grid-cols-\[minmax\(0,\.72fr\)_minmax\(0,2fr\)\]/);
  assert.match(pages.protein, /max-height:850px/);
});

test("Energy Lab uses breathable responsive surfaces without viewport-fit tricks", () => {
  const energyPage = readSource("app/calculators/calorie/page.tsx");
  const energyWizard = readSource("components/energy-lab/EnergyLabExperience.tsx");

  assert.match(energyPage, /sm:py-9 lg:py-4/);
  assert.match(energyWizard, /lg:min-h-\[calc\(100svh-14\.25rem\)\] lg:py-8/);
  assert.match(energyWizard, /p-5[\s\S]*?sm:p-8 lg:p-10/);
  assert.match(energyWizard, /mt-7 grid gap-5 sm:grid-cols-2/);
  assert.match(energyWizard, /lg:mt-1\.5 lg:min-h-13/);
  assert.match(energyWizard, /grid grid-cols-3 gap-3 sm:gap-5/);
  assert.match(energyWizard, /min-h-28 w-full p-5/);
  assert.match(energyPage, /max-height:850px\)\]:py-2\.5/);
  assert.match(energyWizard, /mt-5 grid gap-3 sm:grid-cols-2/);
  assert.doesNotMatch(energyWizard, /performancePriority|grid-cols-\[0\.75fr_1\.25fr\]/);
  assert.match(energyWizard, /max-height:850px\)\]:min-h-11/);
  assert.doesNotMatch(energyWizard, /zoom:|zoom-|transform:\s*scale|scale-\[/);
  assert.doesNotMatch(energyWizard, /overflow-x-(?:auto|scroll|hidden)/);
});

test("four-product calculator family uses shared semantic surfaces and states", () => {
  const globals = readSource("app/globals.css");
  const layout = readSource("components/calculators/CalculatorLayout.tsx");
  const referenceUi = readSource("components/calculators/ReferenceToolUI.tsx");
  const macro = readSource("app/calculators/macro/page.tsx");
  const protein = readSource("app/calculators/protein/page.tsx");
  const ffmi = readSource("components/ffmi/FFMIExperience.tsx");
  const energy = readSource("components/energy-lab/EnergyLabExperience.tsx");

  for (const token of [
    "--calculator-page-bg",
    "--calculator-surface",
    "--calculator-surface-subtle",
    "--calculator-text-primary",
    "--calculator-text-secondary",
    "--calculator-border",
    "--calculator-navy",
    "--calculator-gold",
    "--calculator-gold-subtle",
    "--calculator-error",
    "--calculator-disabled",
    "--calculator-focus",
  ]) assert.match(globals, new RegExp(token));

  assert.match(layout, /calculator-shell/);
  assert.match(referenceUi, /calculator-surface/);
  assert.match(referenceUi, /calculator-choice/);
  assert.match(referenceUi, /calculator-disclosure/);
  assert.match(macro, /id="macro-planner-form"[\s\S]*calculator-surface/);
  assert.match(macro, /calculator-result/);
  assert.match(protein, /calculator-result-light/);
  assert.match(ffmi, /calculator-result-light/);
  assert.match(ffmi, /data-selected=\{selected\}[\s\S]*calculator-choice/);
  assert.match(energy, /calculator-surface/);
  assert.match(energy, /calculator-result/);
  assert.match(globals, /@media \(prefers-reduced-motion: reduce\)/);
});
