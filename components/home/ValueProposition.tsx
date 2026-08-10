import { Dumbbell, Sigma } from "lucide-react";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

const values = [
  {
    title: "Bilimsel Hesaplayıcılar",
    description: "Protein, kalori, makro ve performans analizlerini bilimsel yaklaşımlarla hesapla.",
    icon: <Sigma aria-hidden="true" />,
    href: "/calculators",
  },
  {
    title: "Hareket Kütüphanesi",
    description: "Egzersizleri doğru teknik, kas grubu ve uygulama bilgileriyle keşfet.",
    icon: <Dumbbell aria-hidden="true" />,
    href: "/movements",
  },
];

export default function ValueProposition() {
  return (
    <Section
      title="Fitness hedeflerin için bilimsel araçlar ve güvenilir bilgiler."
      subtitle="TRAINOLOGY PLATFORMU"
      description="Karar vermeyi kolaylaştıran, birbirini tamamlayan araçlar."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {values.map((value) => (
          <Card key={value.title} {...value} variant="subtle" />
        ))}
      </div>
    </Section>
  );
}
