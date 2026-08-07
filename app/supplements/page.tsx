import SupplementGrid from "@/components/supplements/SupplementGrid";
import SupplementHeader from "@/components/supplements/SupplementHeader";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Section from "@/components/ui/Section";
import { supplements } from "@/data/supplements/supplements";

const supplementPrinciples = [
  {
    title: "Kanıta dayalı değerlendirme",
    description: "Her rehber, güncel bilimsel araştırmalar doğrultusunda hazırlanacak.",
  },
  {
    title: "Şeffaf kaynaklar",
    description: "Önerilerin arkasındaki kaynaklar ve kanıt düzeyi açıkça paylaşılacak.",
  },
  {
    title: "Bağımsız yaklaşım",
    description: "İçerikler, reklam ve marka etkisinden bağımsız olarak sunulacak.",
  },
];

export default function SupplementsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-12">
        <SupplementHeader count={supplements.length} />

        <SupplementGrid supplements={supplements} />

        <FeatureGrid items={supplementPrinciples} columns={3} />
      </Section>
    </main>
  );
}
