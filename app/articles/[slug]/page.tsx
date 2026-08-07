import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ArticleContent from "@/components/articles/ArticleContent";
import ArticleEvidenceBadge from "@/components/articles/ArticleEvidenceBadge";
import ArticleFaq from "@/components/articles/ArticleFaq";
import ArticleMetadata from "@/components/articles/ArticleMetadata";
import ArticleRelatedContent from "@/components/articles/ArticleRelatedContent";
import ArticleSection from "@/components/articles/ArticleSection";
import ArticleSources from "@/components/articles/ArticleSources";
import ArticleTableOfContents from "@/components/articles/ArticleTableOfContents";
import ArticleTrust from "@/components/articles/ArticleTrust";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import { articles, getArticleBySlug } from "@/data/articles/articles";
import { removeInlineCitationMarkers } from "@/lib/articles/formatters";
import { absoluteUrl, siteConfig } from "@/lib/seo";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Makale bulunamadı | Trainology",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: article.title,
    description: removeInlineCitationMarkers(article.summary),
    openGraph: {
      title: article.title,
      description: removeInlineCitationMarkers(article.summary),
      type: "article",
      publishedTime: article.publishedDate,
      modifiedTime: article.updatedDate,
      authors: [article.author],
      images: [{ url: absoluteUrl(article.image), alt: article.title }],
    },
  };
}

export default async function ArticlePage({
  params,
}: ArticlePageProps) {
  const { slug } = await params;

  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const toolLabels: Record<string, string> = {
    "/calculators/protein": "Protein Hesaplayıcı",
    "/calculators/calorie": "Kalori Hesaplayıcı",
    "/calculators/macro": "Makro Hesaplayıcı",
    "/calculators/ffmi": "FFMI Hesaplayıcı",
    "/calculators/1rm": "1RM Hesaplayıcı",
    "/movements": "Hareket Kütüphanesi",
    "/movements/barbell-bench-press": "Barbell Bench Press",
    "/movements/barbell-back-squat": "Barbell Back Squat",
    "/movements/deadlift": "Deadlift",
    "/supplements": "Supplement Kütüphanesi",
    "/supplements/creatine-monohydrate": "Creatine Monohydrate",
    "/supplements/omega-3": "Omega-3",
    "/supplements/whey-protein": "Whey Protein",
    "/articles/progressive-overload-nedir": "Progressive Overload Nedir?",
    "/articles/rir-nedir": "RIR Nedir?",
    "/articles/kalori-dengesi": "Kalori Dengesi Nedir?",
  };
  const getRelatedResource = (href: string) => {
    const label = toolLabels[href] ?? "İlgili kaynak";

    if (href.startsWith("/calculators/")) {
      return {
        title: `İlgili Hesaplayıcı: ${label}`,
        description: "Bu rehberle ilişkili hesaplayıcıyı aç.",
      };
    }

    if (href.startsWith("/articles/")) {
      return {
        title: `İlgili Rehber: ${label}`,
        description: "Bu konuyla ilişkili bilimsel rehberi aç.",
      };
    }

    if (href.startsWith("/movements/")) {
      return {
        title: `İlgili Hareket: ${label}`,
        description: "Bu rehberle ilişkili hareketi incele.",
      };
    }

    if (href.startsWith("/supplements/")) {
      return {
        title: `İlgili Supplement: ${label}`,
        description: "Bu rehberle ilişkili supplement bilgisini aç.",
      };
    }

    return {
      title: `İlgili Kütüphane: ${label}`,
      description: "Bu rehberle ilişkili Trainology kütüphanesini aç.",
    };
  };

  const relatedArticles = articles
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);

  const defaultContentSectionTitles = [
    "Bilimsel çerçeve",
    "Uygulama bağlamı",
    "Dikkat edilmesi gerekenler",
  ];
  const isProgressiveOverload = article.slug === "progressive-overload-nedir";
  const isProteinGuide = article.slug === "gunluk-protein-ihtiyaci";
  const isCreatineGuide = article.slug === "kreatin-bilimsel-rehber";
  const isScientificGuide =
    isProgressiveOverload || isProteinGuide || isCreatineGuide;
  const contentSections = isProgressiveOverload
    ? [
        {
          id: "scientific-framework",
          title: "Bilimsel Çerçeve",
          content: article.content.slice(2, 6),
        },
        {
          id: "practical-application",
          title: "Pratik Uygulama",
          content: article.content.slice(6, 14),
        },
        {
          id: "common-mistakes",
          title: "Yaygın Hatalar",
          content: article.content.slice(14, 15),
        },
        {
          id: "evidence-limitations",
          title: "Kanıtlar ve Sınırlılıklar",
          content: article.content.slice(15, 17),
        },
      ]
    : isProteinGuide
      ? [
          {
            id: "scientific-framework",
            title: "Bilimsel Çerçeve",
            content: article.content.slice(2, 7),
          },
          {
            id: "practical-application",
            title: "Pratik Uygulama",
            content: article.content.slice(7, 13),
          },
          {
            id: "common-mistakes",
            title: "Yaygın Hatalar",
            content: article.content.slice(13, 17),
          },
          {
            id: "evidence-limitations",
            title: "Kanıtlar ve Sınırlılıklar",
            content: article.content.slice(17, 19),
          },
        ]
      : isCreatineGuide
        ? [
            {
              id: "scientific-framework",
              title: "Bilimsel Çerçeve",
              content: article.content.slice(2, 6),
            },
            {
              id: "practical-application",
              title: "Pratik Uygulama",
              content: article.content.slice(6, 14),
            },
            {
              id: "common-mistakes",
              title: "Yaygın Hatalar",
              content: article.content.slice(14, 20),
            },
            {
              id: "evidence-limitations",
              title: "Kanıtlar ve Sınırlılıklar",
              content: article.content.slice(20, 22),
            },
          ]
    : article.content.map((content, index) => ({
        id: `content-${index + 1}`,
        title:
          defaultContentSectionTitles[index] ?? `Bilimsel not ${index + 1}`,
        content: [content],
      }));
  const keyPoints = isProgressiveOverload
    ? article.content.slice(17, 18)
    : isProteinGuide
      ? article.content.slice(19, 20)
      : isCreatineGuide
        ? article.content.slice(22, 23)
    : contentSections.flatMap((section) => section.content);
  const scientificSummaryContent = isScientificGuide
    ? [article.summary, ...article.content.slice(0, 2)]
    : [article.summary];
  const tableOfContents = [
    {
      id: "summary",
      label: isScientificGuide ? "Bilimsel Özet" : "Özet",
    },
    {
      id: "key-points",
      label: isScientificGuide ? "Temel Noktalar" : "Ana noktalar",
    },
    ...contentSections.map(({ id, title }) => ({ id, label: title })),
    {
      id: "sources",
      label: "Kaynaklar",
    },
    { id: "related-tools", label: "İlgili araçlar" },
    ...(relatedArticles.length > 0
      ? [{ id: "related-content", label: "İlgili içerikler" }]
      : []),
    { id: "faq", label: "Sık Sorulan Sorular" },
    { id: "trust", label: "Yayın standardı" },
  ];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: removeInlineCitationMarkers(article.summary),
    datePublished: article.publishedDate,
    dateModified: article.updatedDate,
    author: { "@type": "Organization", name: article.author },
    reviewedBy: { "@type": "Organization", name: article.reviewedBy },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/logo.png"),
      },
    },
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}`),
    image: absoluteUrl(article.image),
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

        <PageHeader
          badge={
            <div className="flex flex-wrap gap-2">
              <Badge variant="neutral">{article.category}</Badge>
              <ArticleEvidenceBadge evidenceLevel={article.evidenceLevel} />
            </div>
          }
          title={article.title}
          description={removeInlineCitationMarkers(article.summary)}
        />

        <ArticleMetadata
          evidenceLevel={article.evidenceLevel}
          publishedDate={article.publishedDate}
          updatedDate={article.updatedDate}
          readingTime={article.readingTime}
          author={article.author}
          reviewedBy={article.reviewedBy}
        />

        <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-16">
            <ArticleSection
              id="summary"
              title={isScientificGuide ? "Bilimsel Özet" : "Özet"}
            >
              <Card variant="subtle" className="max-w-4xl">
                <div className="space-y-5 text-base leading-8 text-neutral-300">
                  {scientificSummaryContent.map((paragraph) => (
                    <p key={paragraph}>{removeInlineCitationMarkers(paragraph)}</p>
                  ))}
                </div>
              </Card>
            </ArticleSection>

            <ArticleSection
              id="key-points"
              title={isScientificGuide ? "Temel Noktalar" : "Ana noktalar"}
            >
              <Card variant="subtle" className="max-w-4xl">
                <ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-neutral-300">
                  {keyPoints.map((point) => (
                    <li key={point}>{removeInlineCitationMarkers(point)}</li>
                  ))}
                </ul>
              </Card>
            </ArticleSection>

            {isScientificGuide ? (
              <ArticleContent sections={contentSections} />
            ) : (
              <ArticleSection title="İçerik bölümleri">
                <ArticleContent sections={contentSections} />
              </ArticleSection>
            )}

            <ArticleSection
              id="sources"
              title="Kaynaklar"
            >
              <ArticleSources sources={article.sources} />
            </ArticleSection>

            <ArticleSection id="related-tools" title="İlgili araçlar">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {article.relatedTools.map((href) => {
                  const relatedResource = getRelatedResource(href);

                  return (
                    <Card
                      key={href}
                      href={href}
                      title={relatedResource.title}
                      description={relatedResource.description}
                      variant="subtle"
                      className="p-6"
                    />
                  );
                })}
              </div>
            </ArticleSection>

            {relatedArticles.length > 0 && (
              <ArticleSection id="related-content" title="İlgili içerikler">
                <ArticleRelatedContent articles={relatedArticles} />
              </ArticleSection>
            )}

            <ArticleSection id="faq" title="Sık Sorulan Sorular">
              <ArticleFaq faq={article.faq} />
            </ArticleSection>

            <ArticleSection id="trust" title="Güven ve yayın standardı">
              <ArticleTrust
                evidenceLevel={article.evidenceLevel}
                reviewedBy={article.reviewedBy}
              />
            </ArticleSection>
          </div>

          <aside className="xl:pt-1">
            <ArticleTableOfContents items={tableOfContents} />
          </aside>
        </div>
      </Section>
    </main>
  );
}
