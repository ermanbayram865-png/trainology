import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../components/energy-lab/EnergyLabExperience.tsx", import.meta.url),
  "utf8",
);
const page = readFileSync(
  new URL("../app/calculators/calorie/page.tsx", import.meta.url),
  "utf8",
);
const engine = readFileSync(
  new URL("../lib/energy-lab/engine.ts", import.meta.url),
  "utf8",
);
const methodology = readFileSync(
  new URL("../components/energy-lab/EnergyLabMethodology.tsx", import.meta.url),
  "utf8",
);

test("Energy Lab presents the required three-step wizard and guarded navigation", () => {
  assert.match(source, /type WizardStep = 1 \| 2 \| 3/);
  assert.match(source, /validateBasics\(form\)/);
  assert.match(source, /validateActivity\(form\)/);
  assert.match(source, /step === 3 \? "Hedefimi Hesapla" : "Devam Et"/);
  assert.match(source, /changeStep\(step === 3 \? 2 : 1\)/);
  assert.match(source, /aria-current=\{active \? "step" : undefined\}/);
  assert.match(source, /String\(index \+ 1\)\.padStart\(2, "0"\)/);
  assert.match(source, /active[\s\S]*?border-\[#9f7b38\][\s\S]*?complete[\s\S]*?border-\[#102536\]/);
});

test("Energy Lab removes unused personalization and performance-priority inputs", () => {
  assert.doesNotMatch(source, /workStyle|trainingDays|trainingMinutes|dailySteps|nasemLabel/);
  assert.doesNotMatch(source, /performancePriority|Performans önceliğim var/);
  assert.match(source, /generalScope/);
});

test("adult age scope is aligned in the UI and engine-facing validation", () => {
  assert.match(source, /id="age"[\s\S]*?min=\{19\}/);
  assert.match(source, /age < 19 \|\| age > 120/);
  assert.match(source, /Bu hesaplama 19 yaş ve üzeri yetişkinler içindir\./);
  assert.doesNotMatch(source, /Energy Lab motoru/);
  assert.doesNotMatch(source, /age < 13|min=\{13\}/);
});

test("primary form uses concise sex and scope copy without detailed safety or privacy lists", () => {
  assert.match(source, />Cinsiyet<\/legend>/);
  assert.match(
    source,
    /Enerji hesaplamasında kullanılan denklemin katsayısı için gereklidir\./,
  );
  assert.doesNotMatch(source, /Biyolojik cinsiyet|NASEM ve Mifflin denklemlerindeki/);
  assert.match(
    source,
    /Hamilelik\/emzirme, özel tıbbi durumlar veya yarışma hazırlığı gibi durumlarda[\s\S]*?bu genel hesaplama uygun olmayabilir\./,
  );
  assert.match(source, /Genel yetişkin kapsamındayım\./);
  assert.doesNotMatch(source, /RED-S|yeme bozukluğu|ilaç kullanımı/);
  assert.doesNotMatch(source, /Yanıtın kaydedilmez veya sunucuya gönderilmez/);
});

test("Activity Finder uses only existing profiles and adjacent two-profile selection", () => {
  const activityStep = source.slice(
    source.indexOf("function ActivityStep"),
    source.indexOf("function GoalStep"),
  );
  for (const profile of ["inactive", "lowActive", "active", "veryActive"]) {
    assert.match(source, new RegExp(`value: "${profile}"`));
  }
  assert.match(source, /Math\.abs\(currentIndex - nextIndex\) === 1/);
  assert.doesNotMatch(activityStep, /istatistiksel güven aralığı/);
  assert.match(methodology, /istatistiksel güven aralığı değildir/);
  assert.match(source, /yan yana olan[\s\S]*?iki seçeneği işaretleyebilirsin/);
  assert.doesNotMatch(source, /komşu profil/);
  assert.doesNotMatch(source, /stepThreshold|trainingThreshold|automaticActivity/i);
  assert.match(source, /value: "inactive",[\s\S]*?title: "Az hareketli"/);
  assert.match(source, /value: "lowActive",[\s\S]*?title: "Biraz hareketli"/);
  assert.match(source, /value: "active",[\s\S]*?title: "Hareketli"/);
  assert.match(source, /value: "veryActive",[\s\S]*?title: "Çok hareketli"/);
});

test("goal options are progressive and retain the existing target engine", () => {
  assert.match(source, /useState<EnergyGoal \| "">\(""\)/);
  assert.match(source, /selected && option\.value === "lose"/);
  assert.match(source, /selected && option\.value === "gain"/);
  assert.match(source, /data-goal-card=\{option\.value\}/);
  assert.match(source, /data-goal-nested="gain"/);
  assert.match(source, /name="gainMode"/);
  assert.match(source, /Muhafazakâr başlangıç/);
  assert.match(source, /%10/);
  assert.match(source, /en fazla 500 kcal\/gün/);
  assert.doesNotMatch(source, /lossRate|%15|%20|750/);
  assert.match(source, /calculateTargetScenario\(/);
  assert.match(source, /evaluateEnergyLab\(/);
});

test("fat-loss source contract has one fixed rule and a raw low-output decision", () => {
  assert.match(engine, /requestedDeficitRaw = point\.rawKcal \* FAT_LOSS_STARTING_RATE/);
  assert.match(engine, /Math\.min\(requestedDeficitRaw, FAT_LOSS_DEFICIT_CAP_KCAL\)/);
  assert.match(engine, /point\.rawKcal <= FAT_LOSS_OUTPUT_BOUNDARY_KCAL/);
  assert.doesNotMatch(engine, /\b750\b|performancePriority|bmi < 25|bmi >= 25|DEFICIT_RATES/);
});

test("results preserve safety, hierarchy, estimation and RMR display contracts", () => {
  assert.match(source, /Sayısal hedef gösterilmiyor/);
  assert.match(source, /targetScenario\.status === "available"/);
  assert.match(source, /age <= 78/);
  assert.ok(
    source.indexOf("Tahmini günlük enerji ihtiyacın") <
      source.indexOf("Günlük kalori hedefin"),
  );
  assert.match(source, /Mevcut kilonu korumak için günlük yaklaşık enerji ihtiyacın\./);
  assert.match(source, /Günlük enerji ihtiyacından fark:/);
  assert.match(source, /Bu bir günlük kalori hedefi değildir\. Vücudunun dinlenirken kullandığı tahmini enerjidir\./);
  assert.doesNotMatch(source, /Tahmini bakım enerjin|Seçilen başlangıç hedefi/);
  assert.doesNotMatch(source, /Bakım çevresinde|bakım çevresinde|Bakıma göre görünür fark/);
  assert.match(source, /Bu değer ölçülmüş kesin enerji ihtiyacın değil/);
  assert.match(source, /kişisel metabolik değişkenlik/);
  assert.match(source, /kesin bir kişisel reçete veya haftalık kayıp vaadi değildir/);
  assert.match(source, /Kilonun birkaç haftalık eğilimi, antrenman performansı ve uygulamadaki uyum/);
  assert.match(source, /Günlük enerji ihtiyacı, RMR ile bir aktivite/);
  assert.match(source, /en yakın 50 kcal’ye yuvarlanır/);
  assert.doesNotMatch(source, /label="Vücut Kitle İndeksi \(BMI\)"/);
  assert.doesNotMatch(source, /kg\s*\/\s*hafta|haftada\s+[\d,.]+\s*kg/i);
  assert.doesNotMatch(source, /ideal|optimal|guaranteed/i);
});

test("premium visual hierarchy uses light forms, a tonal Navy result, and no gradients", () => {
  assert.match(source, /calculator-surface/);
  assert.match(source, /calculator-result[\s\S]*?energy-result-grid/);
  assert.match(source, /text-\[clamp\(3rem,9vw,5\.75rem\)\]/);
  assert.match(source, /<ResultInfoRow/);
  assert.match(source, /bg-white\/\[\.025\]/);
  assert.doesNotMatch(source, /linear-gradient|radial-gradient|conic-gradient/);
  assert.doesNotMatch(page, /linear-gradient|radial-gradient|conic-gradient/);
});

test("step and result transitions target sticky-header-safe focus anchors", () => {
  assert.match(source, /const activeStepRef = useRef<HTMLDivElement>/);
  assert.match(source, /const resultRef = useRef<HTMLDivElement>/);
  assert.match(source, /scrollIntoView\(/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /target\.focus\(\{ preventScroll: true \}\)/);
  assert.match(source, /ref=\{activeStepRef\}[\s\S]*?scroll-mt-28[\s\S]*?sm:scroll-mt-32/);
  assert.match(source, /ref=\{resultRef\}[\s\S]*?scroll-mt-28[\s\S]*?sm:scroll-mt-32/);
});

test("gain language is a starting scenario and makes no muscle-gain guarantee", () => {
  assert.match(source, /Kilo Artışı İçin Başla/);
  assert.match(source, /Kilo artışı yaklaşımı/);
  assert.match(source, /Kilomu korumaya yakın başla/);
  assert.match(source, /Günlük ihtiyacımın biraz üzerinde başla/);
  assert.doesNotMatch(source, /title: "Kas Kazan"|Kas Kazanımı ·/);
});

test("macro handoff transfers one exact scenario and requires a choice for two", () => {
  assert.match(source, /scenario\.points\.length === 1 \? 0 : null/);
  assert.match(source, /scenario\.points\.length === 2/);
  assert.match(source, /setSelectedPointIndex\(index\)/);
  assert.match(source, /calories=\$\{selectedPoint\.displayKcal\}/);
  assert.doesNotMatch(source, /displayMin \+ displayMax|\/ 2/);
});

test("page hero is compact and contains no Energy Lab 2.0 marketing panel", () => {
  assert.match(page, /Kalori Hedefi Simülatörü/);
  assert.match(page, /Günlük enerji ihtiyacın ve hedefin için tahmini bir başlangıç noktası oluştur/);
  assert.doesNotMatch(page, /Energy Lab 2\.0|processSteps|Enerji Protokolü/);
});
