import { Apple, BookOpenText, FlaskConical } from "lucide-react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

const topics = [
  {
    title: "Antrenman Bilimi",
    description: "Kuvvet, hacim, toparlanma ve performans hakkında anlaşılır içerikler.",
    icon: <BookOpenText aria-hidden="true" />,
  },
  {
    title: "Beslenme Bilimi",
    description: "Enerji dengesi, makrolar ve sürdürülebilir beslenme ilkeleri.",
    icon: <Apple aria-hidden="true" />,
  },
  {
    title: "Supplement Bilimi",
    description: "Takviyeleri kanıt düzeyi ve kullanım bağlamıyla değerlendiren içerikler.",
    icon: <FlaskConical aria-hidden="true" />,
  },
];

export default function SciencePreview() {
  return (
    <Section
      className="bg-[#080808]"
      title="Bilimsel Fitness Bilgileri"
      subtitle="İçerik kütüphanesi"
      description="Gelecek içerik merkezi için temel konu başlıkları."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {topics.map((topic) => (
          <Card key={topic.title} {...topic} variant="subtle">
            <Badge variant="neutral">Yakında</Badge>
          </Card>
        ))}
      </div>
    </Section>
  );
}
