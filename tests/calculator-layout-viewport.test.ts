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
  assert.match(pages.protein, /gap-\[var\(--space-field-group\)\]/);
  assert.match(pages.protein, /sectionClassName="!py-\[var\(--space-section-compact\)\]/);
  assert.doesNotMatch(pages.protein, /max-height:850px/);
});

test("active calculators share one low-height desktop rhythm without clipping", () => {
  const globals = readSource("app/globals.css");
  const layout = readSource("components/calculators/CalculatorLayout.tsx");
  const referenceUi = readSource("components/calculators/ReferenceToolUI.tsx");
  const energyPage = readSource("app/calculators/calorie/page.tsx");
  const energy = readSource("components/energy-lab/EnergyLabExperience.tsx");
  const macro = readSource("app/calculators/macro/page.tsx");

  assert.match(layout, /calculator-page-section/);
  assert.match(layout, /calculator-page-intro/);
  assert.match(referenceUi, /calculator-compact-panel/);
  assert.match(energyPage, /calculator-energy-intro/);
  assert.match(energy, /calculator-compact-panel/);
  assert.match(macro, /calculator-compact-panel/);
  assert.match(globals, /@media \(min-width: 1024px\) and \(max-height: 850px\)/);
  assert.match(globals, /\.calculator-page-section[\s\S]*padding-top: 0\.75rem !important/);
  assert.match(globals, /\.calculator-page-intro p[\s\S]*line-height: 1\.375rem !important/);
  assert.match(globals, /\.calculator-compact-panel[\s\S]*padding: 1rem !important/);
  assert.doesNotMatch(globals, /\.calculator-(?:page-section|compact-panel)[^{]*\{[^}]*overflow:\s*hidden/);
  assert.doesNotMatch(globals, /\.calculator-(?:page-section|compact-panel)[^{]*\{[^}]*(?:scale\(|100vh)/);
});

test("global desktop density is semantic, breakpoint-bound, and mobile-safe", () => {
  const globals = readSource("app/globals.css");
  const navbar = readSource("components/layout/Navbar.tsx");
  const section = readSource("components/ui/Section.tsx");
  const pageHeader = readSource("components/ui/PageHeader.tsx");
  const card = readSource("components/ui/Card.tsx");
  const container = readSource("components/ui/Container.tsx");
  const footer = readSource("components/layout/Footer.tsx");

  assert.match(globals, /@media \(min-width: 1024px\) and \(max-width: 1599\.98px\)/);
  for (const selector of [
    "site-navbar-row",
    "site-container",
    "site-section",
    "site-section-header",
    "site-page-header",
    "site-card",
    "site-footer-main",
  ]) assert.match(globals, new RegExp(`\\.${selector}`));

  assert.match(navbar, /site-navbar-row/);
  assert.match(section, /site-section[\s\S]*site-section-header/);
  assert.match(pageHeader, /site-page-header/);
  assert.match(card, /site-card/);
  assert.match(container, /site-container/);
  assert.match(footer, /site-footer-main[\s\S]*site-footer-legal[\s\S]*site-footer-meta/);
  assert.doesNotMatch(globals, /(?:^|[;{]\s*)zoom\s*:/m);
  assert.doesNotMatch(globals, /transform\s*:\s*scale\(/);
});

test("Energy Lab uses breathable responsive surfaces without viewport-fit tricks", () => {
  const energyPage = readSource("app/calculators/calorie/page.tsx");
  const energyWizard = readSource("components/energy-lab/EnergyLabExperience.tsx");

  assert.match(energyPage, /sm:py-8 lg:py-5/);
  assert.match(energyPage, /text-\[var\(--type-page-title-size\)\]/);
  assert.match(
    energyWizard,
    /py-\[var\(--space-section-compact\)\][\s\S]*?lg:py-8/,
  );
  assert.match(
    energyWizard,
    /p-\[var\(--space-panel-compact\)\] sm:p-\[var\(--space-panel\)\]/,
  );
  assert.match(energyWizard, /mt-7 grid gap-5 sm:grid-cols-2/);
  assert.match(energyWizard, /lg:mt-1\.5 lg:min-h-13/);
  assert.match(energyWizard, /grid grid-cols-3 gap-2 sm:gap-4/);
  assert.match(energyWizard, /calculator-choice flex min-h-24 w-full/);
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
