import { Calculator, Scale } from "lucide-react";

import Card from "@/components/ui/Card";
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
    icon: <Scale size={30} strokeWidth={1.5} />,
    href: "/calculators/macro",
  },
];

export default function ToolsShowcase() {
  return (
    <Section
      subtitle="TOOLS"
      title="Fitness kararlarını bilimsel verilerle destekle."
      description="Kalori ve makro verilerini analiz ederek daha bilinçli kararlar vermeni sağlayan araçlar."
      contentClassName="mt-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {tools.map((tool) => (
          <Card
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            href={tool.href}
            variant="subtle"
            className="p-5"
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <CTAButton href="/calculators" variant="secondary">
          Tüm Araçları Keşfet
        </CTAButton>
      </div>
    </Section>
  );
}
