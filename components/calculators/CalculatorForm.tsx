"use client";

import type { FormEvent, ReactNode } from "react";

import CalculatorField from "@/components/calculators/CalculatorField";
import type {
  CalculatorField as CalculatorFieldDefinition,
  CalculatorFormValues,
  CalculatorValidationErrors,
} from "@/lib/calculators";

type CalculatorFormProps = {
  fields: readonly CalculatorFieldDefinition[];
  values: CalculatorFormValues;
  errors?: CalculatorValidationErrors;
  onChange: (name: string, value: CalculatorFormValues[string]) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  children?: ReactNode;
  className?: string;
};

export default function CalculatorForm({
  fields,
  values,
  errors,
  onChange,
  onSubmit,
  children,
  className,
}: CalculatorFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className={`space-y-8 ${className ?? ""}`}>
      {fields.map((field) => (
        <CalculatorField
          key={field.name}
          field={field}
          value={values[field.name]}
          error={errors?.[field.name]}
          onChange={onChange}
        />
      ))}

      {children}
    </form>
  );
}
