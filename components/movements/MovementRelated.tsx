import MovementGrid from "@/components/movements/MovementGrid";
import type { Movement } from "@/lib/movements/types";

type MovementRelatedProps = { movements: readonly Movement[]; title: string; description: string };

export default function MovementRelated({ movements, title, description }: MovementRelatedProps) {
  if (movements.length === 0) return null;
  return <section><h2 className="text-2xl font-semibold text-white">{title}</h2><p className="mt-2 text-neutral-400">{description}</p><div className="mt-6"><MovementGrid movements={movements} /></div></section>;
}
