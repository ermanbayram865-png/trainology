"use client";

import type { ChangeEvent, ReactNode } from "react";
import { ChevronDown, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import type { Movement, MovementFilters } from "@/lib/movements/types";

type MovementFilterProps = {
  movements: readonly Movement[];
  filters: MovementFilters;
  onChange: (filters: MovementFilters) => void;
  query: string;
  onQueryChange: (query: string) => void;
  resultCount: number;
  onClear: () => void;
};

function getUniqueValues<T extends string>(values: readonly T[]) {
  return [...new Set(values)];
}

const selectClasses =
  "min-h-14 w-full rounded-2xl border border-white/10 bg-[#111113] px-4 text-sm font-medium text-white outline-none transition duration-300 hover:border-white/20 focus:border-[#C9A14A]/70 focus:ring-4 focus:ring-[#C9A14A]/10";

export default function MovementFilter({
  movements,
  filters,
  onChange,
  query,
  onQueryChange,
  resultCount,
  onClear,
}: MovementFilterProps) {
  const muscleGroups = getUniqueValues(movements.map((movement) => movement.muscleGroup));
  const equipment = getUniqueValues(movements.map((movement) => movement.equipment));
  const difficulties = getUniqueValues(movements.map((movement) => movement.difficulty));
  const hasActiveFilters = Boolean(query || filters.muscleGroup || filters.equipment || filters.difficulty);

  function handleChange(
    event: ChangeEvent<HTMLSelectElement>,
    key: keyof MovementFilters,
  ) {
    const value = event.target.value;
    onChange({ ...filters, [key]: value || undefined });
  }

  return (
    <section aria-labelledby="movement-filter-title" className="overflow-hidden rounded-[2rem] border border-[#C9A14A]/15 bg-[radial-gradient(circle_at_8%_0%,rgba(201,161,74,.09),transparent_30%),linear-gradient(145deg,#0D0D0E,#080808)] shadow-[0_24px_70px_rgba(0,0,0,.28)]">
      <div className="border-b border-white/[0.07] px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#C9A14A]/20 bg-[#C9A14A]/10 text-[#D6B25E]">
              <SlidersHorizontal aria-hidden="true" className="size-4" />
            </span>
            <div>
              <h2 id="movement-filter-title" className="text-base font-semibold tracking-[-0.01em] text-white">Hareketleri keşfet</h2>
              <p className="mt-1 text-sm text-neutral-500">Hedefine ve ekipmanına uygun egzersizi hızlıca bul.</p>
            </div>
          </div>
          <div aria-live="polite" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-neutral-400">
            <span className="size-1.5 rounded-full bg-[#C9A14A] shadow-[0_0_10px_rgba(201,161,74,.7)]" />
            <strong className="font-semibold text-white">{resultCount}</strong> hareket bulundu
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))]">
          <label>
            <span className="mb-2.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">Hareket ara</span>
            <span className="relative block">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-[1.125rem] -translate-y-1/2 text-[#C9A14A]" />
              <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Örn. bench press" className={`${selectClasses} pl-11 pr-4 placeholder:font-normal placeholder:text-neutral-600`} />
            </span>
          </label>

          <FilterSelect label="Kas grubu" value={filters.muscleGroup ?? ""} onChange={(event) => handleChange(event, "muscleGroup")}>
            <option value="">Tümü</option>
            {muscleGroups.map((muscleGroup) => <option key={muscleGroup} value={muscleGroup}>{muscleGroup}</option>)}
          </FilterSelect>

          <FilterSelect label="Ekipman" value={filters.equipment ?? ""} onChange={(event) => handleChange(event, "equipment")}>
            <option value="">Tümü</option>
            {equipment.map((item) => <option key={item} value={item}>{item}</option>)}
          </FilterSelect>

          <FilterSelect label="Zorluk" value={filters.difficulty ?? ""} onChange={(event) => handleChange(event, "difficulty")}>
            <option value="">Tümü</option>
            {difficulties.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
          </FilterSelect>
        </div>

        {hasActiveFilters && (
          <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 text-xs text-neutral-300">
              {query && <ActiveFilter label={`Arama: ${query}`} />}
              {filters.muscleGroup && <ActiveFilter label={filters.muscleGroup} />}
              {filters.equipment && <ActiveFilter label={filters.equipment} />}
              {filters.difficulty && <ActiveFilter label={filters.difficulty} />}
            </div>
            <button type="button" onClick={onClear} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium text-neutral-400 transition hover:bg-white/5 hover:text-[#D6B25E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A]">
              <RotateCcw aria-hidden="true" className="size-4" /> Filtreleri temizle
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
};

function FilterSelect({ label, value, onChange, children }: FilterSelectProps) {
  return (
    <label>
      <span className="mb-2.5 block text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">{label}</span>
      <span className="relative block">
        <select value={value} onChange={onChange} className={`${selectClasses} appearance-none pl-4 pr-11`}>
          {children}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
      </span>
    </label>
  );
}

function ActiveFilter({ label }: { label: string }) {
  return <span className="rounded-full border border-[#C9A14A]/20 bg-[#C9A14A]/[0.08] px-3 py-1.5 text-[#D6B25E]">{label}</span>;
}
