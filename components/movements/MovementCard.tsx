import Image from "next/image";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import type {
  Difficulty,
  Equipment,
  MovementCategory,
  MuscleGroup,
} from "@/lib/movements/types";

type MovementCardProps = {
  title: string;
  category: MovementCategory;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  difficulty: Difficulty;
  image: string;
  href: string;
  description?: string;
};

export default function MovementCard({
  title,
  category,
  muscleGroup,
  equipment,
  difficulty,
  image,
  href,
  description,
}: MovementCardProps) {
  return (
    <Card
      title={title}
      description={description}
      href={href}
      icon={
        <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-white/5 bg-[#111]">
          <Image src={image} alt={title} fill className="object-contain p-4" />
        </div>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="neutral">{category}</Badge>
        <Badge variant="gold">{muscleGroup}</Badge>
        <Badge>{equipment}</Badge>
        <Badge variant={difficulty === "Beginner" ? "success" : "warning"}>
          {difficulty}
        </Badge>
      </div>
    </Card>
  );
}
