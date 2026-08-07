import MovementCard from "@/components/movements/MovementCard";
import type { Movement } from "@/lib/movements/types";

type MovementGridProps = {
  movements: readonly Movement[];
};

export default function MovementGrid({ movements }: MovementGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {movements.map((movement) => (
        <MovementCard
          key={movement.id}
          title={movement.name}
          description={movement.description}
          category={movement.category}
          muscleGroup={movement.muscleGroup}
          equipment={movement.equipment}
          difficulty={movement.difficulty}
          image={movement.image}
          href={`/movements/${movement.slug}`}
        />
      ))}
    </div>
  );
}
