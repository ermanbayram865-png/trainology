"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import ArticleGrid from "@/components/articles/ArticleGrid";
import ArticleHeader from "@/components/articles/ArticleHeader";
import CTAButton from "@/components/ui/CTAButton";
import EmptyState from "@/components/ui/EmptyState";
import {
  filterArticleIndex,
  getArticleCategories,
  type ArticleListItem,
  type ArticleSort,
} from "@/lib/articles/discovery";

type ArticleLibraryProps = { articles: readonly ArticleListItem[] };

const sortOptions: readonly { label: string; value: ArticleSort }[] = [
  { label: "En yeni", value: "newest" },
  { label: "En eski", value: "oldest" },
  { label: "Okuma süresi", value: "reading-time" },
];

export default function ArticleLibrary({ articles }: ArticleLibraryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const requestedSort = searchParams.get("sort");
  const sort = sortOptions.some((option) => option.value === requestedSort)
    ? requestedSort as ArticleSort
    : "newest";
  const categories = useMemo(() => getArticleCategories(articles), [articles]);
  const filteredArticles = useMemo(
    () => filterArticleIndex(articles, { query, category, sort }),
    [articles, category, query, sort],
  );

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const serialized = params.toString();
    router.replace(serialized ? `${pathname}?${serialized}` : pathname, { scroll: false });
  }

  function resetFilters() {
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="space-y-10">
      <ArticleHeader count={articles.length} categories={categories} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem] lg:items-end">
        <label className="block">
          <span className="sr-only">Makalelerde ara</span>
          <span className="relative block">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#C9A14A]" />
            <input value={query} onChange={(event) => updateParams({ q: event.target.value })} placeholder="Makalelerde ara..." className="min-h-14 w-full rounded-2xl border border-white/10 bg-[#0A0A0A]/90 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-[#C9A14A]/70 focus:ring-2 focus:ring-[#C9A14A]/20" />
          </span>
        </label>
        <label className="block text-sm font-medium text-neutral-300">
          <span className="mb-2 block">Sırala</span>
          <select value={sort} onChange={(event) => updateParams({ sort: event.target.value === "newest" ? "" : event.target.value })} className="min-h-12 w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 text-white outline-none transition focus:border-[#C9A14A]/70">
            {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Makale kategori filtreleri">
        <FilterButton active={!category} onClick={() => updateParams({ category: "" })}>Tümü</FilterButton>
        {categories.map((item) => <FilterButton key={item} active={category === item} onClick={() => updateParams({ category: category === item ? "" : item })}>{item}</FilterButton>)}
      </div>
      <div className="flex items-center justify-between gap-4 text-sm text-neutral-400" aria-live="polite">
        <p>{filteredArticles.length} içerik bulundu</p>
        {(query || category || sort !== "newest") && <button type="button" onClick={resetFilters} className="font-medium text-[#C9A14A] transition hover:text-[#D6B25E] focus-visible:outline-none focus-visible:underline">Filtreleri temizle</button>}
      </div>
      {filteredArticles.length > 0 ? <ArticleGrid articles={filteredArticles} /> : <EmptyState title="Bu filtrelerle eşleşen içerik bulunamadı." description="Arama ifadenizi veya kategori seçiminizi değiştirerek tekrar deneyin." button={<CTAButton type="button" variant="secondary" onClick={resetFilters}>Filtreleri Temizle</CTAButton>} />}
    </div>
  );
}

type FilterButtonProps = { children: string; active: boolean; onClick: () => void };
function FilterButton({ children, active, onClick }: FilterButtonProps) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A] ${active ? "border-[#C9A14A]/70 bg-[#C9A14A]/15 text-[#D6B25E]" : "border-white/10 bg-black/20 text-neutral-400 hover:border-[#C9A14A]/40 hover:text-white"}`}>{children}</button>;
}
