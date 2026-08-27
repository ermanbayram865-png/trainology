import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import HydrationExperience from "@/components/hydration/HydrationExperience";

export default function WaterCalculatorPage() {
  return (
    <CalculatorLayout
      title="Su & Hidrasyon"
      seoPath="/calculators/water"
      description="Günlük toplam su referansını görüntüle ve egzersiz hidrasyonunu değerlendir."
      sectionClassName="!py-5 sm:!py-7 lg:!py-6 [@media(min-width:1024px)_and_(max-height:850px)]:!py-3"
      contentClassName="mx-auto max-w-5xl space-y-4 [@media(min-width:1024px)_and_(max-height:850px)]:space-y-2.5"
      disclaimer="Günlük EFSA referansı ve egzersiz terleme ölçümü birbirinden ayrı değerlendirmelerdir; kesin kişisel sıvı reçetesi değildir."
    >
      <HydrationExperience />
    </CalculatorLayout>
  );
}
