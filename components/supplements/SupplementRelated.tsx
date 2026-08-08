import SupplementGrid from "@/components/supplements/SupplementGrid";
import type { Supplement } from "@/lib/supplements/types";

export default function SupplementRelated({ supplements }: { supplements: readonly Supplement[] }) {
  if (!supplements.length) return null;
  return <section><h2 className="text-2xl font-semibold text-white">İlgili Supplementler</h2><p className="mt-2 text-neutral-400">Kategori ve mevcut kanıt düzeyi benzerliğine göre sıralanır.</p><div className="mt-6"><SupplementGrid supplements={supplements} /></div></section>;
}
