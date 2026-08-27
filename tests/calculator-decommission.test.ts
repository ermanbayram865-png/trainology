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
  "Su & Hidrasyon",
  "Yağsız Kütle İndeksi (FFMI) Analizi",
  "Vücut Kitle İndeksi (BMI) ve Ağırlık Aralığı",
] as const;

const removedRoutes = [
  "/calculators/1rm",
  "/calculators/training-load",
  "/calculators/performance",
] as const;

test("calculator registry yalnız kalan altı ürünü 3 × 2 desktop grid içinde gösterir", () => {
  const calculatorsPage = readSource("app/calculators/page.tsx");
  const registeredHrefs = calculatorsPage.match(
    /\bhref:\s*(?:ENERGY_LAB_PATH|"\/calculators\/[^"]+")/g,
  ) ?? [];

  assert.equal(registeredHrefs.length, 6);
  assert.match(calculatorsPage, /grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3/);
  for (const title of retainedCalculatorTitles) {
    assert.match(calculatorsPage, new RegExp(`title: "${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  }

  assert.doesNotMatch(calculatorsPage, /1 Tekrar Maksimumu \(1RM\) Hesaplayıcı/);
  assert.doesNotMatch(calculatorsPage, /Kuvvet Performansı|%1RM|\/calculators\/(?:1rm|training-load|performance)/);
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
    "features/performance-analysis/PerformanceAnalysis.tsx",
    "components/performance/ExerciseInput.tsx",
    "components/performance/PerformanceDashboard.tsx",
    "lib/performance/constants.ts",
    "lib/performance/index.ts",
    "types/performance/index.ts",
  ]) {
    assert.equal(existsSync(sourcePath(relativePath)), false, `${relativePath} must not exist.`);
  }

  const calculatorBarrel = readSource("lib/calculators/index.ts");
  assert.doesNotMatch(calculatorBarrel, /one-rep-max|training-load/);
});

test("sitemap yalnız kalan altı calculator route'unu içerir", () => {
  const calculatorPaths = sitemap()
    .map(({ url }) => new URL(url).pathname.replace(/\/+$/, ""))
    .filter((path) => path.startsWith("/calculators/") && path !== "/calculators");

  assert.equal(calculatorPaths.length, 6);
  for (const removedRoute of removedRoutes) {
    assert.equal(calculatorPaths.includes(removedRoute), false);
  }
});

test("ana sayfa ve Hakkımızda kaldırılan Performance ürününü tanıtmaz", () => {
  const homeTools = readSource("components/home/ToolsShowcase.tsx");
  const about = readSource("app/about/page.tsx");

  assert.doesNotMatch(homeTools, /Kuvvet Performansı|\/calculators\/performance|\b1RM\b/);
  assert.doesNotMatch(about, /\b1RM\b|performans analizleri/i);
});
