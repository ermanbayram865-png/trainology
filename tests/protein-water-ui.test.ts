import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const proteinPage = readFileSync("app/calculators/protein/page.tsx", "utf8");
const waterPage = readFileSync("app/calculators/water/page.tsx", "utf8");
const hydration = readFileSync("components/hydration/HydrationExperience.tsx", "utf8");
const sharedUi = readFileSync("components/calculators/ReferenceToolUI.tsx", "utf8");
const calculatorsPage = readFileSync("app/calculators/page.tsx", "utf8");

test("protein vNext doğru ürün adı ve gerçek algoritmik girdilerle açılır", () => {
  assert.match(proteinPage, /title="Günlük Protein Referansı"/);
  assert.match(proteinPage, /ageGroup: ""/);
  assert.match(proteinPage, /heightCm: ""/);
  assert.match(proteinPage, /weightKg: ""/);
  assert.match(proteinPage, /goal: ""/);
  assert.match(proteinPage, /trainingProfile: ""/);
  assert.match(proteinPage, /Protein Referansımı Hesapla/);
  assert.match(calculatorsPage, /title: "Günlük Protein Referansı"/);
  assert.doesNotMatch(proteinPage, /title="Protein İhtiyacı"|ageYears|scopeRisk/);
});

test("protein selection card, safety disclosure ve form-result dönüşümünü kullanır", () => {
  assert.match(proteinPage, /<SelectionCards/);
  assert.match(proteinPage, /<ScopeConfirmation/);
  assert.match(proteinPage, /result === null \? \(/);
  assert.match(proteinPage, /<ProteinResultView/);
  assert.match(proteinPage, /<BlockedProteinResult/);
  assert.doesNotMatch(proteinPage, /Bilgilerini girdikten sonra|Protein Sonucun.*min-h-full/);
});

test("protein sonucu tek referans, başlangıç ve gerçek aralık yapılarını destekler", () => {
  assert.match(proteinPage, /SINGLE_REFERENCE/);
  assert.match(proteinPage, /PRACTICAL_RANGE/);
  assert.match(proteinPage, /ANCHOR_AND_RANGE/);
  assert.match(proteinPage, /Günlük Protein Referansın/);
  assert.match(proteinPage, /Pratik aralık/);
  assert.match(proteinPage, /Hesaplama ağırlığı/);
  assert.doesNotMatch(proteinPage, /donut|progress-ring|optimal zone/i);
});

test("protein düzenleme aksiyonu form değerlerini resetlemeden korur", () => {
  assert.match(proteinPage, /onEdit=\{\(\) => setResult\(null\)\}/);
  assert.doesNotMatch(proteinPage, /onEdit=[\s\S]*setForm\(initialForm\)/);
  assert.match(sharedUi, /Referansı Düzenle/);
});

test("Su ve Hidrasyon doğru ürün adı ve semantic ana tablarla açılır", () => {
  assert.match(waterPage, /title="Su & Hidrasyon"/);
  assert.match(hydration, /useState<MainMode>\("daily"\)/);
  assert.match(hydration, /role="tablist"/);
  assert.match(hydration, /role="tab"/);
  assert.match(hydration, /aria-selected=\{selected\}/);
  assert.match(hydration, /Günlük Referans/);
  assert.match(hydration, /Egzersiz Hidrasyonu/);
});

test("günlük referans sayısal yaş olmadan iki kategori ve compact safety kullanır", () => {
  assert.match(hydration, /adultConfirmed: false/);
  assert.match(hydration, /Standart yetişkin kapsamındayım \(18\+\)/);
  assert.match(hydration, /adultConfirmed: checked, standardAdultScope: checked/);
  assert.match(hydration, /!form\.standardAdultScope/);
  assert.match(hydration, /Kadın Referansı/);
  assert.match(hydration, /Erkek Referansı/);
  assert.match(hydration, /columns=\{2\}/);
  assert.match(hydration, /<ScopeConfirmation/);
  assert.match(hydration, /Su Referansımı Göster/);
  assert.doesNotMatch(hydration, /ageYears|30–35 mL\/kg/);
  assert.match(sharedUi, /type="radio"/);
  assert.match(sharedUi, /type="checkbox"/);
  assert.match(sharedUi, /<details/);
  assert.match(sharedUi, /focus-visible:ring-2/);
});

test("su sonucu canonical litre ve mL değerini total-water bağlamıyla gösterir", () => {
  assert.match(hydration, /result\.millilitersPerDay/);
  assert.match(hydration, /L \/ gün/);
  assert.match(hydration, /mL \/ gün/);
  assert.match(hydration, /İçme suyu, diğer içecekler ve besinlerden gelen su dahil/);
  assert.match(hydration, /Egzersizdeki kişisel ter kaybını/);
  assert.doesNotMatch(hydration, /Toplam Su Alımı Referansı \(AI\)/);
});

test("su form-result dönüşümü ve değer koruyan edit aksiyonu kullanır", () => {
  assert.match(hydration, /result\?\.type === "TOTAL_WATER_REFERENCE"/);
  assert.match(hydration, /<BlockedResult/);
  assert.match(hydration, /<EditReferenceButton onClick=\{\(\) => setResult\(null\)\}/);
  assert.match(hydration, /Egzersiz Hidrasyonuna Geç/);
  assert.match(hydration, /\{categoryLabel\} · EFSA yetişkin toplam su referansı/);
  assert.doesNotMatch(hydration, /Bilgilerini girdikten sonra yetişkin referansı/);
});

test("hızlı rehber slider ve yalnız bağlamsal sonuçlar kullanır", () => {
  assert.match(hydration, /type="range"/);
  assert.match(hydration, /Hızlı Hidrasyon Rehberi/);
  assert.match(hydration, /environmentOptions/);
  assert.match(hydration, /sweatOptions/);
  assert.match(hydration, /durationGuidance/);
  assert.match(hydration, /aria-label="Rehber bağlamı"/);
  assert.match(hydration, /Bu rehber nasıl çalışıyor\?/);
  assert.match(hydration, /<ContextChip>/);
  assert.match(hydration, /Terleme Hızımı Ölç/);
  assert.doesNotMatch(hydration, /<GuideCard title="Süre"|<GuideCard title="Ortam"|<GuideCard title="Terleme"/);
  assert.doesNotMatch(hydration, /hidrasyon skoru|hydrationScore|\+500 mL/i);
});

test("terleme ölçümü tüm canonical girdileri, sonuçları ve aksiyonları gösterir", () => {
  for (const token of [
    "preWeightKg",
    "postWeightKg",
    "fluidConsumedMl",
    "durationMinutes",
    "urinationStatus",
    "urineMl",
    "exerciseType",
    "environment",
  ]) assert.match(hydration, new RegExp(token));
  assert.match(hydration, /Terleme Hızın/);
  assert.match(hydration, /Tahmini seans ter kaybı/);
  assert.match(hydration, /Ölçüm bağlamı/);
  assert.match(hydration, /Nasıl yorumlamalısın\?/);
  assert.match(hydration, /Elektrolitler ne olacak\?/);
  assert.match(hydration, /Değerleri Düzenle/);
  assert.match(hydration, /Yeni Ölçüm Yap/);
  assert.match(hydration, /items-baseline/);
  assert.match(hydration, /sm:grid-cols-\[1\.15fr_0\.85fr\]/);
  assert.match(hydration, /lg:grid-cols-\[0\.85fr_2\.15fr\]/);
});

test("Protein ve Su düşük-height desktop viewport contract taşır ve ölçek hilesi kullanmaz", () => {
  for (const source of [proteinPage, waterPage, hydration, sharedUi]) {
    assert.match(source, /max-height:850px/);
    assert.doesNotMatch(source, /zoom:|transform:\s*scale/);
  }
  assert.match(sharedUi, /min-h-11/);
  assert.doesNotMatch(`${proteinPage}\n${waterPage}`, /overflow-hidden/);
});

test("metodoloji ana sonucu boğmadan erişilebilir disclosure içinde kalır", () => {
  assert.match(sharedUi, /Nasıl hesaplandı\?/);
  assert.match(proteinPage, /<MethodologyDisclosure>/);
  assert.match(hydration, /<MethodologyDisclosure>/);
  assert.match(proteinPage, /EFSA NDA \(2012\)/);
  assert.match(hydration, /EFSA NDA \(2010\)/);
});

test("hidrasyon aracı hiçbir sonuç veya ölçümü kalıcı saklamaz", () => {
  assert.doesNotMatch(hydration, /localStorage|sessionStorage|document\.cookie|indexedDB|saveMeasurement|history/i);
  assert.doesNotMatch(hydration, /günlük referans[\s\S]*\+[\s\S]*ter kaybı|litersPerDay\s*\+\s*estimatedSweatLoss/);
});
