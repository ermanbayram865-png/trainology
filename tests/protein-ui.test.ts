import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const proteinPage = readFileSync("app/calculators/protein/page.tsx", "utf8");
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
});

test("protein sonucu tek referans, başlangıç ve gerçek aralık yapılarını destekler", () => {
  assert.match(proteinPage, /SINGLE_REFERENCE/);
  assert.match(proteinPage, /PRACTICAL_RANGE/);
  assert.match(proteinPage, /ANCHOR_AND_RANGE/);
  assert.match(proteinPage, /Günlük Protein Referansın/);
  assert.match(proteinPage, /Araç, aralık içinde sana özel bir nokta seçmez/);
  assert.match(proteinPage, /resultHeadingRef/);
  assert.doesNotMatch(proteinPage, /donut|progress-ring|optimal zone/i);
});

test("protein düzenleme aksiyonu form değerlerini resetlemeden korur", () => {
  assert.match(proteinPage, /onEdit=\{\(\) => setResult\(null\)\}/);
  assert.doesNotMatch(proteinPage, /onEdit=[\s\S]*setForm\(initialForm\)/);
  assert.match(sharedUi, /Referansı Düzenle/);
});
