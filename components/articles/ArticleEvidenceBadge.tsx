import Badge from "@/components/ui/Badge";
import type { ArticleEvidenceLevel } from "@/lib/articles/types";

type ArticleEvidenceBadgeProps = {
  evidenceLevel: ArticleEvidenceLevel;
};

const evidenceVariants = {
  "Strong Evidence": "success",
  "Moderate Evidence": "gold",
  "Limited Evidence": "warning",
  "Emerging Evidence": "neutral",
} as const;

export default function ArticleEvidenceBadge({
  evidenceLevel,
}: ArticleEvidenceBadgeProps) {
  return <Badge variant={evidenceVariants[evidenceLevel]}>{evidenceLevel}</Badge>;
}
