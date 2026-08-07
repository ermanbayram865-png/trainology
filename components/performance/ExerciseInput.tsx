"use client";

import type { ChangeEvent } from "react";

import Card from "@/components/ui/Card";
import type { PerformanceExerciseDefinition } from "@/lib/performance";
import type { PerformanceExerciseInput } from "@/types/performance";

type ExerciseInputProps = {
  definition: PerformanceExerciseDefinition;
  value: PerformanceExerciseInput;
  errors: Partial<Record<"weight" | "repetitions" | "sets" | "rir", string>>;
  onChange: (nextValue: PerformanceExerciseInput) => void;
};

const fields = [
  { key: "weight", label: "Ağırlık", unit: "kg", min: 1, max: 500, step: 0.5 },
  { key: "repetitions", label: "Tekrar", unit: "rep", min: 1, max: 20, step: 1 },
  { key: "sets", label: "Set", unit: "set", min: 1, max: 20, step: 1 },
] as const;

export default function ExerciseInput({ definition, value, errors, onChange }: ExerciseInputProps) {
  function updateField(event: ChangeEvent<HTMLInputElement>) {
    const { name, value: nextValue } = event.target;
    onChange({ ...value, [name]: nextValue });
  }

  return (
    <Card variant="subtle" className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#C9A14A]">{definition.categoryLabel}</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{definition.name}</h3>
          <p className="mt-1 text-sm leading-6 text-neutral-400">{definition.description}</p>
        </div>
        <label className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-neutral-300">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(event) => onChange({ ...value, enabled: event.target.checked })}
            className="h-4 w-4 accent-[#C9A14A]"
          />
          Dahil et
        </label>
      </div>

      {value.enabled && (
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {fields.map((field) => (
            <label key={field.key} className="block text-sm font-medium text-neutral-200">
              {field.label}
              <span className="ml-1 text-neutral-500">({field.unit})</span>
              <input
                name={field.key}
                type="number"
                inputMode="decimal"
                min={field.min}
                max={field.max}
                step={field.step}
                value={value[field.key]}
                onChange={updateField}
                className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-white outline-none transition focus:border-[#C9A14A]/70"
              />
              {errors[field.key] && <span className="mt-1 block text-xs text-amber-300">{errors[field.key]}</span>}
            </label>
          ))}
          <label className="block text-sm font-medium text-neutral-200">
            RIR <span className="text-neutral-500">(opsiyonel)</span>
            <input
              name="rir"
              type="number"
              inputMode="numeric"
              min="0"
              max="10"
              step="1"
              value={value.rir}
              onChange={updateField}
              className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-white outline-none transition focus:border-[#C9A14A]/70"
            />
            {errors.rir && <span className="mt-1 block text-xs text-amber-300">{errors.rir}</span>}
          </label>
        </div>
      )}
    </Card>
  );
}
