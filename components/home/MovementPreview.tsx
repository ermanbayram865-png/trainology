import { Activity, Dumbbell, Move } from "lucide-react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";
import { movements } from "@/data/movements/movements";

const featuredMovements = [
  {
    slug: "barbell-bench-press",
    icon: <Dumbbell size={30} strokeWidth={1.5} />,
  },
  {
    slug: "barbell-back-squat",
    icon: <Activity size={30} strokeWidth={1.5} />,
  },
  {
    slug: "lat-pulldown",
    icon: <Move size={30} strokeWidth={1.5} />,
  },
]
  .map((featuredMovement) => {
    const movement = movements.find(
      (item) => item.slug === featuredMovement.slug,
    );

    return movement ? { ...movement, icon: featuredMovement.icon } : null;
  })
  .filter((movement) => movement !== null);

export default function MovementPreview() {
  return (
    <Section
      subtitle="MOVEMENT LIBRARY"
      title="Hareketleri doğru teknikle öğren."
      description="Egzersizlerin hedef kaslarını, teknik detaylarını ve uygulama noktalarını bilimsel bilgilerle keşfet."
      contentClassName="mt-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {featuredMovements.map((movement) => (
          <Card
            key={movement.id}
            title={movement.name}
            description={movement.description}
            icon={movement.icon}
            href={`/movements/${movement.slug}`}
            variant="subtle"
            className="p-6"
          >
            <Badge variant="neutral">
              {movement.muscleGroup} • {movement.category}
            </Badge>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <CTAButton href="/movements" variant="secondary">
          Tüm Hareketleri Keşfet
        </CTAButton>
      </div>
    </Section>
  );
}
