import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import type { EvidenceLevel, SupplementCategory } from "@/lib/supplements/types";

type SupplementCardProps = {
  name: string;
  category: SupplementCategory;
  evidenceLevel: EvidenceLevel;
  description: string;
  href: string;
};

const evidenceVariants = {
  "Strong Evidence": "success",
  "Moderate Evidence": "gold",
  "Limited Evidence": "warning",
  "Emerging Evidence": "neutral",
} as const;

export default function SupplementCard({ name, category, evidenceLevel, description, href }: SupplementCardProps) {
  return (
    <Card title={name} description={description} href={href} variant="subtle">
      <div className="flex flex-wrap gap-2">
        <Badge variant="neutral">{category}</Badge>
        <Badge variant={evidenceVariants[evidenceLevel]}>{evidenceLevel}</Badge>
      </div>
    </Card>
  );
}
