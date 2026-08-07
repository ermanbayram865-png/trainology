import ArticleEvidenceBadge from "@/components/articles/ArticleEvidenceBadge";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { removeInlineCitationMarkers } from "@/lib/articles/formatters";
import type { ArticleCategory, ArticleEvidenceLevel } from "@/lib/articles/types";

type ArticleCardProps = {
  title: string;
  category: ArticleCategory;
  evidenceLevel: ArticleEvidenceLevel;
  summary: string;
  href: string;
};

export default function ArticleCard({ title, category, evidenceLevel, summary, href }: ArticleCardProps) {
  return (
    <Card
      title={title}
      description={removeInlineCitationMarkers(summary)}
      href={href}
      variant="subtle"
      className="h-full"
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="neutral">{category}</Badge>
        <ArticleEvidenceBadge evidenceLevel={evidenceLevel} />
      </div>
    </Card>
  );
}
