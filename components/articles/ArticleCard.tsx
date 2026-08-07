import { Clock3 } from "lucide-react";
import Image from "next/image";

import ArticleEvidenceBadge from "@/components/articles/ArticleEvidenceBadge";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { removeInlineCitationMarkers } from "@/lib/articles/formatters";
import type { ArticleCategory, ArticleEvidenceLevel } from "@/lib/articles/types";

type ArticleCardProps = {
  title: string;
  category: ArticleCategory;
  evidenceLevel: ArticleEvidenceLevel;
  readingTime: string;
  summary: string;
  image: string;
  href: string;
};

export default function ArticleCard({
  title,
  category,
  evidenceLevel,
  readingTime,
  summary,
  image,
  href,
}: ArticleCardProps) {
  const hasImage = image.trim().length > 0;

  return (
    <Card
      title={title}
      description={removeInlineCitationMarkers(summary)}
      href={href}
      variant="subtle"
      className="group h-full border-white/10 hover:border-[#C9A14A]/45"
      media={
        hasImage ? (
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-black">
            <Image
              src={image}
              alt={`${title} görseli`}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
              className="object-cover opacity-75 transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-transparent" />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="aspect-[16/9] rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(201,161,74,.22),transparent_45%),linear-gradient(135deg,#151515,#090909)]"
          />
        )
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="neutral">{category}</Badge>
        <ArticleEvidenceBadge evidenceLevel={evidenceLevel} />
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
          <Clock3 aria-hidden="true" className="size-3.5" />
          {readingTime} okuma
        </span>
      </div>
    </Card>
  );
}
