import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import FeatureGrid from "@/components/ui/FeatureGrid";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import { getSupplementBySlug } from "@/data/supplements/supplements";
import type { EvidenceLevel } from "@/lib/supplements/types";

type SupplementDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: SupplementDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    alternates: {
      canonical: `/supplements/${slug}`,
    },
  };
}

const evidenceVariants: Record<
  EvidenceLevel,
  "gold" | "neutral" | "success" | "warning"
> = {
  "Strong Evidence": "success",
  "Moderate Evidence": "gold",
  "Limited Evidence": "warning",
  "Emerging Evidence": "neutral",
};

export default async function SupplementDetailPage({
  params,
}: SupplementDetailPageProps) {
  const { slug } = await params;
  const supplement = getSupplementBySlug(slug);

  if (!supplement) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-12">
        <PageHeader
          badge={
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">{supplement.category}</Badge>
              <Badge variant={evidenceVariants[supplement.evidenceLevel]}>
                {supplement.evidenceLevel}
              </Badge>
            </div>
          }
          title={supplement.name}
          description={supplement.description}
        />

        <FeatureGrid
          columns={3}
          items={[
            { title: "Kategori", description: supplement.category },
            { title: "Kanıt seviyesi", description: supplement.evidenceLevel },
            { title: "Kullanım amacı", description: supplement.purpose },
          ]}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <Card title="Potansiyel faydalar" variant="subtle">
            <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-400">
              {supplement.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </Card>

          <Card title="Kullanım bilgisi" description={supplement.usage} variant="subtle" />

          <Card title="Dikkat edilmesi gerekenler" variant="subtle">
            <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-400">
              {supplement.considerations.map((consideration) => (
                <li key={consideration}>{consideration}</li>
              ))}
            </ul>
          </Card>

          <Card title="Bilimsel kaynaklar" variant="subtle">
            <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-neutral-400">
              {supplement.sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>
    </main>
  );
}
