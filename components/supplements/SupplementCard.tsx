import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Image from "next/image";
import FavoriteSupplementButton from "@/components/supplements/FavoriteSupplementButton";
import SupplementEvidenceBadge from "@/components/supplements/SupplementEvidenceBadge";
import type { EvidenceLevel, SupplementCategory } from "@/lib/supplements/types";

type SupplementCardProps = {
  name: string;
  category: SupplementCategory;
  evidenceLevel: EvidenceLevel;
  href: string;
  purpose: string;
  slug: string;
  image: string;
};

export default function SupplementCard({ name, category, evidenceLevel, href, purpose, slug, image }: SupplementCardProps) {
  return (
    <div className="relative h-full">
      <FavoriteSupplementButton slug={slug} className="absolute right-5 top-5 z-10" />
      <Card
        href={href}
        variant="subtle"
        className="flex h-full flex-col p-5 hover:border-[#C9A14A]/35 sm:p-6"
        mediaClassName="mb-0"
        childrenClassName="flex flex-1 flex-col"
        media={
          <div className="relative flex h-44 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_42%,rgba(201,161,74,.16),transparent_48%),linear-gradient(145deg,#131313,#080808)] px-4 pb-3 pt-4">
            <span className="relative z-[1] text-[0.625rem] font-medium uppercase tracking-[0.2em] text-[#C9A14A]/75">
              Supplement Science
            </span>
            <div className="relative min-h-0 flex-1">
              <Image
                src={image}
                alt={`${name} supplement görseli`}
                fill
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
                className="object-contain p-1 opacity-90 transition-transform duration-500 group-hover:scale-[1.035]"
              />
            </div>
            <h3 className="relative z-[1] line-clamp-2 min-h-12 pr-12 text-xl font-semibold leading-6 tracking-[-0.02em] text-white">
              {name}
            </h3>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{category}</Badge>
          <SupplementEvidenceBadge evidenceLevel={evidenceLevel} />
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-400">{purpose}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[#C9A14A] transition-colors group-hover:text-[#E0BE70]">
          İncele <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </Card>
    </div>
  );
}
