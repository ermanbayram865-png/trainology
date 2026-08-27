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

  assert.match(layout, /!py-8 sm:!py-10 lg:!py-10/);
  assert.match(layout, /space-y-6 lg:space-y-7/);
  assert.match(layout, /\[&>h1\]:!mt-0 \[&>p\]:!mt-3/);
  assert.match(form, /space-y-5/);
  assert.match(section, /<header className="mb-5">/);
});

test("standard calculators use compact desktop field grids where appropriate", () => {
  const pages = {
    ffmi: readSource("components/ffmi/FFMIExperience.tsx"),
    healthyWeight: readSource("app/calculators/healthy-weight/page.tsx"),
    protein: readSource("app/calculators/protein/page.tsx"),
    water: readSource("app/calculators/water/page.tsx"),
    hydration: readSource("components/hydration/HydrationExperience.tsx"),
  };

  assert.match(pages.ffmi, /lg:grid-cols-3/);
  assert.match(pages.healthyWeight, /lg:grid-cols-\[minmax\(0,1fr\)_auto\]/);
  assert.match(pages.protein, /sm:grid-cols-3/);
  assert.match(pages.protein, /lg:grid-cols-\[minmax\(0,\.72fr\)_minmax\(0,2fr\)\]/);
  assert.match(pages.hydration, /columns=\{2\}/);
  assert.match(pages.protein, /max-height:850px/);
  assert.match(pages.water, /max-height:850px/);
  assert.match(pages.hydration, /max-height:850px/);
});

test("Energy Lab retains responsive expansion while compacting initial desktop state", () => {
  const energyPage = readSource("app/calculators/calorie/page.tsx");
  const energyWizard = readSource("components/energy-lab/EnergyLabExperience.tsx");

  assert.match(energyPage, /sm:py-9 lg:py-4/);
  assert.match(energyWizard, /lg:min-h-\[calc\(100svh-14\.25rem\)\] lg:py-3/);
  assert.match(energyWizard, /lg:px-7 lg:py-5/);
  assert.match(energyWizard, /sm:grid-cols-2 lg:mt-4 lg:gap-3/);
  assert.match(energyWizard, /lg:mt-1\.5 lg:min-h-13/);
  assert.match(energyWizard, /sm:text-sm lg:pt-1\.5/);
  assert.match(energyWizard, /min-h-28 rounded-2xl border p-4/);
  assert.match(energyPage, /max-height:850px\)\]:py-2\.5/);
  assert.match(energyWizard, /max-height:850px\)\]:grid-cols-4/);
  assert.match(energyWizard, /max-height:850px\)\]:grid-cols-\[0\.75fr_1\.25fr\]/);
  assert.match(energyWizard, /max-height:850px\)\]:min-h-11/);
  assert.doesNotMatch(energyWizard, /zoom:|transform:\s*scale/);
});
