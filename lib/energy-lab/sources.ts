export type EnergyEvidenceStrength =
  | "supported"
  | "partially-supported";

export type EnergyScientificDecision =
  | "locked"
  | "acceptable-safety-rule";

export type EnergySource = {
  id: string;
  title: string;
  authors: string;
  year: number;
  publication: string;
  doi?: string;
  url: string;
  supports: string;
  limits: string;
};

export const ENERGY_LAB_SOURCES: readonly EnergySource[] = [
  {
    id: "nasem-2023-energy",
    title: "Dietary Reference Intakes for Energy",
    authors: "National Academies of Sciences, Engineering, and Medicine",
    year: 2023,
    publication: "The National Academies Press",
    doi: "10.17226/26818",
    url: "https://nap.nationalacademies.org/catalog/26818/dietary-reference-intakes-for-energy",
    supports:
      "19+ yetişkinlerde EER ile günlük enerji ihtiyacı tahmini, dört PAL kategorisi, ağırlık dengesi bağlamı, tahmin belirsizliği, gözlenen ağırlık eğilimiyle yeniden değerlendirme ve BMI ≥50 araştırma boşluğu.",
    limits:
      "EER bir başlangıç tahminidir; doğru PAL seçimi güçtür ve rapor tek bir kişisel yağ kaybı açığı tanımlamaz.",
  },
  {
    id: "mifflin-1990",
    title: "A New Predictive Equation for Resting Energy Expenditure in Healthy Individuals",
    authors: "Mifflin MD, St Jeor ST, Hill LA, et al.",
    year: 1990,
    publication: "American Journal of Clinical Nutrition, 51(2), 241–247",
    doi: "10.1093/ajcn/51.2.241",
    url: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
    supports: "Kadın ve erkek Mifflin–St Jeor dinlenme enerjisi denklemleri.",
    limits:
      "Orijinal örneklem 19–78 yaşındaki sağlıklı yetişkinlerden oluşur; sonuç yalnız ikincil RMR tahminidir.",
  },
  {
    id: "das-2009-energy-restriction",
    title: "Low or Moderate Dietary Energy Restriction for Long-term Weight Loss: What Works Best?",
    authors: "Das SK, Saltzman E, Gilhooly CH, et al.",
    year: 2009,
    publication: "Obesity, 17(11), 2019–2024",
    doi: "10.1038/oby.2009.120",
    url: "https://pubmed.ncbi.nlm.nih.gov/19390525/",
    supports:
      "Fazla kilolu yetişkinlerde enerji kısıtlamasının kilo kaybı müdahalesinde kullanılması ve %10 enerji kısıtlamasının incelenmiş mütevazı bir büyüklük olması.",
    limits:
      "Küçük pilot çalışma %10'u herkes için doğru oran veya kişiselleştirilmiş reçete olarak doğrulamaz; sonuçlar kişiler arasında değişmiştir.",
  },
  {
    id: "murphy-koehler-2022",
    title: "Energy Deficiency Impairs Resistance Training Gains in Lean Mass but Not Strength",
    authors: "Murphy C, Koehler K",
    year: 2022,
    publication: "Scandinavian Journal of Medicine & Science in Sports, 32(1), 125–137",
    doi: "10.1111/sms.14075",
    url: "https://pubmed.ncbi.nlm.nih.gov/34623696/",
    supports:
      "Direnç antrenmanı bağlamında daha büyük ve uzun süreli açıkları sınırlamak için başlangıç enerji farkında kullanılan 500 kcal/gün sınırının gerekçesi.",
    limits:
      "Meta-regresyon 500 kcal değerini evrensel güvenlik eşiği yapmaz ve BMI tabanlı açık seçimini desteklemez.",
  },
  {
    id: "nice-2025-overweight-obesity",
    title: "Overweight and obesity management: Physical activity and diet",
    authors: "National Institute for Health and Care Excellence",
    year: 2025,
    publication: "NICE Guideline NG246",
    url: "https://www.nice.org.uk/guidance/ng246/chapter/Physical-activity-and-diet",
    supports:
      "Enerji açığının kilo kaybı müdahalelerinde kullanılması ve 800–1.200 kcal/gün düşük enerjili diyetlerin uzman hizmeti, çok bileşenli yaklaşım ve uzun süreli destek gerektiren bağlamı.",
    limits:
      "1.200 kcal biyolojik minimum olarak tanımlanmaz; Energy Lab'ın yuvarlama öncesindeki hedef ≤1.200 olduğunda çıktıyı durdurması ayrı bir koruyucu sınırdır.",
  },
  {
    id: "helms-2023-surplus",
    title:
      "Effect of Small and Large Energy Surpluses on Strength, Muscle, and Skinfold Thickness in Resistance-Trained Individuals",
    authors: "Helms ER, Spence AJ, Sousa C, et al.",
    year: 2023,
    publication: "Sports Medicine - Open, 9, 102",
    doi: "10.1186/s40798-023-00651-y",
    url: "https://pubmed.ncbi.nlm.nih.gov/37914977/",
    supports: "Günlük enerji ihtiyacı, yaklaşık %5 ve yaklaşık %15 fazlanın karşılaştırıldığı küçük fazlalık yaklaşımı.",
    limits:
      "Küçük ve kısa süreli direnç antrenmanlı örneklem +%5'i evrensel veya kişisel hedef olarak kanıtlamaz.",
  },
  {
    id: "who-bmi",
    title: "Physical Status: The Use and Interpretation of Anthropometry",
    authors: "World Health Organization",
    year: 1995,
    publication: "WHO Technical Report Series 854",
    url: "https://apps.who.int/nutrition/landscape/help.aspx?helpid=420&menu=0",
    supports:
      "BMI formülü, <18,5 düşük ağırlık sınıflaması ve <16 belirgin sağlık riski taşıyan uç sınır.",
    limits:
      "BMI tanı değildir; tek başına kişisel yağ kaybı hızını veya kalori açığını belirlemez.",
  },
] as const;

export const ENERGY_SCIENTIFIC_DECISIONS = [
  {
    id: "maintenance-eer",
    rule: "NASEM 2023 EER ile günlük enerji ihtiyacı tahmini ve en yakın 50 kcal görünür yuvarlama",
    evidence: "supported" as const,
    decision: "locked" as const,
  },
  {
    id: "mifflin-rmr",
    rule: "Mifflin–St Jeor yalnız ikincil dinlenme enerjisi tahmini",
    evidence: "supported" as const,
    decision: "locked" as const,
  },
  {
    id: "fat-loss-starting-rule",
    rule: "Günlük enerji ihtiyacı tahmininin %10'u kadar muhafazakâr başlangıç açığı",
    evidence: "partially-supported" as const,
    decision: "acceptable-safety-rule" as const,
  },
  {
    id: "deficit-cap",
    rule: "Başlangıç enerji farkı için 500 kcal sınırı; evrensel güvenlik eşiği değil",
    evidence: "partially-supported" as const,
    decision: "acceptable-safety-rule" as const,
  },
  {
    id: "low-calorie-gate",
    rule: "Yuvarlama öncesindeki hedef ≤1.200 kcal/gün olduğunda sayısal sonucu durdurma; biyolojik minimum değil",
    evidence: "partially-supported" as const,
    decision: "acceptable-safety-rule" as const,
  },
  {
    id: "small-surplus",
    rule: "Günlük enerji ihtiyacına yakın veya +%5 küçük fazlalık yaklaşımı",
    evidence: "partially-supported" as const,
    decision: "acceptable-safety-rule" as const,
  },
  {
    id: "bmi-under-16",
    rule: "BMI <16 genel sayısal hedef durdurma",
    evidence: "supported" as const,
    decision: "acceptable-safety-rule" as const,
  },
  {
    id: "bmi-under-18-5",
    rule: "16 ≤ BMI <18,5 aralığında yağ kaybı hedefini durdurma",
    evidence: "supported" as const,
    decision: "acceptable-safety-rule" as const,
  },
  {
    id: "bmi-50",
    rule: "BMI ≥50 genel sayısal hedef durdurma",
    evidence: "supported" as const,
    decision: "acceptable-safety-rule" as const,
  },
] as const satisfies readonly {
  id: string;
  rule: string;
  evidence: EnergyEvidenceStrength;
  decision: EnergyScientificDecision;
}[];
