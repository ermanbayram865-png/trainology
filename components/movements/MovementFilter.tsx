"use client";

import type { ChangeEvent } from "react";

import type { Movement, MovementFilters } from "@/lib/movements/types";

type MovementFilterProps = {
  movements: readonly Movement[];
  filters: MovementFilters;
  onChange: (filters: MovementFilters) => void;
};

function getUniqueValues<T extends string>(values: readonly T[]) {
  return [...new Set(values)];
}

const selectClasses =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-[#C9A14A]";

export default function MovementFilter({
  movements,
  filters,
  onChange,
}: MovementFilterProps) {
  const muscleGroups = getUniqueValues(movements.map((movement) => movement.muscleGroup));
  const equipment = getUniqueValues(movements.map((movement) => movement.equipment));
  const difficulties = getUniqueValues(movements.map((movement) => movement.difficulty));

  function handleChange(
    event: ChangeEvent<HTMLSelectElement>,
    key: keyof MovementFilters,
  ) {
    const value = event.target.value;
    onChange({ ...filters, [key]: value || undefined });
  }

  return (
    <div className="grid gap-4 rounded-3xl border border-white/10 bg-[#0B0B0B] p-5 md:grid-cols-3">
      <label className="text-sm text-neutral-400">
        Kas grubu
        <select
          value={filters.muscleGroup ?? ""}
          onChange={(event) => handleChange(event, "muscleGroup")}
          className={`mt-2 ${selectClasses}`}
        >
          <option value="">Tümü</option>
          {muscleGroups.map((muscleGroup) => (
            <option key={muscleGroup} value={muscleGroup}>{muscleGroup}</option>
          ))}
        </select>
      </label>

      <label className="text-sm text-neutral-400">
        Ekipman
        <select
          value={filters.equipment ?? ""}
          onChange={(event) => handleChange(event, "equipment")}
          className={`mt-2 ${selectClasses}`}
        >
          <option value="">Tümü</option>
          {equipment.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="text-sm text-neutral-400">
        Zorluk
        <select
          value={filters.difficulty ?? ""}
          onChange={(event) => handleChange(event, "difficulty")}
          className={`mt-2 ${selectClasses}`}
        >
          <option value="">Tümü</option>
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>{difficulty}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
