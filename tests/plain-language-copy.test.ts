import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readSource(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

const energyExperience = readSource("components/energy-lab/EnergyLabExperience.tsx");
const energyMethodology = readSource("components/energy-lab/EnergyLabMethodology.tsx");
const energySources = readSource("lib/energy-lab/sources.ts");
const ffmiExperience = readSource("components/ffmi/FFMIExperience.tsx");
const ffmiComparator = readSource("components/ffmi/FFMIReferenceComparator.tsx");
const macroPage = readSource("app/calculators/macro/page.tsx");
const proteinPage = readSource("app/calculators/protein/page.tsx");

test("Energy public copy uses plain daily-energy terminology without internal governance labels", () => {
  const publicEnergyCopy = `${energyExperience}\n${energyMethodology}\n${energySources}`;

  assert.match(publicEnergyCopy, /günlük enerji ihtiyacı/i);
  assert.doesNotMatch(publicEnergyCopy, /Energy Lab motoru|komşu profil/i);
  assert.doesNotMatch(
    publicEnergyCopy,
    /Bilimsel olarak kilitli|Koruyucu ürün kuralı|ürün içi koruyucu|Kaynak → ürün kararı izlenebilirliği/i,
  );
});

test("calculator UI copy removes developer validation language and unnecessary English terms", () => {
  const calculatorCopy = [
    readSource("lib/calculators/macro.ts"),
    readSource("lib/calculators/protein.ts"),
    macroPage,
    proteinPage,
  ].join("\n");

  assert.doesNotMatch(calculatorCopy, /pozitif ve sonlu|negatif olmayan sonlu/i);
  assert.doesNotMatch(macroPage, /physique yarışma hazırlığı/i);
  assert.doesNotMatch(proteinPage, /hipertrofi/i);
});

test("FFMI keeps internal enum names but presents measurement and percentile copy in Turkish", () => {
  assert.match(ffmiExperience, /deri kıvrımı ölçümü veya görsel tahmin/i);
  assert.doesNotMatch(ffmiExperience, /skinfold veya görsel tahmin/i);
  assert.match(ffmiComparator, /yüzdelik dilimler tahmin edilmez/i);
  assert.doesNotMatch(ffmiComparator, /percentile tahmini/i);
});

test("public product descriptions match the active four-calculator suite", () => {
  const publicProductCopy = [
    readSource("app/layout.tsx"),
    readSource("app/calculators/layout.tsx"),
    readSource("app/calculators/page.tsx"),
    readSource("components/home/ToolsShowcase.tsx"),
    readSource("components/home/TrustSection.tsx"),
    readSource("components/home/ValueProposition.tsx"),
  ].join("\n");

  assert.doesNotMatch(publicProductCopy, /performans analizi|performans analizleri/i);
  assert.doesNotMatch(publicProductCopy, /bakım enerjisi|bakım enerjin/i);
  assert.doesNotMatch(publicProductCopy, /\/calculators\/water|Günlük Su Alımı Rehberi|Su & Hidrasyon/);
  for (const term of ["enerji", "makro", "protein", "vücut"]) {
    assert.match(publicProductCopy, new RegExp(term, "i"));
  }
});
