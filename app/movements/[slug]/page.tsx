import { notFound } from "next/navigation";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import FeatureGrid from "@/components/ui/FeatureGrid";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import { getMovementBySlug } from "@/data/movements/movements";

type MovementDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MovementDetailPage({
  params,
}: MovementDetailPageProps) {
  const { slug } = await params;
  const movement = getMovementBySlug(slug);

  if (!movement) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-12">
        <PageHeader
          badge={<Badge variant="gold">{movement.muscleGroup}</Badge>}
          title={movement.name}
          description={movement.description}
        />

        <FeatureGrid
          columns={3}
          items={[
            { title: "Kas grubu", description: movement.muscleGroup },
            { title: "Ekipman", description: movement.equipment },
            { title: "Zorluk", description: movement.difficulty },
          ]}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <Card title="Teknik adımlar" variant="subtle">
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-neutral-400">
              {movement.instructions.map((instruction) => (
                <li key={instruction}>{instruction}</li>
              ))}
            </ol>
          </Card>

          <Card title="Sık hatalar" variant="subtle">
            <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-400">
              {movement.commonMistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>
    </main>
  );
}
