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
  "calculator-input px-4 py-3";

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
        <label htmlFor={id} className="calculator-label">
          {field.label}
          {field.required && <span className="ml-1 text-[var(--calculator-gold)]">*</span>}
        </label>
        {field.unit && <span className="calculator-helper !mt-0">{field.unit}</span>}
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
              data-selected={value === option.value}
              className="calculator-choice flex min-h-12 cursor-pointer items-start gap-3 p-3"
            >
              <input
                type="radio"
                name={field.name}
                value={option.value}
                checked={value === option.value}
                required={field.required}
                onChange={handleTextChange}
                className="mt-1 accent-[var(--calculator-gold)]"
              />
              <span>
                <span className="block font-medium text-[var(--calculator-text-primary)]">{option.label}</span>
                {option.description && (
                  <span className="calculator-helper block">{option.description}</span>
                )}
              </span>
            </label>
          ))}
        </div>
      )}

      {field.type === "toggle" && (
        <label data-selected={value === true} className="calculator-choice flex min-h-12 cursor-pointer items-center justify-between gap-4 p-3">
          <span className="calculator-label">{field.helperText ?? field.label}</span>
          <input
            id={id}
            name={field.name}
            type="checkbox"
            checked={value === true}
            required={field.required}
            onChange={(event) => onChange(field.name, event.target.checked)}
            className="h-5 w-5 accent-[var(--calculator-gold)]"
          />
        </label>
      )}

      {field.helperText && (
        <p id={descriptionId} className="calculator-helper">
          {field.helperText}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="calculator-error">
          {error}
        </p>
      )}
    </div>
  );
}
