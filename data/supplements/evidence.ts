import type { SupplementEvidenceContent, SupplementReference } from "@/lib/supplements/types";

const referenceCatalog: Record<string, SupplementReference> = {
  "ref-5": { id: "ref-5", citation: "ISSN position stand: creatine supplementation and exercise.", url: "https://pubmed.ncbi.nlm.nih.gov/28615996/" },
  "ref-7": { id: "ref-7", citation: "2026 randomized controlled trial meta-analysis: creatine supplementation and kidney function.", url: "https://pubmed.ncbi.nlm.nih.gov/42035842/" },
  "ref-8": { id: "ref-8", citation: "2024 meta-analysis: creatine supplementation and cognitive function.", url: "https://pubmed.ncbi.nlm.nih.gov/39070254/" },
  "ref-9": { id: "ref-9", citation: "Meta-analysis: protein supplementation with resistance training and muscle adaptations.", url: "https://pubmed.ncbi.nlm.nih.gov/28698222/" },
  "ref-10": { id: "ref-10", citation: "ISSN position stand: protein and exercise.", url: "https://pubmed.ncbi.nlm.nih.gov/28642676/" },
  "ref-11": { id: "ref-11", citation: "Meta-analysis: protein timing and resistance-training adaptations.", url: "https://pubmed.ncbi.nlm.nih.gov/23360586/" },
  "ref-12": { id: "ref-12", citation: "Meta-analysis: soy and whey protein during resistance training.", url: "https://pubmed.ncbi.nlm.nih.gov/29722584/" },
  "ref-13": { id: "ref-13", citation: "ISSN position stand: caffeine and exercise performance.", url: "https://pubmed.ncbi.nlm.nih.gov/27612937/" },
  "ref-14": { id: "ref-14", citation: "2025 network meta-analysis: caffeine strategies and exercise performance.", url: "https://pubmed.ncbi.nlm.nih.gov/41374083/" },
  "ref-15": { id: "ref-15", citation: "Systematic review and meta-analysis: caffeine and subsequent sleep.", url: "https://pubmed.ncbi.nlm.nih.gov/36870101/" },
  "ref-16": { id: "ref-16", citation: "2024 meta-analysis: omega-3 with resistance training and strength outcomes.", url: "https://pubmed.ncbi.nlm.nih.gov/38777432/" },
  "ref-17": { id: "ref-17", citation: "Australian Institute of Sport: Group B supplements - fish oils.", url: "https://www.ais.gov.au/nutrition/supplements/group_b" },
  "ref-18": { id: "ref-18", citation: "NIH Office of Dietary Supplements: Omega-3 Fatty Acids Fact Sheet for Health Professionals.", url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/" },
  "ref-19": { id: "ref-19", citation: "Endocrine Society 2024 guideline communication: vitamin D for disease prevention.", url: "https://www.endocrine.org/news-and-advocacy/news-room/2024/endocrine-society-recommends-healthy-adults-take-the-recommended-daily-allowance-of-vitamin-d" },
  "ref-20": { id: "ref-20", citation: "Endocrine Society clinical practice guideline: vitamin D for prevention of disease.", url: "https://www.endocrine.org/clinical-practice-guidelines/vitamin-d-for-prevention-of-disease" },
  "ref-21": { id: "ref-21", citation: "2024 athlete meta-analysis: vitamin D supplementation and muscle strength.", url: "https://pubmed.ncbi.nlm.nih.gov/38860160/" },
  "ref-22": { id: "ref-22", citation: "NIH Office of Dietary Supplements: Magnesium Fact Sheet for Health Professionals.", url: "https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/" },
  "ref-23": { id: "ref-23", citation: "2024 systematic review: magnesium and exercise recovery outcomes.", url: "https://pubmed.ncbi.nlm.nih.gov/38970118/" },
  "ref-26": { id: "ref-26", citation: "NIH Office of Dietary Supplements: Exercise and Athletic Performance Fact Sheet.", url: "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/" },
  "ref-27": { id: "ref-27", citation: "2021 meta-analysis: acute citrulline malate and repetition performance.", url: "https://pubmed.ncbi.nlm.nih.gov/34010809/" },
  "ref-28": { id: "ref-28", citation: "Meta-analysis: citrulline malate and muscle strength.", url: "https://pubmed.ncbi.nlm.nih.gov/34176406/" },
  "ref-29": { id: "ref-29", citation: "ISSN position stand: beta-alanine.", url: "https://pubmed.ncbi.nlm.nih.gov/26175657/" },
  "ref-30": { id: "ref-30", citation: "Systematic review and meta-analysis: beta-alanine and exercise performance.", url: "https://pubmed.ncbi.nlm.nih.gov/27797728/" },
  "ref-31": { id: "ref-31", citation: "2025 comprehensive review: sodium intake and hydration in athletes.", url: "https://link.springer.com/article/10.1186/s44410-025-00011-9" },
  "ref-32": { id: "ref-32", citation: "Meta-analysis: beverage composition and hydration during exercise.", url: "https://pubmed.ncbi.nlm.nih.gov/34716905/" },
  "ref-33": { id: "ref-33", citation: "Sports hydration review including practical sodium replacement ranges.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8955583/" },
  "ref-34": { id: "ref-34", citation: "Consensus review: exercise-associated hyponatremia prevention.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6735969/" },
};

function refs(...ids: string[]): SupplementReference[] {
  return ids.map((id) => referenceCatalog[id]);
}

export const supplementEvidenceBySlug = {
  "creatine-monohydrate": {
    oneLiner: "Tekrarlanan kısa-yüksek yoğunluklu egzersiz ve direnç antrenmanı adaptasyonları için paketteki en güçlü seçeneklerden biridir.",
    mechanism: "Düzenli kullanım kas kreatin depolarını yükseltir; yükleme bu doygunluğa daha hızlı ulaşmayı sağlar ancak zorunlu değildir.",
    quickUses: ["Tekrarlanan kısa-yüksek yoğunluklu egzersiz", "Direnç antrenmanı kapasitesi", "Antrenmanla birlikte kuvvet ve yağsız kütle adaptasyonları"],
    evidence: [
      { claim: "Yüksek yoğunluklu egzersiz ve direnç antrenmanı", grade: "Strong", conclusion: "Kreatin monohidrat geniş ve tutarlı bir araştırma tabanına sahiptir.", referenceIds: ["ref-5"] },
      { claim: "Bilişsel performans", grade: "Limited", conclusion: "Bazı sonuçlarda fayda sinyali vardır ancak genel bulgular karışık/eşdeğerdir.", practicalInterpretation: "Ana kullanım iddiası olarak sunulmamalıdır.", referenceIds: ["ref-8"] },
    ],
    researchProtocols: [
      { label: "Hızlı doyurma protokolü", protocol: "Yaklaşık 0,3 g/kg/gün, 5-7 gün; ardından 3-5 g/gün.", form: "Kreatin monohidrat", note: "Araştırma protokolüdür; kişisel reçete değildir." },
      { label: "Yüklemesiz protokol", protocol: "3-5 g/gün düzenli kullanım.", form: "Kreatin monohidrat", note: "Yükleme zorunlu değildir; yalnızca doygunluğa ulaşma hızını değiştirir." },
    ],
    safety: "2026 RCT meta-analizinde serum kreatinininde küçük bir ortalama artış görülürken üre veya eGFR açısından anlamlı bozulma saptanmadı.",
    limitations: ["Serum kreatininindeki artış otomatik olarak böbrek hasarı anlamına gelmez.", "Özellikle bir yılı aşan uzun dönem RCT verisi geliştirilmelidir."],
    myths: [{ myth: "Kreatinin yükselmesi otomatik olarak böbrek hasarıdır.", answer: "Belgedeki 2026 meta-analizi üre veya eGFR açısından anlamlı bozulma saptamadı; laboratuvar sonucu klinik bağlamda yorumlanmalıdır." }],
    verdict: "Kreatin monohidrat, kanıt gücü en yüksek performans supplementlerinden biridir; bilişsel faydalar ise ikincil ve sınırlı kanıt olarak kalır.",
    references: refs("ref-5", "ref-7", "ref-8"),
  },
  "whey-protein": {
    oneLiner: "Toplam günlük protein alımını pratik biçimde tamamlayan yüksek kaliteli bir protein kaynağıdır.",
    quickUses: ["Toplam protein hedefini tamamlamak", "Direnç antrenmanı adaptasyonlarını desteklemek", "Pratik tek porsiyon protein sağlamak"],
    evidence: [
      { claim: "Protein desteği ve direnç antrenmanı adaptasyonları", grade: "Strong", conclusion: "Toplam protein alımı yetersiz kaldığında supplement desteği yağsız kütle ve kuvvet adaptasyonlarına katkı sağlayabilir.", practicalInterpretation: "Meta-regresyondaki yaklaşık 1,6 g/kg/gün değeri bireysel sert tavan değildir.", referenceIds: ["ref-9", "ref-10"] },
      { claim: "Dar 30 dakikalık anabolic window", grade: "Not Supported", conclusion: "Toplam günlük alım ve gün içine dağılım, katı birkaç dakikalık pencereden daha yüksek önceliklidir.", referenceIds: ["ref-11"] },
      { claim: "Whey her koşulda diğer kaliteli proteinlerden üstündür", grade: "Not Supported", conclusion: "Whey ve soy karşılaştırmalarında anlamlı kuvvet farkı göstermeyen meta-analitik veriler vardır.", referenceIds: ["ref-12"] },
    ],
    researchProtocols: [
      { label: "Toplam günlük protein", protocol: "Egzersiz yapan kişiler için araştırma çerçevesi yaklaşık 1,4-2,0 g/kg/gün toplam proteindir.", note: "Yalnız whey dozu değildir; toplam beslenme planını ifade eder." },
      { label: "Tek porsiyon çerçevesi", protocol: "Yaklaşık 0,25 g/kg veya 20-40 g yüksek kaliteli protein.", timing: "Egzersize yakın kullanım pratiktir; katı bir 30 dakikalık pencere gerekmez." },
    ],
    myths: [
      { myth: "Whey tek başına kas yapan sihirli bir tozdur.", answer: "Fayda, direnç antrenmanı ve toplam günlük protein alımı bağlamında ortaya çıkar." },
      { myth: "Protein ilk 30 dakika içinde alınmazsa etkisizdir.", answer: "Toplam günlük alım ve dağılım daha yüksek önceliğe sahiptir." },
    ],
    verdict: "Whey, protein gereksinimini tamamlamak için güçlü kanıtlı ve pratik bir araçtır; üstünlüğü toplam beslenme bağlamından bağımsız değildir.",
    references: refs("ref-9", "ref-10", "ref-11", "ref-12"),
  },
  "caffeine": {
    oneLiner: "Özellikle aerobik dayanıklılıkta güçlü, bazı diğer performans alanlarında küçük fakat anlamlı akut etkiler gösterebilir.",
    quickUses: ["Aerobik dayanıklılık", "Takım sporları ve tekrarlanan sprint", "Bazı kuvvet ve güç çıktıları"],
    evidence: [
      { claim: "Aerobik dayanıklılık", grade: "Strong", conclusion: "Geniş performans literatürü akut ergogenik etkiyi destekler.", referenceIds: ["ref-13"] },
      { claim: "Takım sporları, sprint, kuvvet ve güç", grade: "Moderate", conclusion: "Çoğunlukla küçük fakat anlamlı akut etkiler görülebilir.", referenceIds: ["ref-13", "ref-14"] },
    ],
    researchProtocols: [{ label: "Akut araştırma protokolü", protocol: "Yaklaşık 3-6 mg/kg; düşük doz yaklaşık 3 mg/kg stratejisi de etkili bulunmuştur.", note: "Daha yüksek doz otomatik olarak daha iyi değildir." }],
    safety: "Doz yükseldikçe gereksiz yan etki maliyeti ve uyku bozulması riski artabilir.",
    sideEffects: ["Huzursuzluk", "Anksiyete", "Çarpıntı", "Uyku bozulması"],
    verdict: "Kafein güçlü akut performans kanıtına sahiptir; en iyi yaklaşım etkiyi korurken yan etki ve uyku maliyetini sınırlayan en düşük etkili stratejidir.",
    references: refs("ref-13", "ref-14", "ref-15"),
  },
  "omega-3": {
    oneLiner: "Sağlık ve beslenme rolü, karışık ve bağlama bağlı atletik performans iddialarından ayrılmalıdır.",
    quickUses: ["EPA ve DHA alımını desteklemek", "Bağlama bağlı kuvvet sonuçları", "Sınırlı recovery/DOMS kanıtı"],
    evidence: [
      { claim: "Direnç antrenmanıyla kuvvet kazanımları", grade: "Moderate", conclusion: "Bazı olumlu sonuçlar vardır ancak bağlama ve çalışmalara göre değişir.", referenceIds: ["ref-16"] },
      { claim: "Recovery ve DOMS", grade: "Limited", conclusion: "Sonuçlar heterojendir ve net bir genel fayda göstermez.", referenceIds: ["ref-16", "ref-17"] },
      { claim: "Omega-3 doğrudan kas yapar", grade: "Not Supported", conclusion: "Kas kütlesi ve doğrudan performans sonuçları tutarlı değildir.", referenceIds: ["ref-16", "ref-17"] },
    ],
    safety: "NIH ODS güvenlik değerlendirmeleri toplam EPA+DHA için yaklaşık 5 g/gün düzeyine kadar veri bildirir; bu değer günlük hedef değildir.",
    cautions: ["Yüksek trigliserid için 4 g/gün reçeteli kullanım ayrı ve hekim yönetimli bir tedavi bağlamıdır.", "Yüksek kardiyovasküler riskli kişilerde uzun süreli yüksek doz çalışmalarında atriyal fibrilasyon riskinde küçük artış bildirilmiştir."],
    myths: [{ myth: "Omega-3 kas yapar.", answer: "Belge, kas kütlesi ve doğrudan performans sonuçlarının heterojen olduğunu ve bu claim'in kullanılmaması gerektiğini belirtir." }],
    verdict: "Omega-3'ün beslenme/sağlık rolü atletik claim'lerden daha nettir; kuvvet ve recovery sonuçları bağlama bağlı veya sınırlıdır.",
    references: refs("ref-16", "ref-17", "ref-18"),
  },
  "vitamin-d": {
    oneLiner: "Gerçek yetersizliğin düzeltilmesi ile yeterli durumdaki kişide performans artırma iddiası birbirinden ayrılmalıdır.",
    quickUses: ["Yetersizlik bağlamında vitamin D durumunu desteklemek", "Kemik ve mineral metabolizması", "Performans iddialarını yeterlilik durumuna göre değerlendirmek"],
    evidence: [
      { claim: "Gerçek yetersizliğin düzeltilmesi", grade: "Strong", conclusion: "Yetersizlik bağlamındaki fizyolojik rol güçlü bilimsel temele sahiptir.", referenceIds: ["ref-19", "ref-20"] },
      { claim: "Yeterli düzeyde genel kas kuvvetini artırma", grade: "Not Supported", conclusion: "Serum düzeyi yükselse bile yeterli düzeye ulaşan atletlerde genel kuvvet artışı güvenilir biçimde gösterilmemiştir.", referenceIds: ["ref-21"] },
    ],
    researchProtocols: [{ label: "Referans alım değerleri", protocol: "Yetişkinlerde 600 IU (15 µg); 70 yaş üstünde 800 IU (20 µg).", note: "Yetişkin UL değeri 4.000 IU (100 µg)/gündür; UL hedef doz değildir." }],
    cautions: ["2024 Endocrine Society kılavuzu, özel endikasyon yoksa sağlıklı 75 yaş altı yetişkinlerde RDA üzerindeki rutin ampirik kullanımı önermiyor.", "Genel sağlıklı yetişkinlerde rutin 25(OH)D taraması önerilmiyor."],
    myths: [{ myth: "Vitamin D herkes için bir strength booster'dır.", answer: "Yeterli serum düzeyine ulaşan atletlerde genel kas kuvveti artışı güvenilir biçimde gösterilmemiştir." }],
    verdict: "Vitamin D, yetersizlik bağlamında önemlidir; yeterli durumdaki kişide rutin yüksek doz performans stratejisi değildir.",
    references: refs("ref-19", "ref-20", "ref-21"),
  },
  "magnesium": {
    oneLiner: "Temel bir mineraldir; yeterli magnezyum durumunda ekstra supplementin ergogenik faydası desteklenmez.",
    quickUses: ["Fizyolojik magnezyum gereksinimini karşılamak", "Enerji metabolizması ve sinir-kas işlevi", "Sınırlı recovery araştırmalarını bağlamıyla değerlendirmek"],
    evidence: [
      { claim: "Yeterli durumdaki aktif kişilerde kas performansını artırma", grade: "Not Supported", conclusion: "Kas fitness'ına ek fayda genel olarak desteklenmiyor.", referenceIds: ["ref-22"] },
      { claim: "Recovery ve kas ağrısı", grade: "Limited", conclusion: "Bazı olumlu bulgular vardır; çalışma sayısı ve protokoller sınırlıdır.", referenceIds: ["ref-23"] },
    ],
    researchProtocols: [{ label: "Supplement üst alım sınırı", protocol: "Yetişkinlerde supplement/ilaç kaynaklı magnezyum için UL 350 mg/gün.", note: "Bu sınır gıdalardan gelen magnezyumu kapsamaz ve hedef doz değildir." }],
    sideEffects: ["İshal", "Bulantı", "Kramp"],
    cautions: ["Böbrek fonksiyon bozukluğunda ciddi toksisite riski daha önemlidir."],
    interactions: ["Antibiyotikler ve oral bisfosfonatlarla emilim etkileşimleri olabilir."],
    verdict: "Magnezyum eksikliği ve gereksinim bağlamında önemlidir; yeterli durumdaki aktif kişide rutin performans artırıcı değildir.",
    references: refs("ref-22", "ref-23"),
  },
  "citrulline": {
    oneLiner: "Mekanizması anlamlı olsa da performans sonuçları kreatin veya kafein kadar tutarlı değildir.",
    mechanism: "L-sitrülin, arginin ve nitrik oksit biyolojisiyle ilişkilidir; mekanistik uygunluk tek başına performans faydasını kanıtlamaz.",
    quickUses: ["Direnç egzersizinde repetition performance", "Pump/vasodilation iddiaları", "Kuvvet ve aerobik sonuçları ayrı değerlendirmek"],
    evidence: [
      { claim: "Direnç egzersizinde repetition performance", grade: "Moderate", conclusion: "6-8 g sitrülin malat ile ortalama küçük bir tekrar artışı bildirilmiştir.", practicalInterpretation: "Etki küçüktür ve maksimal kuvvet artışı anlamına gelmez.", referenceIds: ["ref-27"] },
      { claim: "Maksimal kas kuvveti", grade: "Not Supported", conclusion: "Meta-analiz sağlıklı/direnç antrenmanlı bireylerde artışı desteklemedi.", referenceIds: ["ref-28"] },
      { claim: "Aerobik performans", grade: "Not Supported", conclusion: "Genel aerobik performans faydası desteklenmedi.", referenceIds: ["ref-26", "ref-28"] },
      { claim: "Pump/vasodilation", grade: "Limited", conclusion: "Mekanizma anlamlı olsa da pratik performans karşılığı sınırlıdır.", referenceIds: ["ref-26"] },
    ],
    researchProtocols: [{ label: "Akut repetition protokolü", protocol: "6-8 g sitrülin malat.", timing: "Egzersizden 40-60 dakika önce.", note: "Araştırma protokolüdür; etki büyüklüğü küçüktür." }],
    limitations: ["L-sitrülin ve sitrülin malat sonuçları tek bir ürün gibi genellenmemelidir.", "Mekanistik uygunluk klinik veya performans faydasının kanıtı değildir."],
    verdict: "Sitrülinin en makul sinyali repetition performance alanındadır; maksimal kuvvet ve aerobik performans iddiaları desteklenmez.",
    references: refs("ref-26", "ref-27", "ref-28"),
  },
  "beta-alanine": {
    oneLiner: "Akut uyarıcı değil, özellikle 1-4 dakikalık yüksek yoğunluklu eforlar için kronik kas karnosin yükleme stratejisidir.",
    mechanism: "Düzenli kullanım haftalar içinde kas karnosinini yükseltir; hissedilen karıncalanma performans mekanizması değildir.",
    quickUses: ["Yaklaşık 1-4 dakikalık yüksek yoğunluklu eforlar", "Kas karnosinini kronik olarak yükseltmek", "Çok kısa ve uzun eforlarda daha belirsiz sonuçları ayırmak"],
    evidence: [
      { claim: "Yaklaşık 60-240 saniyelik yüksek yoğunluklu performans", grade: "Strong", conclusion: "En belirgin fayda bu süre aralığındaki eforlarda görülür.", referenceIds: ["ref-29", "ref-30"] },
      { claim: "Çok kısa efor ve uzun dayanıklılık", grade: "Limited", conclusion: "Etki daha az tutarlı ve bağlama bağlıdır.", referenceIds: ["ref-30"] },
    ],
    researchProtocols: [{ label: "Kronik yükleme protokolü", protocol: "Yaklaşık 4-6 g/gün düzenli kullanım.", timing: "Akut pre-workout etkisi olarak değerlendirilmez.", note: "Bölünmüş veya yavaş salımlı form paresteziyi azaltabilir." }],
    timeToEffect: "Asıl mekanizma haftalar içinde kas karnosininin yükselmesidir.",
    sideEffects: ["Parestezi (geçici karıncalanma)"],
    myths: [{ myth: "Karıncalanma performans etkisinin başladığını gösterir.", answer: "Karıncalanma bir yan etkidir; performans mekanizması haftalar içinde artan kas karnosinidir." }],
    verdict: "Beta-alanin belirli yüksek yoğunluklu efor sürelerinde anlamlıdır; akut his, etkinin göstergesi değildir.",
    references: refs("ref-29", "ref-30"),
  },
  "electrolytes": {
    oneLiner: "Rutin olarak herkes için değil; süre, ortam, ter hızı ve sıvı kaybına göre kişiselleştirilmesi gereken bir hidrasyon aracıdır.",
    quickUses: ["Uzun süreli egzersiz", "Sıcak/nemli ortam ve yüksek ter hızı", "Önemli sıvı ve sodyum kaybı"],
    evidence: [
      { claim: "Uzun süreli/sıcak koşullarda kişiselleştirilmiş kullanım", grade: "Moderate", conclusion: "Ter hızı, ter sodyumu, süre, ortam ve sıvı tüketimine göre anlamlı olabilir.", referenceIds: ["ref-31", "ref-32"] },
      { claim: "Her antrenmanda rutin elektrolit gereklidir", grade: "Not Supported", conclusion: "Çoğu atlet günlük hidrasyon için normal diyetin ötesinde rutin sodyum supplementine ihtiyaç duymaz.", referenceIds: ["ref-31"] },
    ],
    whoMayBenefit: ["Uzun süreli egzersiz yapanlar", "Sıcak veya nemli ortamda çalışanlar", "Yüksek ter hızı ve önemli sodyum kaybı olanlar"],
    whoMayNotNeed: ["Kısa, düşük ter kayıplı antrenman yapan ve normal beslenmeyle yeterli sodyum alan çoğu kişi"],
    researchProtocols: [{ label: "Pratik başlangıç referansı", protocol: "Yaklaşık 300-600 mg sodyum/saat.", note: "Evrensel reçete değildir; kişisel ter, süre, ortam ve sıvı planına göre uyarlanmalıdır." }],
    safety: "Aşırı sıvı tüketiminden kaçınmak, egzersiz ilişkili hiponatreminin temel önleme ilkelerindendir.",
    cautions: ["Elektrolit kullanmak aşırı su tüketimini otomatik olarak güvenli hale getirmez."],
    myths: [{ myth: "Elektrolit alıyorsam istediğim kadar su içebilirim.", answer: "Yanlış. Aşırı sıvı tüketimi hiponatremi riskini artırabilir; elektrolit bunu otomatik olarak önlemez." }],
    verdict: "Elektrolitler koşula bağlı bir araçtır; en iyi kullanım sabit reçete yerine kişiselleştirilmiş hidrasyon planıdır.",
    references: refs("ref-31", "ref-32", "ref-33", "ref-34"),
  },
} as const satisfies Record<string, SupplementEvidenceContent>;

export function validateSupplementEvidence(content: SupplementEvidenceContent): string[] {
  const errors: string[] = [];
  const referenceIds = new Set(content.references.map((reference) => reference.id));

  for (const claim of content.evidence) {
    for (const id of claim.referenceIds) {
      if (!referenceIds.has(id)) errors.push(`Missing reference ${id} for claim "${claim.claim}"`);
    }
  }
  if (!content.oneLiner.trim()) errors.push("Missing one-liner");
  if (!content.verdict.trim()) errors.push("Missing verdict");
  return errors;
}
