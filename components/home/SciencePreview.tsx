import { Apple, BookOpenText, FlaskConical } from "lucide-react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import CTAButton from "@/components/ui/CTAButton";
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
      description="Antrenman, beslenme, supplement ve hareket bilimine dair kanıta dayalı rehberleri keşfet."
    >
      <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
        {topics.map((topic) => (
          <Card key={topic.title} {...topic} variant="subtle">
            <Badge variant="gold">Bilimsel rehber</Badge>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-5">
        <div className="hidden h-px flex-1 bg-gradient-to-r from-[#C9A14A]/35 to-transparent sm:block" />
        <CTAButton href="/articles" variant="secondary">
          Bilimsel İçerikleri Keşfet
        </CTAButton>
      </div>
    </Section>
  );
}
