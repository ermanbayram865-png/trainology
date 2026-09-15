import { BookOpen, ExternalLink, FlaskConical, ShieldCheck } from "lucide-react";

import { ENERGY_LAB_SOURCES, ENERGY_SCIENTIFIC_DECISIONS } from "@/lib/energy-lab";

const methodItems = [
  {
    title: "1. Günlük enerji ihtiyacı tahmini",
    content: (
      <>
        Hesaplama, NASEM 2023 yetişkin Tahmini Enerji Gereksinimi (EER) denklemlerini
        kullanır. Yaş, biyolojik cinsiyet, boy, kilo ve seçilen toplam yaşam aktivitesi aynı
        denklemde değerlendirilir. İç hesap tam hassasiyetle yapılır; yalnız görünür enerji
        sonuçları en yakın 50 kcal&apos;ye yuvarlanır.
      </>
    ),
  },
  {
    title: "2. Aktivite modeli",
    content: (
      <>
        Dört profil NASEM&apos;in inactive, low active, active ve very active PAL
        kategorilerine karşılık gelir. Seçim yaklaşık bir öz sınıflamadır; antrenman günü,
        adım veya giyilebilir cihaz kalorisi otomatik PAL katsayısına çevrilmez. Yan yana
        iki hareket düzeyi seçilirse iki denklem ayrı ayrı çalışır; arada değer üretilmez.
      </>
    ),
  },
  {
    title: "3. Dinlenme enerjisi",
    content: (
      <>
        Mifflin–St Jeor sonucu yalnız ikincil tahmini dinlenme enerjisi (RMR) bilgisidir.
        Günlük enerji ihtiyacı, RMR ile klasik bir aktivite çarpanının çarpılmasından üretilmez.
        Orijinal Mifflin örneklemi 19–78 yaşındadır; bu nedenle daha ileri yaşlarda RMR
        kartı gösterilmez.
      </>
    ),
  },
  {
    title: "4. Belirsizlik",
    content: (
      <>
        Sonuç laboratuvar ölçümü değil, başlangıç tahminidir. Denklem hatası, aktivite
        profilini seçme güçlüğü, günlük hareket değişimi ve kişisel metabolik farklılıklar
        gerçek ihtiyacı değiştirebilir. İki profilli bant istatistiksel güven aralığı değildir.
      </>
    ),
  },
  {
    title: "5. Kalori hedefleri ve güvenlik sınırları",
    content: (
      <div className="space-y-3">
        <p>
          Yağ kaybında günlük enerji ihtiyacı tahmininin %10&apos;u kadar açık, 500 kcal/gün ile sınırlandırılır.
          Bu, incelenmiş mütevazı enerji kısıtlaması ve direnç antrenmanı verilerinden
          yararlanan muhafazakâr bir başlangıç yaklaşımıdır; kişisel reçete değildir.
        </p>
        <p>
          Yuvarlama öncesindeki hedef 1.200 kcal/gün veya altında olduğunda sayısal sonucu
          durdurma, genel amaçlı ve gözetimsiz kullanım için koruyucu bir sınırdır; biyolojik minimum
          değildir. Bu karar görünür yuvarlamadan önce verilir. +%5 fazlalık küçük bir
          çalışmada incelenmiş başlangıç senaryosudur; kişisel sonuç öngörüsü değildir.
        </p>
      </div>
    ),
  },
  {
    title: "6. BMI ile ilgili kapsam sınırları",
    content: (
      <>
        BMI yalnız uygunluk ve kapsam yönlendirmesi için içeride hesaplanır; sonuç olarak
        gösterilmez ve enerji açığının büyüklüğünü belirlemez. WHO verisi BMI &lt;16 ve
        &lt;18,5 eşikleri için kapsam bağlamı sağlar. NASEM, BMI ≥50 için enerji dengesi ve
        harcaması verilerinde araştırma boşluğu bildirir. Bu eşikler tanı veya kişisel
        tedavi önerisi değildir.
      </>
    ),
  },
] as const;

const evidenceLabels = {
  supported: "Destekleniyor",
  "partially-supported": "Kısmen destekleniyor",
} as const;

const decisionLabels = {
  locked: "Hesaplamada kullanılır",
  "acceptable-safety-rule": "Güvenlik amacıyla kullanılır",
} as const;

export default function EnergyLabMethodology() {
  return (
    <section
      id="bilimsel-kaynaklar"
      aria-labelledby="methodology-title"
      className="border-t border-white/10 px-5 py-10 text-[#102536] sm:px-6 sm:py-14"
    >
      <div className="calculator-content">
        <details className="calculator-surface group p-5 open:border-[#9f7b38]/30 sm:p-7">
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
              <span aria-hidden="true" className="text-2xl text-[#8c6a2d] group-open:rotate-45">
                +
              </span>
            </div>
          </summary>

          <div className="mt-6 border-t border-[#11283a]/10 pt-6">
            <div className="flex items-start gap-3 rounded-2xl border border-[#11283a]/10 bg-white p-5">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#8c6a2d]" />
              <p className="text-sm leading-7 text-[#596a77]">
                Form girdileri yalnız bu sayfadaki geçici hesap için kullanılır; URL&apos;ye,
                tarayıcı depolamasına veya analiz hizmetine yazılmaz ve sunucuya gönderilmez.
                Yalnız kullanıcının seçtiği görünür kalori hedefi, isteğe bağlı Makro
                Planlayıcı bağlantısına eklenebilir.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {methodItems.map((item) => (
                <details
                  key={item.title}
                  className="group rounded-2xl border border-[#11283a]/10 bg-white p-5 open:border-[#9f7b38]/30 sm:p-6"
                >
                  <summary className="cursor-pointer list-none font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {item.title}
                      <span aria-hidden="true" className="text-xl text-[#8c6a2d] group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <div className="mt-4 border-t border-[#11283a]/10 pt-4 text-sm leading-7 text-[#596a77]">
                    {item.content}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[#9f7b38]/20 bg-[#efe5d0]/55 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <BookOpen aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#8c6a2d]" />
                <div>
                  <h3 className="font-bold">Kanıt ve kullanım özeti</h3>
                  <p className="mt-1 text-sm leading-6 text-[#665330]">
                    Bir yaklaşımın bilimsel bir kaynakta incelenmiş olması, hesaplamadaki
                    tüm seçimlerin o kaynak tarafından doğrulandığı anlamına gelmez.
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-3">
                {ENERGY_SCIENTIFIC_DECISIONS.map((item) => (
                  <li key={item.id} className="rounded-xl border border-[#9f7b38]/15 bg-white/70 p-4 text-sm">
                    <p className="font-bold text-[#102536]">{item.rule}</p>
                    <p className="mt-1 text-xs leading-5 text-[#665330]">
                      {evidenceLabels[item.evidence]} · {decisionLabels[item.decision]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="font-bold">Kaynaklar ve hesaplamada nasıl kullanıldıkları</h3>
              <ol className="mt-4 space-y-5">
                {ENERGY_LAB_SOURCES.map((source, index) => (
                  <li key={source.id} className="flex gap-3 text-sm leading-7 text-[#596a77]">
                    <span className="font-mono text-xs font-bold text-[#8c6a2d]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold underline decoration-[#9f7b38]/30 underline-offset-4 hover:text-[#102536] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38]"
                      >
                        {source.title} — {source.authors} ({source.year})
                        <ExternalLink aria-hidden="true" className="ml-1 inline size-3.5" />
                      </a>
                      <p className="mt-1 text-xs leading-6">Hesaplamada desteklediği bölüm: {source.supports}</p>
                      <p className="text-xs leading-6 text-[#74818b]">Sınırı: {source.limits}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
