import { Apple, BookOpenText, FlaskConical } from "lucide-react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";

const topics = [
  {
    title: "Antrenman Bilimi",
    description:
      "Kuvvet, kas gelişimi, hacim ve toparlanma süreçlerini bilimsel temellerle keşfet.",
    icon: <BookOpenText size={30} strokeWidth={1.5} />,
  },
  {
    title: "Beslenme Bilimi",
    description:
      "Kalori dengesi, protein ihtiyacı ve sürdürülebilir beslenme ilkelerini öğren.",
    icon: <Apple size={30} strokeWidth={1.5} />,
  },
  {
    title: "Supplement Bilimi",
    description:
      "Takviyeleri reklamlarla değil, kanıt düzeyi ve kullanım bağlamıyla değerlendir.",
    icon: <FlaskConical size={30} strokeWidth={1.5} />,
  },
];

export default function SciencePreview() {
  return (
    <Section
      subtitle={
        <Badge variant="gold">
          SCIENCE
        </Badge>
      }
      title={
        <>
          Kanıta dayalı fitness
          <br />
          bilgisini keşfet.
        </>
      }
      description="Trainology; antrenman, beslenme ve supplement konularını güncel bilimsel kanıtlarla anlaşılır hale getirir."
      contentClassName="mt-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <Card
            key={topic.title}
            title={topic.title}
            description={topic.description}
            icon={topic.icon}
            variant="subtle"
            className="p-6"
          >
            <span className="text-xs font-semibold tracking-wide text-[#C9A14A]">
              Kanıta Dayalı İçerikler
            </span>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-5">
        <div className="hidden h-px flex-1 bg-gradient-to-r from-[#C9A14A]/35 to-transparent sm:block" />

        <CTAButton href="/articles" variant="secondary">
          Bilimsel İçerikleri Keşfet
        </CTAButton>
      </div>
    </Section>
  );
}
