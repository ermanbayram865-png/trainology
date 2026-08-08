"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import SupplementGrid from "@/components/supplements/SupplementGrid";
import SupplementHeader from "@/components/supplements/SupplementHeader";
import CTAButton from "@/components/ui/CTAButton";
import EmptyState from "@/components/ui/EmptyState";
import { evidenceOrder, filterSupplements, type SupplementSort } from "@/lib/supplements/discovery";
import type { Supplement } from "@/lib/supplements/types";

const sorts: readonly { label: string; value: SupplementSort }[] = [{ label: "A–Z", value: "a-z" }, { label: "Z–A", value: "z-a" }, { label: "Kanıt düzeyi", value: "evidence" }];

export default function SupplementLibrary({ supplements }: { supplements: readonly Supplement[] }) {
  const pathname = usePathname(); const router = useRouter(); const params = useSearchParams();
  const query = params.get("q") ?? ""; const category = params.get("category") ?? ""; const evidence = params.get("evidence") ?? "";
  const selectedSort = sorts.some((sort) => sort.value === params.get("sort")) ? params.get("sort") as SupplementSort : "a-z";
  const categories = useMemo(() => Array.from(new Set(supplements.map((item) => item.category))), [supplements]);
  const evidenceLevels = useMemo(() => evidenceOrder.filter((item) => supplements.some((supplement) => supplement.evidenceLevel === item)), [supplements]);
  const results = useMemo(() => filterSupplements(supplements, { query, category, evidence, sort: selectedSort }), [category, evidence, query, selectedSort, supplements]);
  function update(next: Record<string, string>) { const nextParams = new URLSearchParams(params.toString()); Object.entries(next).forEach(([key, value]) => value ? nextParams.set(key, value) : nextParams.delete(key)); const value = nextParams.toString(); router.replace(value ? `${pathname}?${value}` : pathname, { scroll: false }); }
  const clear = () => router.replace(pathname, { scroll: false });
  return <div className="space-y-10"><SupplementHeader count={supplements.length} /><div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_11rem] lg:items-end"><label><span className="sr-only">Supplementlerde ara</span><span className="relative block"><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#C9A14A]" /><input value={query} onChange={(event) => update({ q: event.target.value })} placeholder="Supplementlerde ara..." className="min-h-14 w-full rounded-2xl border border-white/10 bg-[#0A0A0A] py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-[#C9A14A]/70 focus:ring-2 focus:ring-[#C9A14A]/20" /></span></label><label className="text-sm text-neutral-300"><span className="mb-2 block">Sırala</span><select value={selectedSort} onChange={(event) => update({ sort: event.target.value === "a-z" ? "" : event.target.value })} className="min-h-12 w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 text-white outline-none focus:border-[#C9A14A]/70">{sorts.map((sort) => <option key={sort.value} value={sort.value}>{sort.label}</option>)}</select></label></div><FilterGroup label="Kategori" values={categories} selected={category} onChange={(value) => update({ category: value === category ? "" : value })} /><FilterGroup label="Kanıt düzeyi" values={evidenceLevels} selected={evidence} onChange={(value) => update({ evidence: value === evidence ? "" : value })} /><div className="flex items-center justify-between text-sm text-neutral-400" aria-live="polite"><p>{results.length} supplement bulundu</p>{(query || category || evidence || selectedSort !== "a-z") && <button type="button" onClick={clear} className="font-medium text-[#C9A14A] hover:text-[#D6B25E] focus-visible:outline-none focus-visible:underline">Filtreleri temizle</button>}</div>{results.length ? <SupplementGrid supplements={results} /> : <EmptyState title="Bu filtrelerle eşleşen supplement bulunamadı." description="Arama ifadenizi veya filtrelerinizi değiştirerek tekrar deneyin." button={<CTAButton type="button" variant="secondary" onClick={clear}>Filtreleri Temizle</CTAButton>} />}</div>;
}

function FilterGroup<T extends string>({ label, values, selected, onChange }: { label: string; values: readonly T[]; selected: string; onChange: (value: T) => void }) { return <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{label}</p><div className="flex flex-wrap gap-2"><button type="button" aria-pressed={!selected} onClick={() => onChange("" as T)} className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A] ${!selected ? "border-[#C9A14A]/70 bg-[#C9A14A]/15 text-[#D6B25E]" : "border-white/10 text-neutral-400 hover:text-white"}`}>Tümü</button>{values.map((value) => <button key={value} type="button" aria-pressed={selected === value} onClick={() => onChange(value)} className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A] ${selected === value ? "border-[#C9A14A]/70 bg-[#C9A14A]/15 text-[#D6B25E]" : "border-white/10 text-neutral-400 hover:text-white"}`}>{value}</button>)}</div></div>; }
