import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import sitemap from "../app/sitemap";
import {
  ENERGY_LAB_HANDOFF_KEY,
  readEnergyLabHandoff,
  writeEnergyLabHandoff,
  type StorageLike,
} from "../lib/energy-lab";
import { ENERGY_LAB_PATH } from "../lib/routes";

function readSource(relativePath: string): string {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

const ENERGY_LAB_ENTRYPOINTS = [
  "components/layout/Navbar.tsx",
  "components/home/HeroSection.tsx",
  "components/home/FinalCTA.tsx",
  "components/home/ToolsShowcase.tsx",
  "app/about/page.tsx",
  "app/movements/page.tsx",
  "app/calculators/page.tsx",
  "app/calculators/calorie/layout.tsx",
  "app/analysis/page.tsx",
  "components/energy-lab/EnergyLabLegacyRedirect.tsx",
] as const;

test("Energy Lab has one canonical route and every public entry point consumes it", () => {
  assert.equal(ENERGY_LAB_PATH, "/calculators/calorie");

  for (const relativePath of ENERGY_LAB_ENTRYPOINTS) {
    const source = readSource(relativePath);
    assert.match(
      source,
      /\bENERGY_LAB_PATH\b/,
      `${relativePath} must consume the canonical ENERGY_LAB_PATH constant.`,
    );
    assert.doesNotMatch(
      source,
      /(?:href\s*=\s*|href\s*:\s*)["']\/analysis["']/,
      `${relativePath} must not link users to the legacy analysis route.`,
    );
  }
});

test("sitemap lists the canonical Energy Lab route once and omits /analysis", () => {
  const paths = sitemap().map(({ url }) => {
    const pathname = new URL(url).pathname;
    return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  });

  assert.equal(paths.filter((path) => path === ENERGY_LAB_PATH).length, 1);
  assert.equal(paths.includes("/analysis"), false);
});

test("the Energy Lab implementation contains no legacy RMR × PAL multiplier engine", () => {
  const implementation = [
    "lib/energy-lab/engine.ts",
    "lib/energy-lab/types.ts",
    "lib/calculators/calorie.ts",
  ]
    .map(readSource)
    .join("\n");

  assert.doesNotMatch(implementation, /\bactivityMultipliers\b/i);
  assert.doesNotMatch(implementation, /\b(?:1\.2|1\.375|1\.55|1\.725|1\.9)\b/);
  assert.doesNotMatch(
    implementation,
    /\b(?:bmr|rmr)\s*\*\s*(?:activity|pal)/i,
  );
  assert.match(readSource("lib/calculators/calorie.ts"), /\bevaluateEnergyLab\b/);
});

test("macro handoff keeps required planning fields and strips sensitive health keys", () => {
  const storage = new MemoryStorage();
  type HandoffInput = Parameters<typeof writeEnergyLabHandoff>[1];
  const inputWithUnexpectedHealthData = {
    rawTargetKcal: 2473.25,
    displayTargetKcal: 2450,
    goal: "lose",
    weightKg: 72,
    activityProfile: "lowActive",
    safetyFlags: ["pregnancyOrBreastfeeding"],
    pregnancyOrBreastfeeding: true,
    eatingDisorderOrRedsRisk: true,
    medicalOrMedicationContext: true,
    cycleNote: "sensitive",
    note: "sensitive",
  } as unknown as HandoffInput;

  writeEnergyLabHandoff(storage, inputWithUnexpectedHealthData);
  const rawPayload = storage.getItem(ENERGY_LAB_HANDOFF_KEY);
  assert.ok(rawPayload);
  const payload = JSON.parse(rawPayload) as Record<string, unknown>;

  assert.deepEqual(Object.keys(payload).sort(), [
    "activityProfile",
    "createdAt",
    "displayTargetKcal",
    "goal",
    "rawTargetKcal",
    "version",
    "weightKg",
  ]);

  for (const sensitiveKey of [
    "age",
    "heightCm",
    "sex",
    "bmi",
    "safetyFlags",
    "pregnancyOrBreastfeeding",
    "eatingDisorderOrRedsRisk",
    "medicalOrMedicationContext",
    "extremeAthleteContext",
    "cycleNote",
    "note",
    "calibrationEntries",
  ]) {
    assert.equal(
      Object.hasOwn(payload, sensitiveKey),
      false,
      `${sensitiveKey} must not be serialized in the macro handoff.`,
    );
  }

  storage.setItem(
    ENERGY_LAB_HANDOFF_KEY,
    JSON.stringify({ ...payload, safetyFlags: ["eatingDisorderOrRedsRisk"] }),
  );
  const sanitizedRead = readEnergyLabHandoff(storage);
  assert.ok(sanitizedRead);
  assert.equal(Object.hasOwn(sanitizedRead, "safetyFlags"), false);
});

test("privacy, KVKK and local-storage policies describe device-only calibration", () => {
  const privacy = readSource("app/gizlilik-politikasi/page.tsx");
  const kvkk = readSource("app/kvkk-aydinlatma-metni/page.tsx");
  const localStoragePolicy = readSource(
    "app/cerez-ve-yerel-depolama-politikasi/page.tsx",
  );

  assert.match(privacy, /Ağırlık Trendi Kalibrasyonu/);
  assert.match(privacy, /localStorage veya sessionStorage alanına kaydedilmez/);
  assert.match(privacy, /sunucu kopyasını oluşturmaz/);

  assert.match(kvkk, /Cihaz içi Energy Lab kalibrasyon verileri/);
  assert.match(kvkk, /localStorage veya sessionStorage alanına kaydedilmez/);
  assert.match(kvkk, /Güvenlik ve kapsam yanıtları oturum sonrasında saklanmaz/);

  assert.match(localStoragePolicy, /Ağırlık Trendi Kalibrasyonu/);
  assert.match(localStoragePolicy, /yalnızca bu cihazdaki localStorage alanında saklar/);
  assert.match(localStoragePolicy, /analytics servisine gönderilmez/);
});

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}
