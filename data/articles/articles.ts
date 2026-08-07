import type { Article, ArticleCategory } from "@/lib/articles/types";

const image = "/images/hero/molecule.png";

type PublishingMetadata = Pick<
  Article,
  "publishedDate" | "updatedDate" | "readingTime" | "author" | "reviewedBy" | "faq"
>;

type ArticleSeed = Omit<Article, keyof PublishingMetadata>;

const publishingMetadata: Record<ArticleCategory, PublishingMetadata> = {
  "Training Science": {
    publishedDate: "2026-08-07",
    updatedDate: "2026-08-07",
    readingTime: "5 dk",
    author: "Trainology Editoryal Ekibi",
    reviewedBy: "Trainology Bilimsel İnceleme Ekibi",
    faq: [
      {
        question: "Bu yaklaşım her seviyeye uygun mu?",
        answer: "Uygulama düzeyi deneyim, hedef, teknik yeterlilik ve toparlanma kapasitesine göre değişir.",
      },
      {
        question: "Tek bir yöntem yeterli mi?",
        answer: "Antrenman kararları yük, hacim, teknik, toparlanma ve kişisel koşullarla birlikte değerlendirilmelidir.",
      },
    ],
  },
  "Nutrition Science": {
    publishedDate: "2026-08-07",
    updatedDate: "2026-08-07",
    readingTime: "4 dk",
    author: "Trainology Editoryal Ekibi",
    reviewedBy: "Trainology Bilimsel İnceleme Ekibi",
    faq: [
      {
        question: "Bu bilgi kişisel plan yerine geçer mi?",
        answer: "Hayır. Genel bilimsel çerçeve sunar; kişisel gereksinimler sağlık durumu ve hedeflere göre değişebilir.",
      },
      {
        question: "Hesaplayıcı sonuçları kesin midir?",
        answer: "Hesaplayıcılar başlangıç tahmini sunar ve kişisel takip ile gerektiğinde uzman görüşüyle değerlendirilmelidir.",
      },
    ],
  },
  "Supplement Science": {
    publishedDate: "2026-08-07",
    updatedDate: "2026-08-07",
    readingTime: "4 dk",
    author: "Trainology Editoryal Ekibi",
    reviewedBy: "Trainology Bilimsel İnceleme Ekibi",
    faq: [
      {
        question: "Supplement kullanımı gerekli midir?",
        answer: "Gereklilik; beslenme düzeni, hedefler, sağlık durumu ve kişisel koşullara göre değişir.",
      },
      {
        question: "Bu içerik sağlık önerisi midir?",
        answer: "Hayır. İçerik eğitim amaçlıdır; mevcut sağlık durumu veya ilaç kullanımı için sağlık uzmanına danışılmalıdır.",
      },
    ],
  },
  "Movement Science": {
    publishedDate: "2026-08-07",
    updatedDate: "2026-08-07",
    readingTime: "4 dk",
    author: "Trainology Editoryal Ekibi",
    reviewedBy: "Trainology Bilimsel İnceleme Ekibi",
    faq: [
      {
        question: "Hareket seçimi nasıl yapılır?",
        answer: "Hedef, deneyim, ekipman erişimi, hareket kapasitesi ve teknik güvenlik birlikte değerlendirilmelidir.",
      },
      {
        question: "Teknik için profesyonel destek gerekir mi?",
        answer: "Yeni veya karmaşık hareketlerde nitelikli geri bildirim, teknik öğrenmeyi ve güvenliği destekleyebilir.",
      },
    ],
  },
};

const articleSeeds: readonly ArticleSeed[] = [
  {
    id: "progressive-overload",
    title: "Progressive Overload Nedir?",
    slug: "progressive-overload",
    category: "Training Science",
    evidenceLevel: "Strong Evidence",
    summary: "Antrenman uyaranını zaman içinde planlı biçimde artırma yaklaşımını açıklar.",
    content: [
      "Progressive overload, vücudun mevcut kapasitesine göre yeterli bir antrenman uyaranı oluşturmayı ve bu uyaranı zaman içinde düzenlemeyi ifade eder.",
      "Yük artışı yalnızca kullanılan ağırlıkla sınırlı değildir. Tekrar sayısı, set hacmi, hareket açıklığı, teknik kalitesi ve toparlanma koşulları birlikte değerlendirilmelidir.",
      "Uygun ilerleme kişisel antrenman geçmişi, hedef, teknik yeterlilik ve toparlanma kapasitesine göre planlanır.",
    ],
    sources: [
      "American College of Sports Medicine. Progression Models in Resistance Training for Healthy Adults.",
      "Schoenfeld BJ. The mechanisms of muscle hypertrophy and their application to resistance training.",
    ],
    relatedTools: ["/calculators/1rm", "/movements"],
    image,
  },
  {
    id: "protein-powder",
    title: "Protein Tozu Ne Zaman Değerlendirilebilir?",
    slug: "protein-tozu",
    category: "Nutrition Science",
    evidenceLevel: "Moderate Evidence",
    summary: "Protein tozunun beslenme düzenindeki yerini ve sınırlarını bilimsel bağlamıyla ele alır.",
    content: [
      "Protein tozu, günlük protein hedefini besinlerle karşılamak zor olduğunda pratik bir seçenek olarak değerlendirilebilir.",
      "Kas gelişimi ve toparlanma açısından toplam günlük protein alımı, tek bir ürünün kullanımından daha belirleyici bir faktördür.",
      "Ürün seçimi; içerik kalitesi, kişisel tolerans, beslenme düzeni ve gerektiğinde sağlık uzmanı görüşüyle birlikte değerlendirilmelidir.",
    ],
    sources: [
      "International Society of Sports Nutrition position stand: protein and exercise.",
      "Academy of Nutrition and Dietetics, Dietitians of Canada, and ACSM: Nutrition and Athletic Performance.",
    ],
    relatedTools: ["/calculators/protein", "/calculators/macro"],
    image,
  },
  {
    id: "creatine-guide",
    title: "Kreatin Rehberi",
    slug: "creatine",
    category: "Supplement Science",
    evidenceLevel: "Strong Evidence",
    summary: "Kreatin monohidratın performans bağlamındaki kullanımını ve dikkat noktalarını özetler.",
    content: [
      "Kreatin monohidrat, yüksek yoğunluklu ve tekrar eden efor kapasitesi bağlamında en fazla araştırılmış supplementlerden biridir.",
      "Direnç antrenmanı ile birlikte bazı bireylerde kuvvet ve yağsız kütle kazanımlarını destekleyebilir; sonuçlar antrenman ve beslenme koşullarına göre değişir.",
      "Kullanım kararı kişisel sağlık durumu, hedefler ve ürün kalitesi dikkate alınarak verilmelidir.",
    ],
    sources: [
      "International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation.",
      "Kreider RB et al. Common questions and misconceptions about creatine supplementation.",
    ],
    relatedTools: ["/calculators/1rm", "/supplements/creatine-monohydrate"],
    image,
  },
  {
    id: "rir",
    title: "RIR Nedir?",
    slug: "rir-nedir",
    category: "Training Science",
    evidenceLevel: "Moderate Evidence",
    summary: "Tekrar rezervi yaklaşımının set zorluğunu planlamada nasıl kullanılabileceğini açıklar.",
    content: [
      "RIR (repetitions in reserve), bir set sonunda teknik olarak yapılabilecek tahmini tekrar sayısını ifade eder.",
      "Yük seçimi ve set zorluğunu değerlendirmeye yardımcı olabilir; tahmin doğruluğu deneyim, egzersiz türü ve yorgunluktan etkilenir.",
      "RIR, teknik kalitesini ve toparlanmayı göz önünde bulunduran bir antrenman planının tek başına yerine geçmez.",
    ],
    sources: [
      "Zourdos MC et al. Novel resistance training-specific rating of perceived exertion scale measuring repetitions in reserve.",
      "Helms ER et al. RPE and RIR-based resistance training research.",
    ],
    relatedTools: ["/calculators/1rm"],
    image,
  },
  {
    id: "rpe",
    title: "RPE Nedir?",
    slug: "rpe-nedir",
    category: "Training Science",
    evidenceLevel: "Moderate Evidence",
    summary: "Algılanan eforun antrenman şiddetini bireyselleştirmedeki rolünü ele alır.",
    content: [
      "RPE (rating of perceived exertion), bir setin veya antrenmanın ne kadar zor hissedildiğini yapılandırılmış biçimde tanımlamaya yarar.",
      "Günlük performans değişikliklerinde yükü ayarlamaya yardımcı olabilir; objektif performans verileri ve teknik gözlemle birlikte kullanılması uygundur.",
      "RPE puanı kişisel algıya dayanır; farklı kişiler arasında doğrudan karşılaştırma için tek başına yeterli değildir.",
    ],
    sources: [
      "Borg G. Borg's Perceived Exertion and Pain Scales.",
      "Helms ER et al. RPE-based load autoregulation in resistance training.",
    ],
    relatedTools: ["/calculators/1rm"],
    image,
  },
  {
    id: "failure-training",
    title: "Failure Training Nedir?",
    slug: "failure-training",
    category: "Training Science",
    evidenceLevel: "Moderate Evidence",
    summary: "Kas başarısızlığına kadar çalışmanın olası fayda ve sınırlamalarını açıklar.",
    content: [
      "Failure training, bir tekrarın uygun teknikle tamamlanamadığı noktaya kadar yapılan setleri ifade eder.",
      "Bazı bağlamlarda yeterli uyaran sağlayabilir; ancak her seti başarısızlığa götürmek toparlanma maliyetini artırabilir.",
      "Hareket seçimi, teknik güvenlik, deneyim seviyesi ve toplam hacim kararın bağlamını belirler.",
    ],
    sources: [
      "Grgic J et al. Effects of resistance training performed to repetition failure or non-failure on muscular strength and hypertrophy.",
      "American College of Sports Medicine resistance training guidance.",
    ],
    relatedTools: ["/calculators/1rm", "/movements"],
    image,
  },
  {
    id: "training-volume",
    title: "Antrenman Hacmi Nedir?",
    slug: "antrenman-hacmi",
    category: "Training Science",
    evidenceLevel: "Strong Evidence",
    summary: "Set, tekrar ve yük ilişkisinin antrenman planındaki yerini özetler.",
    content: [
      "Antrenman hacmi; set, tekrar ve kullanılan yük gibi bileşenlerle tanımlanabilen toplam çalışma miktarıdır.",
      "Uygun hacim hedefe, antrenman yaşına, egzersiz seçimine ve toparlanma kapasitesine göre değişir.",
      "Hacmi artırmak tek başına daha iyi sonuç garantilemez; ilerleme teknik kalite ve sürdürülebilirlikle değerlendirilmelidir.",
    ],
    sources: [
      "Schoenfeld BJ et al. Dose-response relationship between weekly resistance training volume and increases in muscle mass.",
      "ACSM resistance training prescription guidance.",
    ],
    relatedTools: ["/calculators/1rm", "/movements"],
    image,
  },
  {
    id: "protein-needs",
    title: "Protein İhtiyacı Nasıl Değerlendirilir?",
    slug: "protein-ihtiyaci",
    category: "Nutrition Science",
    evidenceLevel: "Strong Evidence",
    summary: "Toplam günlük protein alımının hedef, aktivite ve beslenme düzeniyle ilişkisini açıklar.",
    content: [
      "Protein gereksinimi aktivite düzeyi, hedef, enerji alımı ve bireysel özelliklere göre değişir.",
      "Egzersiz yapan kişilerde toplam günlük protein alımı, öğün dağılımı ve genel beslenme kalitesi birlikte değerlendirilir.",
      "Hesaplayıcı sonuçları başlangıç tahmini sunar; özel sağlık durumlarında uzman değerlendirmesi gerekir.",
    ],
    sources: [
      "International Society of Sports Nutrition position stand: protein and exercise.",
      "Morton RW et al. Protein supplementation and resistance training adaptations meta-analysis.",
    ],
    relatedTools: ["/calculators/protein", "/calculators/macro"],
    image,
  },
  {
    id: "calorie-balance",
    title: "Kalori Dengesi Nedir?",
    slug: "kalori-dengesi",
    category: "Nutrition Science",
    evidenceLevel: "Strong Evidence",
    summary: "Enerji alımı ve harcamasının vücut ağırlığı değişimindeki temel rolünü ele alır.",
    content: [
      "Kalori dengesi, besinlerden alınan enerji ile günlük enerji harcaması arasındaki ilişkiyi ifade eder.",
      "Vücut ağırlığı değişimleri yalnızca tek bir günün hesabıyla değil, zaman içindeki enerji dengesi ve uyumla değerlendirilir.",
      "Uyku, aktivite, iştah, sağlık durumu ve ölçüm belirsizlikleri kişisel sonuçları etkileyebilir.",
    ],
    sources: [
      "Hall KD et al. Energy balance and its components: implications for body weight regulation.",
      "American College of Sports Medicine nutrition guidance.",
    ],
    relatedTools: ["/calculators/calorie", "/calculators/macro"],
    image,
  },
  {
    id: "bulk-cut",
    title: "Bulk ve Cut Dönemleri",
    slug: "bulk-cut",
    category: "Nutrition Science",
    evidenceLevel: "Moderate Evidence",
    summary: "Kas kazanımı ve yağ kaybı dönemlerinde enerji alımını planlama yaklaşımını açıklar.",
    content: [
      "Bulk dönemi, kas kazanımı hedefiyle enerji alımının planlı biçimde artırıldığı bir yaklaşım olarak kullanılabilir.",
      "Cut dönemi, yağ kaybı hedefiyle enerji açığı oluşturmayı içerir; performans ve toparlanma takip edilmelidir.",
      "Dönem uzunluğu ve enerji değişimi kişisel hedeflere, vücut kompozisyonuna ve antrenman durumuna göre ayarlanır.",
    ],
    sources: [
      "Iraki J et al. Nutrition recommendations for bodybuilders in the off-season.",
      "Helms ER et al. Evidence-based recommendations for bodybuilding contest preparation.",
    ],
    relatedTools: ["/calculators/calorie", "/calculators/macro", "/calculators/protein"],
    image,
  },
  {
    id: "carbohydrates-role",
    title: "Karbonhidratların Rolü",
    slug: "karbonhidratlarin-rolu",
    category: "Nutrition Science",
    evidenceLevel: "Strong Evidence",
    summary: "Karbonhidratların antrenman hacmi, performans ve enerji erişilebilirliğiyle ilişkisini özetler.",
    content: [
      "Karbonhidratlar, özellikle uzun süreli veya yüksek hacimli egzersizlerde enerji gereksiniminin karşılanmasında rol oynar.",
      "İhtiyaç; antrenman türü, süresi, yoğunluğu ve toplam enerji alımına göre farklılaşır.",
      "Karbonhidrat seçimi ve zamanlaması kişisel tolerans, tercih ve antrenman bağlamıyla birlikte değerlendirilmelidir.",
    ],
    sources: [
      "Burke LM et al. Carbohydrates for training and competition.",
      "ACSM, Academy of Nutrition and Dietetics, Dietitians of Canada: Nutrition and Athletic Performance.",
    ],
    relatedTools: ["/calculators/macro", "/calculators/calorie"],
    image,
  },
  {
    id: "dietary-fats-role",
    title: "Yağların Rolü",
    slug: "yaglarin-rolu",
    category: "Nutrition Science",
    evidenceLevel: "Strong Evidence",
    summary: "Besinsel yağların enerji, temel yağ asitleri ve genel beslenme düzenindeki yerini ele alır.",
    content: [
      "Besinsel yağlar enerji sağlar ve bazı temel yağ asitleri ile yağda çözünen vitaminlerin alımında rol oynar.",
      "Yağ alımı için uygun aralık, toplam enerji ihtiyacı, beslenme örüntüsü ve kişisel tercih ile birlikte değerlendirilir.",
      "Tek bir makro dağılımı her kişi için ideal değildir; sürdürülebilirlik ve besin kalitesi önemlidir.",
    ],
    sources: [
      "Institute of Medicine. Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids.",
      "ACSM nutrition and athletic performance guidance.",
    ],
    relatedTools: ["/calculators/macro", "/calculators/calorie"],
    image,
  },
  {
    id: "whey-protein",
    title: "Whey Protein",
    slug: "whey-protein",
    category: "Supplement Science",
    evidenceLevel: "Moderate Evidence",
    summary: "Whey proteinin günlük protein alımını tamamlamadaki pratik rolünü açıklar.",
    content: [
      "Whey protein, yüksek kaliteli protein alımını pratik biçimde desteklemek için kullanılan bir süt proteini kaynağıdır.",
      "Antrenman adaptasyonları için toplam günlük protein alımı ve direnç antrenmanı programı temel belirleyicilerdir.",
      "Laktoz toleransı, ürün içeriği ve kişisel beslenme tercihleri kullanım kararında dikkate alınmalıdır.",
    ],
    sources: [
      "International Society of Sports Nutrition position stand: protein and exercise.",
      "Morton RW et al. Protein supplementation and resistance training adaptations meta-analysis.",
    ],
    relatedTools: ["/calculators/protein", "/calculators/macro"],
    image,
  },
  {
    id: "caffeine-guide",
    title: "Caffeine",
    slug: "caffeine",
    category: "Supplement Science",
    evidenceLevel: "Strong Evidence",
    summary: "Kafeinin egzersiz performansı bağlamındaki etkilerini ve bireysel toleransı ele alır.",
    content: [
      "Kafein bazı egzersiz türlerinde performansı destekleyebilir; yanıt kişiden kişiye anlamlı biçimde değişebilir.",
      "Uyku, kaygı, zamanlama ve toplam günlük alım, kullanım kararında dikkate alınması gereken başlıca faktörlerdir.",
      "Sağlık durumu, ilaç kullanımı veya hassasiyet durumlarında profesyonel görüş alınmalıdır.",
    ],
    sources: [
      "International Society of Sports Nutrition position stand: caffeine and exercise performance.",
      "Guest NS et al. Caffeine and exercise performance.",
    ],
    relatedTools: ["/calculators/1rm"],
    image,
  },
  {
    id: "omega-3-guide",
    title: "Omega-3",
    slug: "omega-3",
    category: "Supplement Science",
    evidenceLevel: "Moderate Evidence",
    summary: "Omega-3 yağ asitlerinin beslenme ve supplement bağlamında nasıl değerlendirilebileceğini açıklar.",
    content: [
      "Omega-3 yağ asitleri besinlerde ve takviyelerde bulunur; ürünlerin EPA ve DHA içeriği farklılaşabilir.",
      "Takviye kullanımı, temel beslenme düzeninin yerine geçmez ve kişisel sağlık bağlamında değerlendirilmelidir.",
      "Kan sulandırıcı kullanımı veya özel sağlık durumlarında sağlık uzmanı görüşü önemlidir.",
    ],
    sources: [
      "NIH Office of Dietary Supplements. Omega-3 Fatty Acids Fact Sheet.",
      "American Heart Association scientific advisories on omega-3 fatty acids.",
    ],
    relatedTools: ["/supplements/omega-3"],
    image,
  },
  {
    id: "vitamin-d-guide",
    title: "Vitamin D",
    slug: "vitamin-d",
    category: "Supplement Science",
    evidenceLevel: "Moderate Evidence",
    summary: "Vitamin D durumunun ölçüm, beslenme ve sağlık bağlamında değerlendirilmesini ele alır.",
    content: [
      "Vitamin D, kemik sağlığı ve diğer fizyolojik süreçlerle ilişkilidir; kişisel durum kan testi ve klinik bağlamla değerlendirilir.",
      "Takviye gereksinimi, güneş maruziyeti, beslenme, yaş ve sağlık koşullarına göre farklılaşabilir.",
      "Rastgele yüksek doz kullanımından kaçınılmalı ve eksiklik şüphesinde sağlık uzmanına başvurulmalıdır.",
    ],
    sources: [
      "NIH Office of Dietary Supplements. Vitamin D Fact Sheet.",
      "Endocrine Society clinical practice guidance on vitamin D.",
    ],
    relatedTools: ["/supplements"],
    image,
  },
  {
    id: "range-of-motion",
    title: "ROM Nedir?",
    slug: "rom-nedir",
    category: "Movement Science",
    evidenceLevel: "Moderate Evidence",
    summary: "Hareket açıklığının egzersiz tekniği ve programlamadaki rolünü açıklar.",
    content: [
      "ROM (range of motion), bir eklemin veya hareketin uygulanabildiği açıklığı ifade eder.",
      "Uygun hareket açıklığı egzersiz, kişinin hareket kapasitesi, ekipman ve teknik güvenlik bağlamında değerlendirilir.",
      "Daha geniş veya daha kısa ROM her koşulda üstün değildir; hedefe uygun ve kontrollü uygulama önemlidir.",
    ],
    sources: [
      "American College of Sports Medicine resistance training guidance.",
      "Schoenfeld BJ, Grgic J. Effects of range of motion on muscle development and strength.",
    ],
    relatedTools: ["/movements", "/calculators/1rm"],
    image,
  },
  {
    id: "exercise-technique",
    title: "Egzersiz Tekniği",
    slug: "egzersiz-teknigi",
    category: "Movement Science",
    evidenceLevel: "Moderate Evidence",
    summary: "Teknik kalitesinin güvenlik, hedef kas grubu ve antrenman sürekliliğindeki rolünü ele alır.",
    content: [
      "Egzersiz tekniği; başlangıç pozisyonu, hareket yolu, tempo, kontrol ve hedefe uygun hareket açıklığı gibi unsurları kapsar.",
      "Yük ilerlemesi teknik kaliteyi bozuyorsa, yük veya hareket varyasyonu yeniden değerlendirilmelidir.",
      "Eğitim, geri bildirim ve uygun egzersiz seçimi teknik öğrenmeyi destekleyebilir.",
    ],
    sources: [
      "National Strength and Conditioning Association. Essentials of Strength Training and Conditioning.",
      "American College of Sports Medicine resistance training guidance.",
    ],
    relatedTools: ["/movements"],
    image,
  },
  {
    id: "machines-vs-free-weights",
    title: "Machines vs Free Weights",
    slug: "machines-vs-free-weights",
    category: "Movement Science",
    evidenceLevel: "Moderate Evidence",
    summary: "Makineler ve serbest ağırlıkların egzersiz seçimi içindeki farklı kullanım bağlamlarını karşılaştırır.",
    content: [
      "Makineler ve serbest ağırlıklar, program hedefi, deneyim, ekipman erişimi ve hareket tercihlerine göre farklı avantajlar sunabilir.",
      "Serbest ağırlıklar daha fazla denge ve koordinasyon gerektirebilir; makineler ise bazı hareketlerde daha kontrollü yükleme imkânı sağlayabilir.",
      "Etkili programlar tek bir ekipman türüne zorunlu olarak bağlı değildir; sürdürülebilir ve hedefe uygun seçimler önemlidir.",
    ],
    sources: [
      "American College of Sports Medicine resistance training guidance.",
      "Schick EE et al. A comparison of muscle activation between a Smith machine and free weight bench press.",
    ],
    relatedTools: ["/movements", "/calculators/1rm"],
    image,
  },
] as const;

export const articles: readonly Article[] = articleSeeds.map((article) => ({
  ...article,
  ...publishingMetadata[article.category],
}));

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
