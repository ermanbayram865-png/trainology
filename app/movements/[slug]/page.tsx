import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MovementCoachTips from "@/components/movements/MovementCoachTips";
import MovementDetailHero from "@/components/movements/MovementDetailHero";
import MovementMeta from "@/components/movements/MovementMeta";
import MovementRelated from "@/components/movements/MovementRelated";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { getMovementBySlug, movements } from "@/data/movements/movements";
import {
  getAlternativeMovements,
  getRelatedMovements,
} from "@/lib/movements/discovery";
import { absoluteUrl, siteConfig } from "@/lib/seo";

type MovementDetailPageProps = { params: Promise<{ slug: string }> };

function getMovementSeoTitle(name: string) {
  return `${name} Nasıl Yapılır?`;
}

function getMovementImageUrl(image: string) {
  const imagePath = image.trim();
  return imagePath ? absoluteUrl(imagePath) : undefined;
}

export async function generateMetadata({
  params,
}: MovementDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const movement = getMovementBySlug(slug);

  if (!movement) {
    return {
      title: "Hareket bulunamadı",
      robots: { index: false, follow: false },
    };
  }

  const title = getMovementSeoTitle(movement.name);
  const pageUrl = absoluteUrl(`/movements/${movement.slug}`);
  const imageUrl = getMovementImageUrl(movement.image);
  const images = imageUrl
    ? [{ url: imageUrl, alt: `${movement.name} hareket görseli` }]
    : undefined;

  return {
    title,
    description: movement.description,
    alternates: { canonical: `/movements/${movement.slug}` },
    openGraph: {
      title,
      description: movement.description,
      type: "website",
      url: pageUrl,
      siteName: siteConfig.name,
      locale: "tr_TR",
      images,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description: movement.description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function MovementDetailPage({
  params,
}: MovementDetailPageProps) {
  const { slug } = await params;
  const movement = getMovementBySlug(slug);

  if (!movement) notFound();

  const alternatives = getAlternativeMovements(movement, movements);
  const relatedMovements = getRelatedMovements(movement, movements);
  const pageUrl = absoluteUrl(`/movements/${movement.slug}`);
  const imageUrl = getMovementImageUrl(movement.image);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: getMovementSeoTitle(movement.name),
    description: movement.description,
    url: pageUrl,
    inLanguage: "tr-TR",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntity: {
      "@type": "Thing",
      name: movement.name,
      description: movement.description,
    },
    genre: movement.category,
    keywords: [
      movement.muscleGroup,
      movement.equipment,
      movement.difficulty,
      ...movement.tags,
    ].join(", "),
    ...(imageUrl
      ? {
          image: imageUrl,
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: imageUrl,
          },
        }
      : {}),
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

        <MovementDetailHero movement={movement} />

        <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-white">
                Egzersiz özeti
              </h2>
              <Card variant="subtle" className="mt-5 max-w-4xl">
                <p className="leading-8 text-neutral-300">
                  {movement.description}
                </p>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">
                Kas katılımı
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <Card
                  title="Ana kaslar"
                  description={movement.muscleGroup}
                  variant="subtle"
                />
                <Card
                  title="İkincil kaslar"
                  description="Bu hareket için veri setinde ayrı ikincil kas bilgisi belirtilmemiştir."
                  variant="subtle"
                />
                <Card
                  title="Stabilizatörler"
                  description="Bu hareket için veri setinde ayrı stabilizatör bilgisi belirtilmemiştir."
                  variant="subtle"
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">Uygulama</h2>
              <Card variant="subtle" className="mt-5 max-w-4xl">
                <ol className="list-decimal space-y-3 pl-5 text-sm leading-7 text-neutral-300">
                  {movement.instructions.map((instruction) => (
                    <li key={instruction}>{instruction}</li>
                  ))}
                </ol>
              </Card>
            </section>

            <MovementCoachTips tips={movement.instructions} />

            <section>
              <h2 className="text-2xl font-semibold text-white">
                Sık hatalar
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {movement.commonMistakes.map((mistake) => (
                  <Card
                    key={mistake}
                    title="Dikkat"
                    description={mistake}
                    variant="subtle"
                  />
                ))}
              </div>
            </section>

            <MovementRelated
              movements={alternatives}
              title="Alternatif hareketler"
              description="Aynı ana kas grubu ve mümkün olduğunda aynı hareket paterni üzerinden seçilmiştir."
            />
            <MovementRelated
              movements={relatedMovements}
              title="İlgili egzersizler"
              description="Ana kas grubu, ekipman ve hareket paterni benzerliğine göre sıralanmıştır."
            />
          </div>

          <aside>
            <MovementMeta movement={movement} />
          </aside>
        </div>
      </Section>
    </main>
  );
}
