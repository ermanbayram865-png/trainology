import type { CalculatorField, CalculatorFieldValue } from "./types";

export type NumberValidationOptions = {
  label?: string;
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
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

  if (options.integer && !Number.isInteger(numericValue)) {
    return `${label} tam sayı olmalıdır.`;
  }

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
      integer: field.integer,
    });
  }

  const requiredError = field.required
    ? validateRequired(value, field.label)
    : undefined;

  if (requiredError) {
    return requiredError;
  }

  if (
    typeof value === "string" &&
    value !== "" &&
    field.options &&
    !field.options.some((option) => option.value === value)
  ) {
    return `${field.label} için geçerli bir seçim yap.`;
  }

  return undefined;
}
