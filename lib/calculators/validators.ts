import type { CalculatorField, CalculatorFieldValue } from "./types";

export type NumberValidationOptions = {
  label?: string;
  required?: boolean;
  min?: number;
  max?: number;
};

export function validateRequired(
  value: CalculatorFieldValue | undefined,
  label = "Bu alan",
): string | undefined {
  if (value === undefined || value === "") {
    return `${label} gereklidir.`;
  }

  return undefined;
}

export function validateNumber(
  value: CalculatorFieldValue | undefined,
  options: NumberValidationOptions = {},
): string | undefined {
  const label = options.label ?? "Bu alan";

  if (value === undefined || value === "") {
    return options.required ? `${label} gereklidir.` : undefined;
  }

  if (typeof value === "boolean" || !Number.isFinite(Number(value))) {
    return `${label} geçerli bir sayı olmalıdır.`;
  }

  const numericValue = Number(value);

  if (options.min !== undefined && numericValue < options.min) {
    return `${label} en az ${options.min} olmalıdır.`;
  }

  if (options.max !== undefined && numericValue > options.max) {
    return `${label} en fazla ${options.max} olmalıdır.`;
  }

  return undefined;
}

export function validateCalculatorField(
  field: CalculatorField,
  value: CalculatorFieldValue | undefined,
): string | undefined {
  if (field.type === "number") {
    return validateNumber(value, {
      label: field.label,
      required: field.required,
      min: field.min,
      max: field.max,
    });
  }

  return field.required ? validateRequired(value, field.label) : undefined;
}
