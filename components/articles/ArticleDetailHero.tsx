import Image from "next/image";
import Link from "next/link";

import ArticleEvidenceBadge from "@/components/articles/ArticleEvidenceBadge";
import ArticleMetadata from "@/components/articles/ArticleMetadata";
import ShareActions from "@/components/articles/ShareActions";
import Badge from "@/components/ui/Badge";
import { removeInlineCitationMarkers } from "@/lib/articles/formatters";
import type { Article } from "@/lib/articles/types";
import { absoluteUrl } from "@/lib/seo";

type ArticleDetailHeroProps = {
  article: Article;
};

export default function ArticleDetailHero({ article }: ArticleDetailHeroProps) {
  const hasImage = article.image.trim().length > 0;

  return (
    <section
      aria-labelledby="article-title"
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] p-6 shadow-[0_28px_80px_rgba(0,0,0,.32)] sm:p-8 lg:p-10"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-[#C9A14A]/[0.055] blur-3xl" />
      <div className="relative">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="transition hover:text-[#C9A14A] focus-visible:outline-none focus-visible:underline">Ana Sayfa</Link>
          <span aria-hidden="true">/</span>
          <Link href="/articles" className="transition hover:text-[#C9A14A] focus-visible:outline-none focus-visible:underline">Article Library</Link>
          <span aria-hidden="true">/</span>
          <span className="max-w-full truncate text-neutral-300">{article.title}</span>
        </nav>

        <div className={`mt-8 grid items-center gap-10 ${hasImage ? "lg:grid-cols-[minmax(0,1fr)_minmax(20rem,30rem)] lg:gap-14" : ""}`}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="neutral">{article.category}</Badge>
              <ArticleEvidenceBadge evidenceLevel={article.evidenceLevel} />
            </div>
            <h1 id="article-title" className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
              {article.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300 sm:text-lg">
              {removeInlineCitationMarkers(article.summary)}
            </p>

            <div className="mt-8">
              <ArticleMetadata
                evidenceLevel={article.evidenceLevel}
                publishedDate={article.publishedDate}
                updatedDate={article.updatedDate}
                readingTime={article.readingTime}
                author={article.author}
                reviewedBy={article.reviewedBy}
              />
            </div>
            <div className="mt-6">
              <ShareActions url={absoluteUrl(`/articles/${article.slug}`)} />
            </div>
          </div>

          {hasImage && (
            <div className="relative mx-auto aspect-square w-full max-w-[30rem] overflow-hidden rounded-[1.75rem] border border-[#C9A14A]/20 bg-[radial-gradient(circle_at_50%_42%,rgba(201,161,74,.1),transparent_58%),#070707] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,.02),0_24px_60px_rgba(0,0,0,.38)] sm:p-4">
              <div className="relative size-full overflow-hidden rounded-[1.25rem] border border-white/[0.06] bg-black">
                <Image
                  src={article.image}
                  alt={`${article.title} kapak görseli`}
                  fill
                  preload
                  sizes="(min-width: 1024px) 480px, (min-width: 640px) 70vw, 88vw"
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
