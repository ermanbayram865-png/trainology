import type { EvidenceLevel, Supplement } from "@/lib/supplements/types";

export const evidenceOrder: readonly EvidenceLevel[] = ["Strong Evidence", "Moderate Evidence", "Limited Evidence", "Emerging Evidence"];
export type SupplementSort = "a-z" | "z-a" | "evidence";

export function normalizeSupplementSearch(value: string) { return value.trim().toLocaleLowerCase("tr-TR"); }

export function filterSupplements(supplements: readonly Supplement[], options: { query?: string; category?: string; evidence?: string; sort?: SupplementSort }): Supplement[] {
  const query = normalizeSupplementSearch(options.query ?? "");
  return supplements.filter((supplement) => {
    if (options.category && supplement.category !== options.category) return false;
    if (options.evidence && supplement.evidenceLevel !== options.evidence) return false;
    if (!query) return true;
    return [
      supplement.name,
      supplement.description,
      supplement.category,
      supplement.purpose,
      supplement.evidenceContent.oneLiner,
      supplement.evidenceContent.verdict,
      ...supplement.benefits,
      ...supplement.evidenceContent.quickUses,
      ...supplement.evidenceContent.evidence.flatMap((claim) => [claim.claim, claim.conclusion]),
    ]
      .map(normalizeSupplementSearch).some((value) => value.includes(query));
  }).toSorted((first, second) => {
    const sort = options.sort ?? "a-z";
    if (sort === "z-a") return second.name.localeCompare(first.name, "tr");
    if (sort === "evidence") return evidenceOrder.indexOf(first.evidenceLevel) - evidenceOrder.indexOf(second.evidenceLevel) || first.name.localeCompare(second.name, "tr");
    return first.name.localeCompare(second.name, "tr");
  });
}

export function getRelatedSupplements(supplement: Supplement, supplements: readonly Supplement[], maximum = 3): Supplement[] {
  return supplements.filter((candidate) => candidate.slug !== supplement.slug).map((candidate, index) => ({ candidate, index, score: (candidate.category === supplement.category ? 2 : 0) + (candidate.evidenceLevel === supplement.evidenceLevel ? 1 : 0) })).sort((first, second) => second.score - first.score || first.index - second.index).slice(0, maximum).map(({ candidate }) => candidate);
}
