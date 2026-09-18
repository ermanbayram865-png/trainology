import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import FFMIExperience from "@/components/ffmi/FFMIExperience";

export default function FFMICalculatorPage() {
  return (
    <CalculatorLayout
      title="Yağsız Kütle İndeksi (FFMI)"
      seoPath="/calculators/ffmi"
      description="Boyun, kilon ve yağ oranından tahmini FFMI, yağsız kütle ve yağ kütlesi göstergelerini hesapla."
      sectionClassName="!py-[var(--space-section-compact)] sm:!py-8 lg:!py-5"
      contentClassName="mx-auto max-w-6xl space-y-[var(--space-field-group)] lg:space-y-3 [&>header]:max-w-4xl [&>header]:border-b [&>header]:border-[var(--calculator-border)] [&>header]:pb-[var(--space-field-group)] lg:[&>header]:pb-3"
      info={
        <>
          <p>
            Yağsız Kütle İndeksi (Fat-Free Mass Index / FFMI), tahmini yağsız
            vücut kütlesini boya göre ifade eder. Tek başına sağlık skoru,
            performans testi veya iyi/kötü fizik değerlendirmesi değildir.
          </p>
          <p className="mt-3">
            Sonuç, girdiğin yağ oranının doğruluğundan etkilenir. Değişimi
            izlerken aynı yöntemi, mümkünse aynı cihazı ve benzer ölçüm
            koşullarını kullanmak daha anlamlıdır.
          </p>
        </>
      }
      references={
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/2239792/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              VanItallie ve arkadaşları (1990) — FFMI ve FMI tanımı
            </a>
          </li>
          <li>
            <a
              href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8065383/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              Spor uygulamalarında vücut kompozisyonu ölçüm yöntemleri incelemesi
            </a>
          </li>
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/36853902/"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A14A] underline-offset-4 hover:underline"
            >
              Atletlerde BIA ve DXA karşılaştırmasına ilişkin sistematik inceleme
            </a>
          </li>
        </ul>
      }
      disclaimer="Bu araç, girdiğin vücut yağ oranına dayalı eğitim amaçlı tahminler sunar; tanı, tedavi veya performans değerlendirmesi değildir."
    >
      <FFMIExperience />
    </CalculatorLayout>
  );
}
