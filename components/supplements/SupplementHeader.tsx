import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";

type SupplementHeaderProps = { count: number };

export default function SupplementHeader({ count }: SupplementHeaderProps) {
  return (
    <PageHeader
      badge={<Badge variant="gold">Supplement Bilimi</Badge>}
      title="Supplement Kütüphanesi"
      description={`${count} örnek supplementi kanıt düzeyi, kullanım bağlamı ve dikkat edilmesi gerekenlerle incele.`}
    />
  );
}
