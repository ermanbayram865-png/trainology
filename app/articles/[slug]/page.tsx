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
    title: `${article.title} | Trainology`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedDate,
      modifiedTime: article.updatedDate,
      authors: [article.author],
      images: [{ url: article.image, alt: article.title }],
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
    "/supplements": "Supplement Kütüphanesi",
    "/supplements/creatine-monohydrate": "Creatine Monohydrate",
    "/supplements/omega-3": "Omega-3",
  };

  const relatedArticles = articles
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);

  const contentSectionTitles = [
    "Bilimsel çerçeve",
    "Uygulama bağlamı",
    "Dikkat edilmesi gerekenler",
  ];
  const contentSections = article.content.map((content, index) => ({
    id: `content-${index + 1}`,
    title: contentSectionTitles[index] ?? `Bilimsel not ${index + 1}`,
    content,
  }));
  const tableOfContents = [
    { id: "summary", label: "Özet" },
    { id: "key-points", label: "Ana noktalar" },
    ...contentSections.map(({ id, title }) => ({ id, label: title })),
    { id: "sources", label: "Kaynaklar" },
    { id: "related-tools", label: "İlgili araçlar" },
    ...(relatedArticles.length > 0
      ? [{ id: "related-content", label: "İlgili içerikler" }]
      : []),
    { id: "faq", label: "Sık sorulan sorular" },
    { id: "trust", label: "Yayın standardı" },
  ];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate,
    author: { "@type": "Organization", name: article.author },
    reviewedBy: { "@type": "Organization", name: article.reviewedBy },
    image: article.image,
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
          description={article.summary}
        />

        <ArticleMetadata
          publishedDate={article.publishedDate}
          updatedDate={article.updatedDate}
          readingTime={article.readingTime}
          author={article.author}
          reviewedBy={article.reviewedBy}
        />

        <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-16">
            <ArticleSection id="summary" title="Özet">
              <Card description={article.summary} variant="subtle" className="max-w-4xl" />
            </ArticleSection>

            <ArticleSection id="key-points" title="Ana noktalar">
              <Card variant="subtle" className="max-w-4xl">
                <ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-neutral-300">
                  {contentSections.map((section) => (
                    <li key={section.id}>{section.content}</li>
                  ))}
                </ul>
              </Card>
            </ArticleSection>

            <ArticleSection title="İçerik bölümleri">
              <ArticleContent sections={contentSections} />
            </ArticleSection>

            <ArticleSection id="sources" title="Kaynaklar">
              <ArticleSources sources={article.sources} />
            </ArticleSection>

            <ArticleSection id="related-tools" title="İlgili araçlar">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {article.relatedTools.map((href) => (
                  <Card
                    key={href}
                    href={href}
                    title={toolLabels[href] ?? "Trainology aracı"}
                    description="Bu rehberle ilişkili araca git."
                    variant="subtle"
                    className="p-6"
                  />
                ))}
              </div>
            </ArticleSection>

            {relatedArticles.length > 0 && (
              <ArticleSection id="related-content" title="İlgili içerikler">
                <ArticleRelatedContent articles={relatedArticles} />
              </ArticleSection>
            )}

            <ArticleSection id="faq" title="Sık sorulan sorular">
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
