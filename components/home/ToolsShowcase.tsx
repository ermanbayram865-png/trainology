import { Calculator, Dumbbell, Ruler, Utensils } from "lucide-react";

import CalculatorCard from "@/components/ui/CalculatorCard";
import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";
import { ENERGY_LAB_PATH } from "@/lib/routes";

const tools = [
  {
    title: "Kalori Hedefi Simülatörü",
    description:
      "Energy Lab ile günlük enerji ihtiyacın ve kalori hedefin için bir başlangıç tahmini oluştur.",
    icon: <Calculator size={30} strokeWidth={1.5} />,
    href: ENERGY_LAB_PATH,
  },
  {
    title: "Makro Planlayıcı",
    description:
      "Protein, karbonhidrat ve yağ dağılımını hedeflerine göre planla.",
    icon: <Utensils aria-hidden="true" />,
    href: "/calculators/macro",
  },
  {
    title: "Günlük Protein Referansı",
    description:
      "Kilon, hedefin ve antrenman durumuna göre günlük protein referansını incele.",
    icon: <Dumbbell aria-hidden="true" />,
    href: "/calculators/protein",
  },
  {
    title: "Yağsız Kütle İndeksi (FFMI) Analizi",
    description: "Yağsız kütleni boyuna göre genel bir referansla incele.",
    icon: <Ruler aria-hidden="true" />,
    href: "/calculators/ffmi",
  },
];

export default function ToolsShowcase() {
  return (
    <Section
      subtitle="TOOLS"
      title="Fitness kararlarını bilimsel verilerle destekle."
      description="Kalori ve makro verilerini analiz ederek daha bilinçli kararlar vermeni sağlayan araçlar."
      className="!py-[var(--space-section)]"
      contentClassName="mt-4"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)]">
        <CalculatorCard {...tools[0]} className="min-h-full" />
        <div className="grid gap-4">
          {tools.slice(1).map((tool) => (
            <CalculatorCard key={tool.title} {...tool} compact />
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <CTAButton href="/calculators" variant="secondary">
          Tüm Araçları Keşfet
        </CTAButton>
      </div>
    </Section>
  );
}
