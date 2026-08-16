import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../app/calculators/macro/page.tsx", import.meta.url),
  "utf8",
);

test("Makro Profili gerçek motor sonucunu erişilebilir bir grafikle sunar", () => {
  assert.match(source, /calculateMacroDistribution\s*\(/);
  assert.match(source, /role="img"/);
  assert.match(source, /aria-label=\{chartLabel\}/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /result\.proteinPercentage/);
  assert.match(source, /result\.carbohydratePercentage/);
  assert.match(source, /result\.fatPercentage/);
  assert.doesNotMatch(source, /112 g|306 g|80 g/);
});

test("premium form etiket, hata ve klavye odağı sözleşmelerini korur", () => {
  assert.match(source, /<fieldset[\s\S]+?<legend/);
  assert.match(source, /aria-describedby/);
  assert.match(source, /role="alert"/);
  assert.match(source, /focus-within:ring-2/);
  assert.match(source, /focus:ring-2/);
  assert.match(source, /document\.querySelector<HTMLElement>\(selector\)\?\.focus\(\)/);

  const weightPosition = source.indexOf('id="macro-weight"');
  const caloriePosition = source.indexOf('id="macro-calories"');
  const goalPosition = source.indexOf("macro-goal-helper");
  const activityPosition = source.indexOf('id="macro-activityLevel"');

  assert.ok(weightPosition >= 0);
  assert.ok(caloriePosition > weightPosition);
  assert.ok(goalPosition > caloriePosition);
  assert.ok(activityPosition > goalPosition);
  assert.doesNotMatch(source, /title="Enerji hedefin"/);
});

test("Makro Profili yalnız masaüstü iki sütun eşiğinde sticky olur", () => {
  assert.match(source, /xl:grid-cols/);
  assert.match(source, /xl:sticky xl:top-24/);
  assert.match(source, /xl:max-h-\[calc\(100dvh-7rem\)\] xl:overflow-y-auto/);
  assert.doesNotMatch(source, /(?:^|\s)(?:sm|md|lg):sticky/);
  assert.match(source, /min-w-0/);
  assert.match(source, /aspect-square w-full max-w-60/);
  assert.doesNotMatch(source, /(?:size-60|sm:size-64)/);
});

test("Makro aracı iç içe krem kabuk ve masaüstünde tek kolonlu sonuç kullanmaz", () => {
  assert.doesNotMatch(source, /bg-\[#f4f1e9\]/);
  assert.doesNotMatch(source, /xl:grid-cols-1/);
  assert.doesNotMatch(source, /Kısa plan|number="0[1-4]"/);
  assert.match(source, /bg-\[#0c1924\]/);
  assert.match(source, /bg-\[#071827\]/);
  assert.match(source, /sectionClassName="!py-14 sm:!py-16 lg:!py-20"/);
  assert.match(source, /contentClassName="space-y-12"/);
});

test("Makro Planlayıcı bağımsız ve geçici form durumunu korur", () => {
  assert.match(source, /calories:\s*""/);
  assert.match(source, /weight:\s*""/);
  assert.doesNotMatch(
    source,
    /EnergyLab|handoff|localStorage|sessionStorage|URLSearchParams|fetch\s*\(/i,
  );
});
