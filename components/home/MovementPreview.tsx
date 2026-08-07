import MovementCard from "@/components/movements/MovementCard";
import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";
import { movements } from "@/data/movements/movements";
import type { Movement } from "@/lib/movements/types";

const featuredSlugs = [
  "barbell-bench-press",
  "barbell-back-squat",
  "deadlift",
  "pull-up",
];

const featuredMovements = featuredSlugs
  .map((slug) => movements.find((movement) => movement.slug === slug))
  .filter((movement): movement is Movement => Boolean(movement));

export default function MovementPreview() {
  return (
    <Section
      title="Hareketleri doğru öğren."
      subtitle="Hareket kütüphanesi"
      description="Temel hareketleri teknik, kas grubu ve ekipman bilgileriyle keşfet."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {featuredMovements.map((movement) => (
          <MovementCard
            key={movement.id}
            title={movement.name}
            category={movement.category}
            muscleGroup={movement.muscleGroup}
            equipment={movement.equipment}
            difficulty={movement.difficulty}
            image={movement.image}
            href={`/movements/${movement.slug}`}
            description={movement.description}
          />
        ))}
      </div>

      <div className="mt-10">
        <CTAButton href="/movements" variant="secondary">
          Tüm Hareketleri Keşfet
        </CTAButton>
      </div>
    </Section>
  );
}
