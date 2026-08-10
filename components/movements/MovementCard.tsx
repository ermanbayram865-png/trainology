import Image from "next/image";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import MovementDifficulty from "@/components/movements/MovementDifficulty";
import { getMovementType } from "@/lib/movements/discovery";
import type { Difficulty, Equipment, MuscleGroup } from "@/lib/movements/types";

type MovementCardProps = {
  title: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  difficulty: Difficulty;
  image: string;
  href: string;
  description?: string;
  slug: string;
  tags: readonly string[];
};

export default function MovementCard({
  title,
  muscleGroup,
  equipment,
  difficulty,
  image,
  href,
  description,
  slug,
  tags,
}: MovementCardProps) {
  const movementType = getMovementType({ slug, tags });
  return (
    <div className="relative h-full">
      <Card
      title={title}
      description={description}
      href={href}
      media={
        <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-white/5 bg-[#111]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-contain p-4"
          />
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="gold">{muscleGroup}</Badge>
        <Badge variant="neutral">{equipment}</Badge>
        <Badge variant={movementType === "Compound" ? "success" : "warning"}>{movementType}</Badge>
        <MovementDifficulty difficulty={difficulty} />
      </div>
      </Card>
    </div>
  );
}
