import Badge from "@/components/ui/Badge";
import type { EvidenceLevel } from "@/lib/supplements/types";

const variants: Record<EvidenceLevel, "gold" | "neutral" | "success" | "warning"> = { "Strong Evidence": "success", "Moderate Evidence": "gold", "Limited Evidence": "warning", "Emerging Evidence": "neutral" };

export default function SupplementEvidenceBadge({ evidenceLevel }: { evidenceLevel: EvidenceLevel }) {
  return <Badge variant={variants[evidenceLevel]}>{evidenceLevel}</Badge>;
}
