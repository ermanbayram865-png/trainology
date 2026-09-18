import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement, createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { FFMIResultView } from "../components/ffmi/FFMIExperience";

const page = readFileSync("app/calculators/ffmi/page.tsx", "utf8");
const experience = readFileSync("components/ffmi/FFMIExperience.tsx", "utf8");
const comparator = readFileSync("components/ffmi/FFMIReferenceComparator.tsx", "utf8");
const engine = readFileSync("lib/calculators/ffmi.ts", "utf8");
const referenceEngine = readFileSync("lib/calculators/ffmi-reference.ts", "utf8");

test("FFMI vNext zorunlu girdileri ve tek kompakt formu kullanır", () => {
  assert.match(experience, /heightCm: ""/);
  assert.match(experience, /weightKg: ""/);
  assert.match(experience, /bodyFatPercentage: ""/);
  assert.match(experience, /ageYears: ""/);
  assert.match(experience, /referenceSex: ""/);
  assert.match(experience, /measurementMethod: ""/);
  assert.match(experience, /standardAdultScope: false/);
  assert.match(experience, /lg:grid-cols-3/);
  assert.match(experience, /lg:grid-cols-5/);
  assert.match(experience, /FFMI&apos;Yİ HESAPLA/);
  assert.doesNotMatch(experience, /stepper|wizard/i);
});

test("ölçüm yöntemi radio grubu, yardım yolu ve kapsam kilidi erişilebilirdir", () => {
  assert.match(experience, /<fieldset/);
  assert.match(experience, /type="radio"/);
  assert.match(experience, /type="checkbox"/);
  assert.match(experience, /aria-invalid/);
  assert.match(experience, /aria-describedby/);
  assert.match(experience, /Yağ oranını nasıl öğrenebilirim\?/);
  assert.match(experience, /Genel yetişkin kapsamındayım \(18\+\)/);
  assert.match(experience, /Kimler için uygun değildir\?/);
  assert.match(experience, /min-h-11|min-h-14/);
});

test("ölçüm yöntemi kartları anlaşılır Türkçe başlık ve kısa açıklamalar kullanır", () => {
  assert.match(experience, /Vücut yağ oranını nasıl ölçtün\?/);
  assert.match(experience, /DEXA Taraması/);
  assert.match(experience, /Profesyonel vücut kompozisyon ölçümü/);
  assert.match(experience, /Akıllı Tartı \/ BIA/);
  assert.match(experience, /Elektriksel ölçüm yapan tartı veya cihaz/);
  assert.match(experience, /Deri Kıvrımı Ölçümü/);
  assert.match(experience, /Kaliper ile yapılan ölçüm/);
  assert.match(experience, /Görünüşe bakarak yaklaşık tahmin/);
  assert.match(experience, /Ölçüm yönteminden emin değilsen/);
  assert.match(experience, /lg:grid-cols-5/);
  assert.match(experience, /min-h-14/);
});

test("form aynı panel içinde sonuca dönüşür; düzenleme korur ve yeni hesaplama sıfırlar", () => {
  assert.match(experience, /result === null \? \(/);
  assert.match(experience, /<FFMIResultView/);
  assert.match(experience, /onEdit=\{\(\) => \{[\s\S]*setResult\(null\);[\s\S]*setStep\(1\);/);
  assert.match(experience, /setForm\(initialForm\)/);
  assert.match(experience, /Değerleri Düzenle/);
  assert.match(experience, /Yeni Hesaplama/);
  assert.doesNotMatch(experience, /placeholder result|boş sonuç/i);
});

test("FFMI premium akışı iki adımı, ileri-geri geçişi ve değer korumayı uygular", () => {
  assert.match(experience, /useState<1 \| 2>\(1\)/);
  assert.match(experience, /<FFMIStepIndicator step=\{step\}/);
  assert.match(experience, /step === 1 \?/);
  assert.match(experience, /Temel ölçümlerini gir/);
  assert.match(experience, /Devam Et/);
  assert.match(experience, /continueToReferenceStep/);
  assert.match(experience, /setStep\(2\)/);
  assert.match(experience, /Referans &amp; Kapsam/);
  assert.match(experience, /onClick=\{\(\) => setStep\(1\)\}/);
  assert.match(experience, /> Geri/);
  assert.doesNotMatch(experience, /setForm\(initialForm\)[\s\S]{0,160}setStep\(2\)/);
});

test("Step 1 yalnız kendi alanlarını doğrular; referans girdileri opsiyonel kalır", () => {
  assert.match(experience, /\["heightCm", "weightKg", "bodyFatPercentage", "measurementMethod"\]/);
  assert.doesNotMatch(
    experience.match(/function continueToReferenceStep[\s\S]*?\n  }/)?.[0] ?? "",
    /ageYears|referenceSex|standardAdultScope/,
  );
  assert.match(experience, /required=\{false\}/);
  assert.match(experience, /\(isteğe bağlı\)/);
});

test("her geçerli sonuç sade FFMI anlamını ve progressive disclosure içindeki teknik metrikleri gösterir", () => {
  assert.match(experience, /FFMI Sonucun/);
  assert.match(experience, /FFMI, boyuna göre yağsız vücut kütleni gösteren bir ölçüdür/);
  assert.match(comparator, /FFMI yükseldikçe boya göre yağsız kütle artar/);
  assert.match(experience, /Bu değer, girdiğin yağ oranına göre tahmini olarak hesaplandı/);
  assert.match(experience, /label="Yağsız Kütle"/);
  assert.match(experience, /label="Yağ İndeksi"/);
  assert.match(experience, /technicalLabel="FMI"/);
  assert.match(experience, /label="Yağ Kütlesi"/);
  assert.match(experience, /FFMI ne anlatır\?/);
  assert.match(experience, /Nasıl hesaplandı\?/);
  assert.match(experience, /aria-live="polite"/);
});

test("sonuç oluşturulduğunda FFMI başlığına programatik odak taşınır", () => {
  assert.match(experience, /resultHeadingRef/);
  assert.match(experience, /ref=\{headingRef\} tabIndex=\{-1\}/);
  assert.match(experience, /resultHeadingRef\.current\?\.focus\(\)/);
});

test("FMI bilgi affordance klavye ve dokunmayla açılabilen semantic disclosure kullanır", () => {
  assert.match(experience, /Yağ indeksin, yağ kütleni boyuna göre ölçekler\./);
  assert.match(experience, /<details className="group relative">/);
  assert.match(experience, /aria-label=\{`\$\{label\} hakkında bilgi`\}/);
  assert.match(experience, /focus-visible:ring-2/);
});

test("interpretation katmanı kas ölçümü ve evrensel ideal değer iddiasını reddeder", () => {
  assert.match(experience, /Yağsız kütle yalnızca kas dokusundan oluşmadığı için/);
  assert.match(experience, /FFMI doğrudan kas[\s\S]*kütlesi ölçümü değildir/);
  assert.match(experience, /FFMI için herkese uyan tek bir normal veya ideal hedef/);
  assert.match(experience, /kullanılan ölçüm yöntemine göre referans[\s\S]*dağılımları değişebilir/);
  assert.match(experience, /Trainology sonucu tek başına düşük, normal, iyi[\s\S]*veya yüksek olarak sınıflandırmaz/);
  assert.match(experience, /ölçüm değişkenliğinden de/);
  assert.match(comparator, /daha yüksek FFMI tek[\s\S]*başına daha sağlıklı veya daha iyi anlamına gelmez/);
  assert.doesNotMatch(experience, /trainingStatus|ethnicity/);
});

test("source-specific yorum form girdilerinden doğrudan üretilir ve erişilebilirdir", () => {
  assert.match(experience, /<FFMIReferenceComparator/);
  assert.match(experience, /Yorumlama bilgileri/);
  assert.match(experience, /\(isteğe bağlı\)/);
  assert.match(experience, /yalnız araştırma karşılaştırmasında kullanılır/);
  assert.match(experience, /label="Yaş"/);
  assert.match(experience, /Erkek referansı/);
  assert.match(experience, /Kadın referansı/);
  assert.match(experience, /type="radio"/);
  assert.match(comparator, /Referans grubundaki konumun/);
  assert.match(experience, /Sonucunu daha ayrıntılı incele/);
  assert.match(comparator, /interpretWithFFMISourceReference/);
  assert.match(comparator, /aria-live="polite"/);
  assert.doesNotMatch(comparator, /Benzer Kişilerle Karşılaştır|onClick|useState/);
  assert.doesNotMatch(comparator, /localStorage|sessionStorage|document\.cookie|indexedDB/);
});

test("yaş ve referans kategorisi FFMI matematiğine aktarılmaz", () => {
  const calculationCall = experience.match(/calculateFFMI\(\{([\s\S]*?)\}\)/);
  assert.ok(calculationCall);
  assert.doesNotMatch(calculationCall[1], /ageYears|referenceSex|sex/);
  assert.match(experience, /ageYears=\{Number\(form\.ageYears\)\}/);
  assert.match(experience, /referenceSex=\{form\.referenceSex\}/);
});

test("comparator dataset etiketini, yöntem uyarısını ve zorunlu disclaimer'ı gösterir", () => {
  assert.match(referenceEngine, /kim_2026_knhanes_ix_ffmi_fmi_v1/);
  assert.match(referenceEngine, /KNHANES IX/);
  assert.match(referenceEngine, /InBody 970/);
  assert.match(referenceEngine, /10\.3390\/nu18081170/);
  assert.match(referenceEngine, /42074983/);
  assert.match(comparator, /FFMI_REFERENCE_METADATA\.displayLabel/);
  assert.match(comparator, /farklı yöntem ve ölçüm koşulları sonuçları etkileyebilir/);
  assert.match(
    comparator,
    /Bu, sağlık veya “iyi\/kötü” fizik değerlendirmesi değildir/,
  );
  assert.match(comparator, /Bilimsel kaynak ve yöntem/);
  assert.match(comparator, /P değerleri, sonucun araştırmadaki referans grubunda yaklaşık nerede bulunduğunu gösterir/);
});

test("measurement confidence UI eşleşmiş, yaklaşık ve kapalı yolları ayırır", () => {
  assert.match(comparator, /interpretation\.confidence === "matched"/);
  assert.match(comparator, /Yaklaşık referans konumun/);
  assert.match(comparator, /Yağ oranını görsel olarak tahmin ettiğin için referans grubundaki konumunu güvenilir biçimde göstermiyoruz/);
  assert.match(comparator, /Referans karşılaştırması için daha güvenilir bir yağ oranı ölçümü gerekir/);
  assert.match(comparator, /Bu yaş için kaynakta yayımlanmış uygun bir yetişkin referans grubu bulunmadığından/);
});

test("referans sonucu sade etiketleri ana, P bandını ikincil bilgi olarak gösterir", () => {
  assert.match(comparator, /Referans grubunun en alt bölümünde/);
  assert.match(comparator, /Referans grubunun alt bölümünde/);
  assert.match(comparator, /Referans grubunun orta %50’sinde/);
  assert.match(comparator, /Referans grubunun üst bölümünde/);
  assert.match(comparator, /Referans grubunun en üst bölümünde/);
  assert.match(comparator, /FFMI teknik aralığı/);
  assert.match(comparator, /FFMI_REFERENCE_BAND_LABELS\[band\]/);
});

test("ölçüm bağlamı yönteme göre sade ve ihtiyatlı metin kullanır", () => {
  assert.match(experience, /Sonucun yaklaşık bir değerdir/);
  assert.match(experience, /Yağ oranını görsel olarak tahmin ettiğin için bu sonucu kesin bir[\s\S]*ölçüm gibi değerlendirmemelisin/);
  assert.match(experience, /Sonucun girdiğin DEXA yağ oranına göre hesaplandı/);
  assert.match(experience, /Sonucun kullandığın cihazın yağ oranı tahminine bağlıdır/);
  assert.match(experience, /Sonucun girdiğin deri kıvrımı ölçümünden elde edilen yağ oranına göre hesaplandı/);
  assert.match(experience, /Ölçüm yöntemini bilmediğimiz için sonucun ne kadar hassas olduğunu[\s\S]*değerlendiremiyoruz/);
});

test("measurement gate yalnız comparator'ı sınırlar; FFMI anlamı her sonuçta kalır", () => {
  assert.match(experience, /FFMI, boyuna göre yağsız vücut kütleni gösteren bir ölçüdür/);
  assert.match(experience, /visual_estimate/);
  assert.match(comparator, /interpretWithFFMISourceReference/);
  assert.doesNotMatch(experience, /measurementMethod === "bia_smart_scale"/);
});

test("teknik provenance tek ve varsayılan kapalı disclosure içinde kalır", () => {
  assert.equal((comparator.match(/Bilimsel kaynak ve yöntem/g) ?? []).length, 1);
  assert.doesNotMatch(comparator, /Neden\?|Karşılaştırma nasıl yapılıyor\?/);
  assert.match(comparator, /<details className="calculator-disclosure group/);
  assert.match(comparator, /FFMI_REFERENCE_METADATA\.displayLabel/);
});

test("scientific veto interpolation ve değer yargısı üreten comparator copy'sini engeller", () => {
  assert.doesNotMatch(comparator, /P63|Türkiye percentili|performans skoru|doğal limit|steroid/i);
  assert.doesNotMatch(comparator, /iyi fizik|kötü fizik|atletik|elite/i);
  assert.doesNotMatch(referenceEngine, /interpolat|Math\.round|toFixed/);
  assert.match(referenceEngine, /p95_or_above: "P95 veya üzerinde"/);
});

test("sonuç aksiyonları eşit yükseklikte outlined secondary family içinde kalır", () => {
  assert.match(experience, /Değerleri Düzenle/);
  assert.match(experience, /Yeni Hesaplama/);
  assert.match(experience, /calculator-action calculator-action--secondary/);
  assert.match(experience, /setForm\(initialForm\)/);
});

test("legacy sınıflandırma, özel 25 eşiği ve normalize formül kaldırılmıştır", () => {
  assert.doesNotMatch(engine, /classifyFFMI|FFMIClassification|ffmi\s*<\s*(18|22|25)/);
  assert.doesNotMatch(`${page}\n${experience}`, /İyi gelişmiş|doğal limit|steroid ihtimali|percentile|\/100/i);
  assert.doesNotMatch(experience, /natural limit|steroid|ideal FFMI|reference band/i);
  assert.doesNotMatch(engine, /6\.1\s*\*|6\.3\s*\*|1\.8\s*-\s*height/i);
});

test("FFMI aracı kullanıcı ölçümü veya sonucu kalıcı saklamaz", () => {
  assert.doesNotMatch(
    experience,
    /localStorage|sessionStorage|document\.cookie|indexedDB|saveResult|history/i,
  );
});

test("FFMI sunumu ortak semantik viewport ve editorial sonuç sistemini kullanır", () => {
  assert.match(page, /max-w-6xl/);
  assert.match(page, /space-section-compact/);
  assert.match(page, /space-field-group/);
  assert.match(experience, /calculator-label/);
  assert.match(experience, /calculator-result-light/);
  assert.match(experience, /type-technical-label-size/);
  assert.match(experience, /text-\[clamp\(3rem,8vw,4\.5rem\)\]/);
  assert.match(experience, /border-y border-\[var\(--calculator-border\)\]/);
  assert.match(comparator, /border-l-2 border-\[var\(--calculator-gold\)\]/);
  assert.match(experience, /min-h-11/);
  assert.doesNotMatch(`${page}\n${experience}\n${comparator}`, /max-height:850px/);
  assert.doesNotMatch(`${page}\n${experience}\n${comparator}`, /zoom:|transform:\s*scale|sticky|fixed|overflow-hidden/);
});

test("FFMI sonucu puanlaştırılmaz; referans konumu ikincil ve belirsizlik görünür kalır", () => {
  assert.match(comparator, /Referans grubundaki konumun/);
  assert.match(comparator, /Yaklaşık referans konumun/);
  assert.match(comparator, /puan veya kalite derecesi değildir/);
  assert.match(comparator, /daha yüksek FFMI tek[\s\S]*daha sağlıklı veya daha iyi anlamına gelmez/);
  assert.doesNotMatch(`${experience}\n${comparator}`, /progress|gauge|speedometer|score out of|\/100/i);
});

test("FFMI fold düzeltmesi CTA'yı scope ile birleştirir ve metrikleri disclosure önüne taşır", () => {
  assert.match(experience, /lg:grid-cols-\[minmax\(0,1fr\)_auto\]/);
  assert.match(experience, /FFMI&apos;Yİ HESAPLA/);
  assert.match(experience, /lg:grid-cols-\[minmax\(0,\.8fr\)_minmax\(0,1\.2fr\)\]/);

  const metricIndex = experience.indexOf('label="Yağsız Kütle"');
  const actionsIndex = experience.indexOf("Değerleri Düzenle");
  const measurementContextIndex = experience.indexOf("Ölçüm yönteminin etkisi");
  const methodologyIndex = experience.indexOf("FFMI ne anlatır?");

  assert.ok(metricIndex > -1);
  assert.ok(metricIndex < actionsIndex);
  assert.ok(actionsIndex < measurementContextIndex);
  assert.ok(measurementContextIndex < methodologyIndex);
});

test("render edilmiş FFMI DOM'u kullanıcı özetini tek teknik giriş noktasından önce tutar", () => {
  const markup = renderToStaticMarkup(
    createElement(
      FFMIResultView,
      {
        form: {
          heightCm: "175",
          weightKg: "70",
          bodyFatPercentage: "20",
          ageYears: "35",
          referenceSex: "men",
          measurementMethod: "bia_smart_scale",
          standardAdultScope: true,
        },
        result: {
          type: "SUCCESS",
          fatMassKg: 14,
          fatFreeMassKg: 56,
          ffmi: 19.5,
          fmi: 4.8,
          metadata: {
            method: "standard_ffmi",
            estimatedFromBodyFatInput: true,
            bodyFatMeasurementMethod: "bia_smart_scale",
            intermediateRounding: false,
            classificationProduced: false,
            normalizedFFMIProduced: false,
          },
        },
        headingRef: createRef<HTMLHeadingElement>(),
        onEdit: () => undefined,
        onReset: () => undefined,
      },
    ),
  );

  const ffmiIndex = markup.indexOf("FFMI Sonucun");
  const meaningIndex = markup.indexOf("boyuna göre yağsız vücut kütleni");
  const referenceIndex = markup.indexOf("Referans grubundaki konumun");
  const leanMassIndex = markup.indexOf("Yağsız Kütle");
  const fatMassIndex = markup.indexOf("Yağ Kütlesi");
  const actionsIndex = markup.indexOf("Değerleri Düzenle");
  const detailsEntryIndex = markup.indexOf("Sonucunu daha ayrıntılı incele");
  const fmiIndex = markup.indexOf("Yağ İndeksi");
  const measurementIndex = markup.indexOf("Ölçüm yönteminin etkisi");
  const referenceDetailsIndex = markup.indexOf("Referans karşılaştırmasının ayrıntıları");
  const scientificMethodIndex = markup.indexOf("Bilimsel kaynak ve yöntem");

  assert.ok(ffmiIndex < meaningIndex);
  assert.ok(meaningIndex < referenceIndex);
  assert.ok(referenceIndex < leanMassIndex);
  assert.ok(leanMassIndex < fatMassIndex);
  assert.ok(fatMassIndex < actionsIndex);
  assert.ok(actionsIndex < detailsEntryIndex);
  assert.ok(detailsEntryIndex < fmiIndex);
  assert.ok(fmiIndex < measurementIndex);
  assert.ok(measurementIndex < referenceDetailsIndex);
  assert.ok(referenceDetailsIndex < scientificMethodIndex);
  assert.match(markup, /data-result-order="details-entry"/);
  assert.match(markup, /data-result-order="level-two-details"/);
  assert.match(markup, /data-result-order="technical-disclosures"/);
});

test("ana sonuç aksiyonları teknik detaylardan önce gelir ve 44 px hedefleri korunur", () => {
  const editActionIndex = experience.indexOf("Değerleri Düzenle");
  const measurementContextIndex = experience.indexOf("Ölçüm yönteminin etkisi");
  const methodologyIndex = experience.indexOf("FFMI ne anlatır?");
  assert.ok(editActionIndex > -1);
  assert.ok(editActionIndex < measurementContextIndex);
  assert.ok(editActionIndex < methodologyIndex);
  assert.match(experience, /className="flex size-11 cursor-pointer/);
  assert.match(experience, /\[&>details>summary\]:!min-h-11/);
  assert.match(comparator, /summary className="flex min-h-11/);
});
