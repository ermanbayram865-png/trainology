import type { Movement } from "@/lib/movements/types";

export type MovementType = "Compound" | "Isolation";

const isolationSlugs = new Set([
  "dumbbell-lateral-raise",
  "triceps-pushdown",
  "dumbbell-curl",
  "leg-curl",
  "leg-extension",
]);

export function normalizeMovementSearch(value: string): string {
  return value.trim().toLocaleLowerCase("tr-TR");
}

export function getMovementType(movement: Pick<Movement, "slug" | "tags">): MovementType {
  return movement.tags.includes("isolation") || isolationSlugs.has(movement.slug)
    ? "Isolation"
    : "Compound";
}

export function getMovementPattern(movement: Movement): string {
  if (movement.tags.includes("squat")) return "Squat";
  if (movement.tags.includes("hinge")) return "Hip Hinge";
  if (movement.tags.includes("carry")) return "Carry";
  if (movement.tags.includes("stability")) return "Stability";
  if (movement.category === "Push") return movement.name.includes("Overhead") ? "Vertical Push" : "Horizontal Push";
  if (movement.category === "Pull") return movement.name.includes("Row") || movement.name.includes("Curl") ? "Horizontal Pull" : "Vertical Pull";
  if (movement.category === "Legs") return "Lower Body";
  return "Full Body";
}

export function searchMovements(movements: readonly Movement[], query: string): Movement[] {
  const normalizedQuery = normalizeMovementSearch(query);
  if (!normalizedQuery) return [...movements];

  return movements.filter((movement) =>
    [movement.name, movement.muscleGroup, movement.equipment, getMovementType(movement), getMovementPattern(movement), ...movement.tags]
      .map(normalizeMovementSearch)
      .some((value) => value.includes(normalizedQuery)),
  );
}

export function getRelatedMovements(movement: Movement, movements: readonly Movement[], maximum = 3): Movement[] {
  const pattern = getMovementPattern(movement);
  return movements
    .filter((candidate) => candidate.slug !== movement.slug)
    .map((candidate, index) => ({
      candidate,
      index,
      score:
        (candidate.muscleGroup === movement.muscleGroup ? 4 : 0) +
        (candidate.equipment === movement.equipment ? 2 : 0) +
        (getMovementPattern(candidate) === pattern ? 1 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score || first.index - second.index)
    .slice(0, maximum)
    .map(({ candidate }) => candidate);
}

export function getAlternativeMovements(movement: Movement, movements: readonly Movement[], maximum = 3): Movement[] {
  const pattern = getMovementPattern(movement);
  return movements
    .filter((candidate) => candidate.slug !== movement.slug && candidate.muscleGroup === movement.muscleGroup)
    .map((candidate, index) => ({ candidate, index, patternMatch: getMovementPattern(candidate) === pattern ? 1 : 0 }))
    .sort((first, second) => second.patternMatch - first.patternMatch || first.index - second.index)
    .slice(0, maximum)
    .map(({ candidate }) => candidate);
}
