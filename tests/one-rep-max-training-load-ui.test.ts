import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const oneRepMaxPage = readFileSync("app/calculators/1rm/page.tsx", "utf8");
const oneRepMaxLayout = readFileSync("app/calculators/1rm/layout.tsx", "utf8");
const trainingLoadPage = readFileSync("app/calculators/training-load/page.tsx", "utf8");
const trainingLoadLayout = readFileSync("app/calculators/training-load/layout.tsx", "utf8");
const calculatorsPage = readFileSync("app/calculators/page.tsx", "utf8");
const sitemap = readFileSync("app/sitemap.ts", "utf8");
const oneRepMaxEngine = readFileSync("lib/calculators/one-rep-max.ts", "utf8");
const trainingLoadEngine = readFileSync("lib/calculators/training-load.ts", "utf8");

test("1RM formu boş ağırlık ve tekrar alanlarıyla başlar", () => {
  assert.match(oneRepMaxPage, /weight: ""/);
  assert.match(oneRepMaxPage, /repetitions: ""/);
  assert.match(oneRepMaxPage, /max: 10/);
  assert.match(oneRepMaxPage, /step: 1/);
});

test("1RM UI tahmin, güvenlik ve Lombardi metodolojisini açıklar", () => {
  assert.match(oneRepMaxPage, /Tahmini 1RM/);
  assert.match(oneRepMaxPage, /Lombardi/);
  assert.match(oneRepMaxPage, /evrensel olarak en\s+doğru formül olduğu iddia edilmez/);
  assert.match(oneRepMaxPage, /maksimal deneme yapman gerektiği anlamına gelmez/);
  assert.match(oneRepMaxPage, /aria-live="polite"/);
});

test("%1RM UI boş başlar, hazır seçenek ve erişilebilir özel yüzde girişi sunar", () => {
  assert.match(trainingLoadPage, /oneRepMax: ""/);
  assert.match(trainingLoadPage, /percentage: ""/);
  assert.match(trainingLoadPage, /step: 0\.5/);
  assert.match(trainingLoadPage, /presetPercentages/);
  assert.match(trainingLoadPage, /aria-pressed/);
  assert.match(trainingLoadPage, /aria-live="polite"/);
});

test("%1RM UI kesin tekrar garantisi veya program reçetesi vermez", () => {
  assert.match(trainingLoadPage, /Bu araç tekrar sayısı reçetesi vermez/);
  assert.match(trainingLoadEngine, /kişiden kişiye ve egzersize göre değişebilir/);
  assert.doesNotMatch(`${trainingLoadPage}\n${trainingLoadEngine}`, /%75\s*=\s*10 tekrar/);
  assert.doesNotMatch(`${trainingLoadPage}\n${trainingLoadEngine}`, /%80 ile 8 tekrar/);
  assert.match(oneRepMaxEngine, /Bu sonuç bir tahmindir/);
});

test("iki hesaplayıcı birbirine parametresiz bağlantı verir", () => {
  assert.match(oneRepMaxPage, /href="\/calculators\/training-load"/);
  assert.match(trainingLoadPage, /href="\/calculators\/1rm"/);
  assert.doesNotMatch(`${oneRepMaxPage}\n${trainingLoadPage}`, /localStorage|URLSearchParams|\?oneRepMax/i);
});

test("iki form da input değişince eski sonucu temizler", () => {
  for (const page of [oneRepMaxPage, trainingLoadPage]) {
    assert.match(
      page,
      /function handleFieldChange\([\s\S]*?setResult\(null\);[\s\S]*?\n  }/,
    );
  }
});

test("yeni hesaplayıcı kartı, sitemap ve sosyal metadata kayıtlıdır", () => {
  assert.match(calculatorsPage, /title: "%1RM Antrenman Yükü"/);
  assert.match(calculatorsPage, /category: "Performans"/);
  assert.match(calculatorsPage, /href: "\/calculators\/training-load"/);
  assert.match(sitemap, /"\/calculators\/training-load"/);
  assert.match(trainingLoadLayout, /alternates: \{ canonical: "\/calculators\/training-load" \}/);
  assert.match(trainingLoadLayout, /openGraph:/);
  assert.match(trainingLoadLayout, /twitter:/);
  assert.match(oneRepMaxLayout, /alternates: \{ canonical: "\/calculators\/1rm" \}/);
  assert.match(oneRepMaxLayout, /openGraph:/);
});
