import { Calculator, Dumbbell, Ruler, Trophy, Utensils } from "lucide-react";

import CalculatorCard from "@/components/ui/CalculatorCard";
import Section from "@/components/ui/Section";

const tools = [
  {
    title: "Protein Calculator",
    description: "Hedefine uygun günlük protein aralığını öğren.",
    category: "Beslenme",
    status: "active" as const,
    href: "/calculators/protein",
    icon: <Dumbbell aria-hidden="true" />,
  },
  {
    title: "Calorie Calculator",
    description: "Günlük enerji ihtiyacını hedeflerine göre analiz et.",
    category: "Beslenme",
    status: "active" as const,
    href: "/calculators/calorie",
    icon: <Calculator aria-hidden="true" />,
  },
  {
    title: "Macro Calculator",
    description: "Kalori hedefin için makro dağılımı oluştur.",
    category: "Beslenme",
    status: "active" as const,
    href: "/calculators/macro",
    icon: <Utensils aria-hidden="true" />,
  },
  {
    title: "FFMI Calculator",
    description: "Yağsız vücut kütleni boyuna göre değerlendir.",
    category: "Vücut Kompozisyonu",
    status: "active" as const,
    href: "/calculators/ffmi",
    icon: <Ruler aria-hidden="true" />,
  },
  {
    title: "1RM Calculator",
    description: "Tahmini maksimum kuvvetini hesapla.",
    category: "Performans",
    status: "active" as const,
    href: "/calculators/1rm",
    icon: <Trophy aria-hidden="true" />,
  },
];

export default function ToolsShowcase() {
  return (
    <Section
      className="bg-[#080808]"
      title="Bilimsel Fitness Araçları"
      subtitle="Analiz merkeziniz"
      description="İhtiyacın olan analizi seç, net ve anlaşılır sonuçlarla başlangıç yap."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <CalculatorCard key={tool.title} {...tool} />
        ))}
      </div>
    </Section>
  );
}
