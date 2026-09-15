import { Sigma } from "lucide-react";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

const values = [
  {
    title: "Bilimsel Hesaplayıcılar",
    description: "Enerji, makro, protein ve vücut ölçümlerini anlaşılır araçlarla incele.",
    icon: <Sigma aria-hidden="true" />,
    href: "/calculators",
  },
];

export default function ValueProposition() {
  return (
    <Section
      title="Fitness hedeflerin için bilimsel araçlar ve güvenilir bilgiler."
      subtitle="TRAINOLOGY PLATFORMU"
      description="Karar vermeyi kolaylaştıran, birbirini tamamlayan araçlar."
    >
      <div className="max-w-2xl">
        {values.map((value) => (
          <Card key={value.title} {...value} variant="subtle" />
        ))}
      </div>
    </Section>
  );
}
