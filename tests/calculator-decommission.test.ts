import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import sitemap from "../app/sitemap";

function readSource(relativePath: string): string {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

function sourcePath(relativePath: string): URL {
  return new URL(`../${relativePath}`, import.meta.url);
}

const retainedCalculatorTitles = [
  "Kalori Hedefi Simülatörü / Energy Lab",
  "Makro Planlayıcı",
  "Günlük Protein Referansı",
  "Yağsız Kütle İndeksi (FFMI) Analizi",
] as const;

const removedRoutes = [
  "/calculators/healthy-weight",
  "/calculators/1rm",
  "/calculators/training-load",
  "/calculators/performance",
  "/calculators/water",
] as const;

test("calculator registry final dört ürünlük suite'i gösterir", () => {
  const calculatorsPage = readSource("app/calculators/page.tsx");
  const registeredHrefs = calculatorsPage.match(
    /\bhref:\s*(?:ENERGY_LAB_PATH|"\/calculators\/[^"]+")/g,
  ) ?? [];

  assert.equal(registeredHrefs.length, 4);
  assert.match(calculatorsPage, /grid grid-cols-1 gap-3 sm:grid-cols-2/);
  for (const title of retainedCalculatorTitles) {
    assert.match(calculatorsPage, new RegExp(`title: "${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  }

  assert.doesNotMatch(calculatorsPage, /1 Tekrar Maksimumu \(1RM\) Hesaplayıcı/);
  assert.doesNotMatch(
    calculatorsPage,
    /BMI Referans Ağırlık Aralığı|Kuvvet Performansı|%1RM|Günlük Su Alımı Rehberi|\/calculators\/(?:healthy-weight|1rm|training-load|performance|water)/,
  );
});

test("decommission edilen route, feature, component, motor ve type dosyaları yoktur", () => {
  for (const relativePath of [
    "app/calculators/1rm/page.tsx",
    "app/calculators/1rm/layout.tsx",
    "app/calculators/training-load/page.tsx",
    "app/calculators/training-load/layout.tsx",
    "lib/calculators/one-rep-max.ts",
    "lib/calculators/training-load.ts",
    "app/calculators/performance/page.tsx",
    "app/calculators/healthy-weight/page.tsx",
    "app/calculators/healthy-weight/layout.tsx",
    "app/calculators/water/page.tsx",
    "app/calculators/water/layout.tsx",
    "lib/calculators/bmi.ts",
    "lib/calculators/healthy-weight.ts",
    "lib/calculators/water.ts",
    "lib/calculators/hydration.ts",
    "tests/healthy-weight.test.ts",
    "tests/healthy-weight-ui.test.ts",
    "features/performance-analysis/PerformanceAnalysis.tsx",
    "components/performance/ExerciseInput.tsx",
    "components/performance/PerformanceDashboard.tsx",
    "components/hydration/HydrationExperience.tsx",
    "components/hydration/WaterGuideExperience.tsx",
    "lib/performance/constants.ts",
    "lib/performance/index.ts",
    "types/performance/index.ts",
  ]) {
    assert.equal(existsSync(sourcePath(relativePath)), false, `${relativePath} must not exist.`);
  }

  const calculatorBarrel = readSource("lib/calculators/index.ts");
  assert.doesNotMatch(calculatorBarrel, /(?:\.\/bmi|\.\/water|\.\/hydration|healthy-weight|one-rep-max|training-load)/);
});

test("sitemap yalnız final dört calculator route'unu içerir", () => {
  const calculatorPaths = sitemap()
    .map(({ url }) => new URL(url).pathname.replace(/\/+$/, ""))
    .filter((path) => path.startsWith("/calculators/") && path !== "/calculators");

  assert.deepEqual([...calculatorPaths].sort(), [
    "/calculators/calorie",
    "/calculators/ffmi",
    "/calculators/macro",
    "/calculators/protein",
  ]);
  for (const removedRoute of removedRoutes) {
    assert.equal(calculatorPaths.includes(removedRoute), false);
  }
});

test("public surfaces kaldırılan BMI, Performance ve Water ürünlerini tanıtmaz", () => {
  const homeTools = readSource("components/home/ToolsShowcase.tsx");
  const about = readSource("app/about/page.tsx");
  const calculators = readSource("app/calculators/page.tsx");
  const publicSurfaces = [
    homeTools,
    about,
    calculators,
    readSource("components/home/ValueProposition.tsx"),
    readSource("app/layout.tsx"),
    readSource("app/calculators/layout.tsx"),
  ].join("\n");

  assert.doesNotMatch(
    publicSurfaces,
    /BMI Referans Ağırlık Aralığı|\/calculators\/healthy-weight|Kuvvet Performansı|\/calculators\/performance|\b1RM\b|Günlük Su Alımı Rehberi|Su & Hidrasyon|\/calculators\/water/,
  );
  assert.doesNotMatch(about, /\b1RM\b|performans analizleri/i);
  assert.doesNotMatch(about, /\bBMI\b/);
  assert.doesNotMatch(publicSurfaces, /enerji, makro, protein, su|protein, makro, su/i);
});
