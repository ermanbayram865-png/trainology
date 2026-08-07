import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";

type ArticleHeaderProps = { count: number };

const categories = [
  "Training Science",
  "Nutrition Science",
  "Supplement Science",
  "Movement Science",
] as const;

export default function ArticleHeader({ count }: ArticleHeaderProps) {
  return (
    <div>
      <PageHeader
        badge={<Badge variant="gold">Scientific Library</Badge>}
        title="Trainology Scientific Library"
        description="Bilimsel literatür ve kanıt temelli fitness rehberleri."
      />
      <div className="mt-6 flex flex-wrap items-center gap-2" aria-label="Makale kategorileri">
        {categories.map((category) => (
          <Badge key={category} variant="neutral">{category}</Badge>
        ))}
        <span className="ml-1 text-sm text-neutral-500">{count} rehber</span>
      </div>
    </div>
  );
}
