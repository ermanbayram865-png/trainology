import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";

type MovementHeaderProps = {
  count: number;
};

export default function MovementHeader({ count }: MovementHeaderProps) {
  return (
    <PageHeader
      badge={<Badge variant="gold">Hareket Kütüphanesi</Badge>}
      title="Hareket Kütüphanesi"
      description={`${count} örnek hareketi kas grubu, ekipman ve zorluk seviyesine göre keşfet.`}
    />
  );
}
