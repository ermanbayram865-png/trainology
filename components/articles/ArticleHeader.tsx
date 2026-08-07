import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import type { ArticleCategory } from "@/lib/articles/types";

type ArticleHeaderProps = { count: number; categories: readonly ArticleCategory[] };

export default function ArticleHeader({ count, categories }: ArticleHeaderProps) {
  return (
    <div>
      <PageHeader
        badge={<Badge variant="gold">Scientific Library</Badge>}
        title="Trainology Scientific Library"
        description="Bilimsel literatür ve kanıt temelli fitness rehberleri."
      />
      <p className="mt-6 text-sm text-neutral-500">{categories.length} kategori · {count} rehber</p>
    </div>
  );
}
