import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const proteinPage = readFileSync("app/calculators/protein/page.tsx", "utf8");
const waterPage = readFileSync("app/calculators/water/page.tsx", "utf8");

test("protein formu boş training, goal ve scopeRisk seçimiyle başlar", () => {
  assert.match(proteinPage, /trainingProfile: ""/);
  assert.match(proteinPage, /goal: ""/);
  assert.match(proteinPage, /scopeRisk: ""/);
  assert.match(proteinPage, /Hedef seçimi tek başına protein katsayısını değiştirmez/);
});

test("protein sayfası yaklaşık dilini ve kapsam sonuçlarını gösterir", () => {
  assert.match(proteinPage, /Yaklaşık/);
  assert.match(proteinPage, /Genel hesaplayıcının kapsamı dışında/);
  assert.match(proteinPage, /Bu hesaplayıcı yetişkinler için tasarlanmıştır/);
});

test("su sayfası toplam su terminolojisini ve boş başlangıç seçimini korur", () => {
  assert.match(waterPage, /title="Toplam Su Alımı Referansı"/);
  assert.match(waterPage, /Toplam Su Alımı Referansı \(AI\)/);
  assert.match(waterPage, /efsaAdultReferenceCategory: ""/);
  assert.doesNotMatch(waterPage, /30–35 ml\/kg/);
  assert.doesNotMatch(waterPage, /saf su içmelisiniz/);
});

test("su sonuç açıklaması toplam su kapsamını ve egzersiz güvenlik notunu gösterir", () => {
  assert.match(waterPage, /Yiyeceklerdeki suyu, içme suyunu ve diğer içeceklerden gelen suyu birlikte kapsar/);
  assert.match(waterPage, /Uzun süreli veya yüksek terlemeli egzersizde/);
  assert.match(waterPage, /Aşırı sıvı tüketimi de riskli olabilir/);
});
