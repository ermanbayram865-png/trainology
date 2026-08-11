import { BookOpen, ExternalLink, FlaskConical, ShieldCheck } from "lucide-react";

const accordionItems = [
  {
    title: "1. Bakım tahmini",
    content: (
      <div className="space-y-3">
        <p>
          Ana motor, NASEM 2023 yetişkin EER denklemlerini kullanır. Denklem; yaş, biyolojik
          cinsiyet, boy, kilo ve seçilen toplam yaşam aktivitesi kategorisini birlikte
          değerlendirir. EER, ağırlığı stabil yetişkinlerde toplam enerji harcaması için bir
          başlangıç tahminidir; kilo verme veya alma reçetesi olarak geliştirilmemiştir.
        </p>
        <p>
          İç hesap tam hassasiyetle yapılır; görünür sonuç en yakın 50 kcal’ye yuvarlanır.
          Rapordaki bireysel tahmin standart hatası (SEPV) kadınlarda yaklaşık 241,
          erkeklerde 342 kcal/gündür; bunlar güven aralığı değildir.
        </p>
      </div>
    ),
  },
  {
    title: "2. Aktivite değerlendirmesi",
    content: (
      <div className="space-y-3">
        <p>
          Dört profil NASEM’in inactive, low active, active ve very active kategorilerine
          karşılık gelir. Bu seçim yaklaşık bir öz sınıflamadır; bireyi doğru PAL sınıfına
          güvenilir biçimde atayan doğrulanmış tekil bir araç yoktur ve bu sınıflar fiziksel
          aktivite sağlık kılavuzu kategorileri değildir.
        </p>
        <p>
          Antrenman günü, adım sayısı veya akıllı saat kalorisi doğrudan PAL katsayısına
          çevrilmez. İki komşu profil seçildiğinde iki denklem ayrı ayrı çalışır.
        </p>
      </div>
    ),
  },
  {
    title: "3. Dinlenme enerjisi",
    content: (
      <p>
        Mifflin–St Jeor sonucu yalnız ikincil RMR bilgisidir. Ana bakım tahmini Mifflin sonucunun
        klasik aktivite çarpanıyla çoğaltılmasından üretilmez.
      </p>
    ),
  },
  {
    title: "4. Belirsizlik",
    content: (
      <p>
        Sonuç laboratuvar ölçümü değil, başlangıç tahminidir. İki aktivite profilinin oluşturduğu
        bant da istatistiksel güven aralığı değildir; iki olası yaşam profilinin ayrı senaryolarını
        gösterir.
      </p>
    ),
  },
  {
    title: "5. Hedef seçenekleri",
    content: (
      <div className="space-y-3">
        <p>
          Yağ kaybındaki %10, %15 ve koşullu %20 seçenekleri başlangıç enerji açıklarıdır. BMI ve
          performans bağlamına göre 500/750 kcal açık tavanları uygulanır. Bunlar “kanıtlanmış
          optimum” oranlar olarak sunulmaz.
        </p>
        <p>
          Kas kazanımındaki +%5, optimum olduğu kanıtlanmış bir oran değil; küçük ve kontrollü bir
          başlangıç senaryosudur. Bakım çevresinde başlama seçeneği her zaman ayrıca gösterilir.
        </p>
      </div>
    ),
  },
  {
    title: "6. Trend kalibrasyonu",
    content: (
      <div className="space-y-3">
        <p>
          Yalnız son 28 takvim günlük pencere değerlendirilir. En az 14 geçerli günlük kayıt
          ilk trendi; pencerenin 28 gününün tamamlanması daha güçlü veri aşamasını açar.
          Düzensiz biçimde aylara yayılan 28 kayıt “yeterli” sayılmaz.
        </p>
        <p>
          İlk ve son yedi takvim günü ortalamalarını karşılaştıran 14/28 gün kuralı bir
          ürün sezgisidir; Hall ve Chow çalışmasının doğruladığı klinik eşik değildir.
          Kayıtlar belirli bir tahmin başlangıcına veya enerji alımına bağlanmadığı için
          gerçek TDEE ya da kalori farkı geri hesaplanmaz ve otomatik hedef değişikliği yapılmaz.
        </p>
      </div>
    ),
  },
  {
    title: "7. Kullanılmayan yöntemler",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Klasik “haftada kaç gün spor” aktivite çarpanları</li>
        <li>Akıllı saat kalorisini günlük hedefe ekleme</li>
        <li>7.700 kcal = 1 kg geri hesabı</li>
        <li>Haftalık veya aylık kesin kilo değişimi tahmini</li>
        <li>Serbest kalori slider’ı ve otomatik ±100/200 kcal emirleri</li>
      </ul>
    ),
  },
] as const;

const references = [
  {
    label:
      "National Academies of Sciences, Engineering, and Medicine. Dietary Reference Intakes for Energy. 2023. doi:10.17226/26818.",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK588659/",
    supports:
      "19+ yetişkin EER denklemleri, PAL belirsizliği, ağırlık stabilitesi varsayımı ve SEPV değerleri.",
  },
  {
    label:
      "Mifflin MD, St Jeor ST, Hill LA, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241–247. doi:10.1093/ajcn/51.2.241.",
    href: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
    supports: "Yalnız ikincil RMR gösterimi; orijinal örneklem 19–78 yaş.",
  },
  {
    label:
      "Hall KD, Chow CC. Estimating changes in free-living energy intake and its confidence interval. Am J Clin Nutr. 2011;94(1):66–74. doi:10.3945/ajcn.111.014399.",
    href: "https://pubmed.ncbi.nlm.nih.gov/21562087/",
    supports:
      "Günlük boylamsal kilo verisinin değerini destekler; Energy Lab’in 14/28 gün sezgisini veya ilk/son yedi kuralını doğrulamaz.",
  },
  {
    label:
      "Helms ER, Spence AJ, Sousa C, et al. Effect of Small and Large Energy Surpluses on Strength, Muscle, and Skinfold Thickness in Resistance-Trained Individuals: A Parallel Groups Design. Sports Med Open. 2023;9:102. doi:10.1186/s40798-023-00651-y.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10620361/",
    supports:
      "Büyük fazlanın daha fazla deri kıvrımı artışıyla ilişkisini destekler; +%5’i evrensel optimum olarak doğrulamaz.",
  },
  {
    label:
      "Murakami H, Kawakami R, Nakae S, et al. Accuracy of 12 Wearable Devices for Estimating Physical Activity Energy Expenditure Using a Metabolic Chamber and the Doubly Labeled Water Method: Validation Study. JMIR Mhealth Uhealth. 2019;7(8):e13938. doi:10.2196/13938.",
    href: "https://pubmed.ncbi.nlm.nih.gov/31376273/",
    supports: "Wearable kalori tahminlerinin günlük hedefe doğrudan eklenmemesi kararı.",
  },
  {
    label:
      "Murphy C, Koehler K. Energy deficiency impairs resistance training gains in lean mass but not strength: A meta-analysis and meta-regression. Scand J Med Sci Sports. 2022;32(1):125–137. doi:10.1111/sms.14075.",
    href: "https://pubmed.ncbi.nlm.nih.gov/34623696/",
    supports:
      "Enerji açığı ve yağsız kütle bağlamı; BMI/%10/%15/%20 ve 500/750 kcal ürün eşiklerini doğrulamaz.",
  },
] as const;

export default function EnergyLabMethodology() {
  return (
    <section
      id="nasil-hesaplandi"
      aria-labelledby="methodology-title"
      className="bg-[#f4f1e9] px-6 py-20 text-[#102536] sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-[#9f7b38]/25 bg-[#efe5d0] text-[#8c6a2d]">
              <FlaskConical aria-hidden="true" className="size-5" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-[#8c6a2d]">
              Şeffaf yöntem
            </p>
            <h2 id="methodology-title" className="mt-4 text-4xl font-semibold sm:text-5xl">
              Nasıl hesaplandı?
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#596a77]">
              Energy Lab hangi yöntemleri kullandığını, hangilerini bilinçli olarak kullanmadığını
              ve tahminin nerede sınırlandığını açıklar.
            </p>
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#11283a]/10 bg-[#fbfaf6] p-5">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#8c6a2d]" />
              <p className="text-sm leading-7 text-[#596a77]">
                Sağlık ve kapsam cevapları yalnız o anki kontrol için kullanılır; URL’ye,
                localStorage’a veya analytics’e yazılmaz.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {accordionItems.map((item, index) => (
              <details
                key={item.title}
                open={index === 0}
                className="group rounded-2xl border border-[#11283a]/10 bg-[#fbfaf6] p-5 shadow-[0_10px_35px_rgba(17,40,58,.04)] open:border-[#9f7b38]/30 sm:p-6"
              >
                <summary className="cursor-pointer list-none pr-8 text-base font-bold text-[#102536] marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.title}
                    <span
                      aria-hidden="true"
                      className="text-xl font-light text-[#8c6a2d] transition-transform group-open:rotate-45 motion-reduce:transition-none"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <div className="mt-4 border-t border-[#11283a]/10 pt-4 text-sm leading-7 text-[#596a77]">
                  {item.content}
                </div>
              </details>
            ))}

            <details className="group rounded-2xl border border-[#11283a]/10 bg-[#fbfaf6] p-5 shadow-[0_10px_35px_rgba(17,40,58,.04)] open:border-[#9f7b38]/30 sm:p-6">
              <summary className="cursor-pointer list-none pr-8 text-base font-bold text-[#102536] marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  8. Bilimsel kaynaklar
                  <span
                    aria-hidden="true"
                    className="text-xl font-light text-[#8c6a2d] transition-transform group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </span>
              </summary>
              <div className="mt-4 border-t border-[#11283a]/10 pt-5">
                <div className="flex items-start gap-3 rounded-xl border border-[#9f7b38]/20 bg-[#efe5d0]/60 p-4 text-sm leading-6 text-[#604c28]">
                  <BookOpen aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  <p>
                    Yağ kaybı yüzdeleri ve 500/750 kcal tavanları sağlanan ürün politikasına göre
                    uygulanır. Repoda “PASS” olarak işaretlenmiş araştırma paketi bulunmadığı için
                    bu eşikler kanıtlanmış optimum oranlar olarak kaynaklandırılmaz.
                  </p>
                </div>
                <ol className="mt-5 space-y-4">
                  {references.map((reference, index) => (
                    <li key={reference.href} className="flex gap-3 text-sm leading-7 text-[#596a77]">
                      <span className="font-mono text-xs font-bold text-[#8c6a2d]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <a
                          href={reference.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group/link underline decoration-[#9f7b38]/30 underline-offset-4 transition hover:text-[#102536] hover:decoration-[#9f7b38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38]"
                        >
                          {reference.label}
                          <ExternalLink
                            aria-hidden="true"
                            className="ml-1 inline size-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 motion-reduce:transform-none"
                          />
                        </a>
                        <p className="mt-1 text-xs leading-6 text-[#74818b]">
                          Bu üründe desteklediği karar: {reference.supports}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}
