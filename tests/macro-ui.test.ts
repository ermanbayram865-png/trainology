import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../app/calculators/macro/page.tsx", import.meta.url),
  "utf8",
);
const prefillSource = readFileSync(
  new URL("../lib/calculators/macro-prefill.ts", import.meta.url),
  "utf8",
);

test("Makro Planlayıcı iki adımlı wizard, geri ve sonuç akışını korur", () => {
  assert.match(source, /type MacroStage = 1 \| 2 \| "result"/);
  assert.match(source, /useState<MacroStage>\(1\)/);
  assert.match(source, /validateFields\(\["weight", "height", "calories"\]\)\) setStage\(2\)/);
  assert.match(source, /onClick=\{\(\) => setStage\(1\)\}/);
  assert.match(source, /Temel Bilgiler/);
  assert.match(source, /Plan Tercihlerin/);
  assert.doesNotMatch(source, /MacroProfilePanel|EmptyProfileState|sticky/);
});

test("ağırlık, boy ve kalori teknik validasyonları inline çalışır", () => {
  assert.match(source, /name: "weight"[\s\S]+?min: 25, max: 400/);
  assert.match(source, /name: "height"[\s\S]+?min: 100, max: 250/);
  assert.match(source, /name: "calories"[\s\S]+?min: 1000, max: 8000/);
  assert.match(source, /validateCalculatorField\(field, values\[field\.name\]\)/);
  assert.match(source, /id="macro-height"/);
  assert.match(source, /role="alert"/);
  assert.match(source, /aria-invalid/);
});

test("manuel kalori ve güvenli Energy Lab prefill akışları birlikte çalışır", () => {
  assert.match(source, /calories: ""/);
  assert.match(source, /height: ""/);
  assert.match(source, /useSearchParams\(\)/);
  assert.match(source, /parseMacroCaloriePrefill\(searchParams\.get\("calories"\)\)/);
  assert.match(prefillSource, /Number\.isInteger\(value\)/);
  assert.match(prefillSource, /MACRO_CALORIE_PREFILL_MIN = 1000/);
  assert.match(prefillSource, /MACRO_CALORIE_PREFILL_MAX = 8000/);
  assert.match(source, /currentValues\.calories === ""/);
  assert.match(source, /href=\{ENERGY_LAB_PATH\}/);
  assert.match(source, /Energy Lab ile hesapla/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\s*\(/i);
});

test("hedef ve direnç antrenmanı seçimleri erişilebilir kartlarla motora aktarılır", () => {
  assert.match(source, /Düzenli direnç antrenmanı yapıyor musun\?/);
  assert.match(source, /name="resistanceTraining"/);
  assert.match(source, /resistanceTraining: values\.resistanceTraining as MacroResistanceTraining/);
  assert.match(source, /type="radio" name=\{name\}/);
  assert.match(source, /checked=\{selected\}/);
  assert.match(source, /Seçili/);
  assert.doesNotMatch(source, /activityLevel|Aktivite düzeyin/);
});

test("kompakt yetişkin kapsam kontrolü bütün kapsam dışı durumları temsil eder", () => {
  assert.match(source, /Genel yetişkin kapsamındayım/);
  assert.match(source, /Bu hesaplama benim durumuma uygun olmayabilir/);
  assert.match(source, /18 yaş altı/);
  assert.match(source, /gebelik\/emzirme/);
  assert.match(source, /yeme bozukluğu/);
  assert.match(source, /Sporda Göreceli Enerji Eksikliği \(RED-S\)/);
  assert.match(source, /klinik hastalık\/özel tıbbi diyet/);
  assert.match(source, /fizik yarışması hazırlığı/);
  assert.match(source, /scope: values\.scope as MacroScope/);
  assert.match(source, /Kimler için uygun değildir\?/);
  assert.match(source, /<details/);
});

test("sonuç motorun canonical gram ve yüzde değerlerini gösterir", () => {
  assert.match(source, /distribution\.proteinPercentage/);
  assert.match(source, /distribution\.carbohydratePercentage/);
  assert.match(source, /distribution\.fatPercentage/);
  assert.match(source, /grams: distribution\.protein/);
  assert.match(source, /grams: distribution\.carbohydrates/);
  assert.match(source, /grams: distribution\.fat/);
  assert.match(source, /minimumFractionDigits: 1, maximumFractionDigits: 1/);
  assert.doesNotMatch(source, /proteinShare|carbohydrateShare|conic-gradient/);
  assert.match(source, /Günlük Makro Dağılımın/);
  assert.match(source, /Kullandığın günlük kalori hedefi/);
  assert.match(source, /toplam kalorinin her makrodan gelen payını gösterir/);
});

test("lif, dinamik bilimsel bağlam ve manuel kalori sınırı görünürdür", () => {
  assert.match(source, /Lif referansı/);
  assert.match(source, /≥\{distribution\.fiberReferenceGrams\} g \/ gün/);
  assert.match(source, /makro gramlarına veya kalori hedefine ayrıca eklenmez/);
  assert.match(source, /girdiğin kalori hedefini kullanır/);
  assert.match(source, /Protein hesabında kullanılan ağırlık/);
  assert.match(source, /1,6 g\/kg\/gün/);
  assert.match(source, /genel yetişkin protein yeterlilik referansı/);
});

test("blocked sonuçlar sayısal dağılım göstermeden düzenlemeye döner", () => {
  assert.match(source, /evaluation\.status === "ok"/);
  assert.match(source, /Makro dağılımı oluşturulmadı/);
  assert.match(source, /evaluation\.message/);
  assert.match(source, /Planı Düzenle/);
  assert.match(source, /onEdit=\{\(\) => setStage\(2\)\}/);
  assert.doesNotMatch(source, /setValues\(initialValues\)/);
});

test("metodoloji accordion ve kaynaklar erişilebilir biçimde sunulur", () => {
  assert.match(source, /<details/);
  assert.match(source, /<summary/);
  assert.match(source, /Nasıl hesaplandı\?/);
  assert.match(source, /EFSA — Yetişkin protein PRI/);
  assert.match(source, /Jäger ve ark\./);
  assert.match(source, /Morton ve ark\./);
  assert.match(source, /WHO — Karbonhidrat ve lif kılavuzu/);
  assert.match(source, /Yuvarlama/);
  assert.match(source, /Protein için kanıt sınırı/);
  assert.match(source, /ihtiyatlı bir Trainology başlangıç referansıdır/);
  assert.match(source, /ideal, sağlıklı veya hedef kilo değildir/);
  assert.match(source, /Weijs — Obezitede protein gereksinimi ve kanıt sınırları/);
});

test("wizard foundation spacing ile responsive ve kompakt kalır", () => {
  assert.match(source, /sectionClassName="!py-\[var\(--space-section-compact\)\] sm:!py-8 lg:!py-8/);
  assert.match(source, /contentClassName="space-y-5 lg:space-y-6/);
  assert.match(source, /p-\[var\(--space-panel-compact\)\] sm:p-\[var\(--space-panel\)\]/);
  assert.match(source, /max-w-5xl/);
  assert.match(source, /md:grid-cols-3/);
  assert.match(source, /sm:grid-cols-3/);
  assert.match(source, /min-h-13/);
  assert.match(source, /min-h-11/);
  assert.doesNotMatch(source, /!min-h-10/);
  assert.doesNotMatch(source, /transform:\s*scale|zoom:|overflow-hidden/);
});

test("ana sonuç ve düzenleme aksiyonu uzun açıklamalardan önce gelir", () => {
  const macroCards = source.indexOf("<dl className=");
  const fiber = source.indexOf("Lif referansı");
  const edit = source.indexOf("Planı Düzenle", fiber);
  const explanation = source.indexOf("Bu dağılım ne anlama geliyor?");

  assert.ok(macroCards >= 0);
  assert.ok(fiber > macroCards);
  assert.ok(edit > fiber);
  assert.ok(explanation > edit);
});
