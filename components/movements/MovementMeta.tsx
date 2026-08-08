import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import MovementDifficulty from "@/components/movements/MovementDifficulty";
import { getMovementPattern, getMovementType } from "@/lib/movements/discovery";
import type { Movement } from "@/lib/movements/types";

type MovementMetaProps = { movement: Movement };

export default function MovementMeta({ movement }: MovementMetaProps) {
  return <Card variant="subtle" className="p-6 xl:sticky xl:top-32"><h2 className="text-lg font-semibold text-white">Hareket bilgisi</h2><dl className="mt-5 space-y-4 text-sm"><Meta label="Ana kas grubu" value={<Badge variant="gold">{movement.muscleGroup}</Badge>} /><Meta label="Ekipman" value={<Badge variant="neutral">{movement.equipment}</Badge>} /><Meta label="Zorluk" value={<MovementDifficulty difficulty={movement.difficulty} />} /><Meta label="Hareket tipi" value={<Badge variant={getMovementType(movement) === "Compound" ? "success" : "warning"}>{getMovementType(movement)}</Badge>} /><Meta label="Hareket paterni" value={getMovementPattern(movement)} /></dl></Card>;
}

function Meta({ label, value }: { label: string; value: React.ReactNode }) { return <div><dt className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">{label}</dt><dd className="mt-2 text-neutral-300">{value}</dd></div>; }
