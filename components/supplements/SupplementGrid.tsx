import SupplementCard from "@/components/supplements/SupplementCard";
import type { Supplement } from "@/lib/supplements/types";

type SupplementGridProps = {
  supplements: readonly Supplement[];
};

export default function SupplementGrid({ supplements }: SupplementGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {supplements.map((supplement) => (
        <SupplementCard
          key={supplement.id}
          name={supplement.name}
          category={supplement.category}
          evidenceLevel={supplement.evidenceLevel}
          purpose={supplement.evidenceContent.oneLiner}
          slug={supplement.slug}
          image={supplement.image}
          href={`/supplements/${supplement.slug}`}
        />
      ))}
    </div>
  );
}
