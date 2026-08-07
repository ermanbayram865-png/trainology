import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";

type ArticleHeaderProps = { count: number };

export default function ArticleHeader({ count }: ArticleHeaderProps) {
  return (
    <PageHeader
      badge={<Badge variant="gold">Bilimsel İçerikler</Badge>}
      title="Bilimsel Fitness Bilgileri"
      description={`${count} temel rehberi kanıt seviyesi ve konu alanıyla birlikte incele.`}
    />
  );
}
