import { BookOpen, ExternalLink, FlaskConical, ShieldCheck } from "lucide-react";

const accordionItems = [
  {
    title: "1. Bakım tahmini",
    content: (
      <div className="space-y-3">
        <p>
          Ana motor, NASEM 2023 yetişkin Tahmini Enerji Gereksinimi (Estimated Energy Requirement / EER) denklemlerini kullanır. Denklem; yaş, biyolojik
          cinsiyet, boy, kilo ve seçilen toplam yaşam aktivitesi kategorisini birlikte
          değerlendirir. EER, ağırlığı stabil yetişkinlerde toplam enerji harcaması için bir
          başlangıç tahminidir; kilo verme veya alma reçetesi olarak geliştirilmemiştir.
        </p>
        <p>
          İç hesap tam hassasiyetle yapılır; görünür sonuç en yakın 50 kcal’ye yuvarlanır.
          Rapordaki bireysel tahmin standart hatası (Standard Error of Prediction for an Individual / SEPV) kadınlarda yaklaşık 241,
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
          Dört profil NASEM’in hareketsiz (inactive), düşük aktif (low active), aktif (active) ve çok aktif (very active) kategorilerine
          karşılık gelir. Bu seçim yaklaşık bir öz sınıflamadır; bireyi doğru Fiziksel Aktivite Düzeyi (Physical Activity Level / PAL) sınıfına
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
        Mifflin–St Jeor sonucu yalnız ikincil Dinlenme Metabolizma Hızı (Resting Metabolic Rate / RMR) bilgisidir. Ana bakım tahmini Mifflin sonucunun
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
    title: "6. Kullanılmayan yöntemler",
    content: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Klasik “haftada kaç gün spor” aktivite çarpanları</li>
        <li>Akıllı saat kalorisini günlük hedefe ekleme</li>
        <li>7.700 kcal = 1 kg geri hesabı</li>
        <li>Haftalık veya aylık kesin kilo değişimi tahmini</li>
        <li>Serbest kalori kaydırıcısı (slider) ve otomatik ±100/200 kcal emirleri</li>
      </ul>
    ),
  },
] as const;

const references = [
  {
    label:
      "Enerji için Beslenme Referans Alımları (Dietary Reference Intakes for Energy) — National Academies of Sciences, Engineering, and Medicine. 2023. doi:10.17226/26818.",
    href: "https://www.ncbi.nlm.nih.gov/books/NBK588659/",
    supports:
      "19+ yetişkin EER denklemleri, PAL belirsizliği, ağırlık stabilitesi varsayımı ve SEPV değerleri.",
  },
  {
    label:
      "Sağlıklı bireylerde dinlenme enerji harcaması için yeni tahmin denklemi (A New Predictive Equation for Resting Energy Expenditure in Healthy Individuals) — Mifflin MD, St Jeor ST, Hill LA, et al. Am J Clin Nutr. 1990;51(2):241–247. doi:10.1093/ajcn/51.2.241.",
    href: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
    supports: "Yalnız ikincil RMR gösterimi; orijinal örneklem 19–78 yaş.",
  },
  {
    label:
      "Direnç antrenmanlı bireylerde küçük ve büyük enerji fazlalarının etkisi (Effect of Small and Large Energy Surpluses in Resistance-Trained Individuals) — Helms ER, Spence AJ, Sousa C, et al. Sports Med Open. 2023;9:102. doi:10.1186/s40798-023-00651-y.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10620361/",
    supports:
      "Büyük fazlanın daha fazla deri kıvrımı artışıyla ilişkisini destekler; +%5’i evrensel optimum olarak doğrulamaz.",
  },
  {
    label:
      "Giyilebilir cihazlarla fiziksel aktivite enerji harcaması tahmini (Wearable Devices for Estimating Physical Activity Energy Expenditure) — Murakami H, Kawakami R, Nakae S, et al. JMIR Mhealth Uhealth. 2019;7(8):e13938. doi:10.2196/13938.",
    href: "https://pubmed.ncbi.nlm.nih.gov/31376273/",
    supports: "Giyilebilir cihaz (wearable) kalori tahminlerinin günlük hedefe doğrudan eklenmemesi kararı.",
  },
  {
    label:
      "Enerji eksikliği direnç antrenmanındaki yağsız kütle kazanımını bozar (Energy Deficiency Impairs Resistance Training Gains in Lean Mass) — Murphy C, Koehler K. Scand J Med Sci Sports. 2022;32(1):125–137. doi:10.1111/sms.14075.",
    href: "https://pubmed.ncbi.nlm.nih.gov/34623696/",
    supports:
      "Enerji açığı ve yağsız kütle bağlamı; BMI/%10/%15/%20 ve 500/750 kcal ürün eşiklerini doğrulamaz.",
  },
] as const;

export default function EnergyLabMethodology() {
  return (
    <section
      id="bilimsel-kaynaklar"
      aria-labelledby="methodology-title"
      className="border-t border-[#11283a]/10 bg-[#f4f1e9] px-5 py-10 text-[#102536] sm:px-6 sm:py-14"
    >
      <div className="mx-auto max-w-5xl">
        <details className="group rounded-2xl border border-[#11283a]/10 bg-[#fbfaf6] p-5 shadow-[0_10px_35px_rgba(17,40,58,.04)] open:border-[#9f7b38]/30 sm:p-7">
          <summary className="cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-[#9f7b38]/25 bg-[#efe5d0] text-[#8c6a2d]">
                <FlaskConical aria-hidden="true" className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8c6a2d]">
                  Şeffaf yöntem
                </p>
                <h2 id="methodology-title" className="mt-1 text-xl font-semibold sm:text-2xl">
                  Yöntem ve bilimsel kaynaklar
                </h2>
              </div>
              <span aria-hidden="true" className="text-2xl text-[#8c6a2d] group-open:rotate-45">+</span>
            </div>
          </summary>

          <div className="mt-6 border-t border-[#11283a]/10 pt-6">
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#11283a]/10 bg-[#fbfaf6] p-5">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#8c6a2d]" />
              <p className="text-sm leading-7 text-[#596a77]">
                Form girdileri ve kapsam seçimi yalnız bu sayfadaki geçici hesap için kullanılır;
                URL’ye, tarayıcı depolamasına veya analiz hizmetine (analytics) yazılmaz ve sunucuya gönderilmez.
              </p>
            </div>
            <div className="mt-5 space-y-3">
            {accordionItems.map((item) => (
              <details
                key={item.title}
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
                  7. Bilimsel kaynaklar
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
                    uygulanır. Repoda “geçer (PASS)” olarak işaretlenmiş araştırma paketi bulunmadığı için
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
        </details>
      </div>
    </section>
  );
}
