import type { ChangeEvent } from "react";

import type {
  CalculatorField as CalculatorFieldDefinition,
  CalculatorFieldValue,
} from "@/lib/calculators";

type CalculatorFieldProps = {
  field: CalculatorFieldDefinition;
  value: CalculatorFieldValue | undefined;
  error?: string;
  onChange: (name: string, value: CalculatorFieldValue) => void;
};

const inputClasses =
  "w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-[#C9A14A]";

export default function CalculatorField({
  field,
  value,
  error,
  onChange,
}: CalculatorFieldProps) {
  const id = `calculator-${field.name}`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const hasError = Boolean(error);
  const ariaDescribedBy = [
    field.helperText ? descriptionId : undefined,
    error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(field.name, event.target.value);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-lg font-medium text-white">
          {field.label}
          {field.required && <span className="ml-1 text-[#C9A14A]">*</span>}
        </label>
        {field.unit && <span className="text-sm text-neutral-500">{field.unit}</span>}
      </div>

      {field.type === "number" && (
        <input
          id={id}
          name={field.name}
          type="number"
          value={typeof value === "string" ? value : ""}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step}
          required={field.required}
          aria-describedby={ariaDescribedBy}
          aria-invalid={hasError}
          onChange={handleTextChange}
          className={inputClasses}
        />
      )}

      {field.type === "select" && (
        <select
          id={id}
          name={field.name}
          value={typeof value === "string" ? value : ""}
          required={field.required}
          aria-describedby={ariaDescribedBy}
          aria-invalid={hasError}
          onChange={handleTextChange}
          className={inputClasses}
        >
          <option value="">Seçiniz</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {field.type === "radio" && (
        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-describedby={ariaDescribedBy}>
          {field.options?.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-700 bg-zinc-900 p-4 transition hover:border-[#C9A14A]/60"
            >
              <input
                type="radio"
                name={field.name}
                value={option.value}
                checked={value === option.value}
                required={field.required}
                onChange={handleTextChange}
                className="mt-1 accent-[#C9A14A]"
              />
              <span>
                <span className="block font-medium text-white">{option.label}</span>
                {option.description && (
                  <span className="mt-1 block text-sm text-neutral-400">{option.description}</span>
                )}
              </span>
            </label>
          ))}
        </div>
      )}

      {field.type === "toggle" && (
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-zinc-700 bg-zinc-900 p-4 transition hover:border-[#C9A14A]/60">
          <span className="text-sm text-neutral-300">{field.helperText ?? field.label}</span>
          <input
            id={id}
            name={field.name}
            type="checkbox"
            checked={value === true}
            required={field.required}
            onChange={(event) => onChange(field.name, event.target.checked)}
            className="h-5 w-5 accent-[#C9A14A]"
          />
        </label>
      )}

      {field.helperText && (
        <p id={descriptionId} className="mt-2 text-sm text-neutral-500">
          {field.helperText}
        </p>
      )}

      {error && (
        <p id={errorId} className="mt-2 text-sm text-amber-300">
          {error}
        </p>
      )}
    </div>
  );
}
