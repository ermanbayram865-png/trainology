"use client";

import { Check, ChevronDown, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

export const referenceInputClasses =
  "calculator-input mt-1.5 px-3.5 text-base";

export function ReferencePanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`calculator-surface p-5 sm:p-7 lg:px-8 lg:py-6 [@media(min-width:1024px)_and_(max-height:850px)]:px-7 [@media(min-width:1024px)_and_(max-height:850px)]:py-4 ${className ?? ""}`}>
      {children}
    </div>
  );
}

type SelectionOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

export function SelectionCards<T extends string>({
  legend,
  name,
  value,
  options,
  columns = 3,
  error,
  onChange,
}: {
  legend: string;
  name: string;
  value: T | "";
  options: readonly SelectionOption<T>[];
  columns?: 2 | 3;
  error?: string;
  onChange: (value: T) => void;
}) {
  const errorId = `${name}-error`;

  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-bold text-[#102536]">{legend}</legend>
      <div className={`mt-2 grid gap-2.5 ${columns === 2 ? "sm:grid-cols-2" : "lg:grid-cols-3"}`}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              data-selected={selected}
              className="calculator-choice relative flex min-h-16 cursor-pointer items-start gap-2.5 px-3.5 py-3 [@media(min-width:1024px)_and_(max-height:850px)]:min-h-14 [@media(min-width:1024px)_and_(max-height:850px)]:py-2.5"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
                  selected
                    ? "border-[#9f7b38] bg-[#9f7b38] text-white"
                    : "border-[#11283a]/25 text-transparent"
                }`}
              >
                <Check className="size-3" />
              </span>
              <span>
                <span className="block text-sm font-bold">{option.label}</span>
                {option.description && (
                  <span className="mt-0.5 block text-xs leading-4 text-[#64727d]">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </fieldset>
  );
}

export function ScopeConfirmation({
  checked,
  onChange,
  label = "Genel yetişkin kapsamındayım",
  disclosure,
  error,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disclosure: ReactNode;
  error?: string;
}) {
  return (
    <div className="calculator-choice px-4 py-3 [@media(min-width:1024px)_and_(max-height:850px)]:py-2.5">
      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-bold">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 accent-[#9f7b38]"
        />
        {label}
      </label>
      <details className="group border-t border-[#11283a]/8 pt-2">
        <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between text-xs font-bold text-[#6a5429] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">
          Kimler için uygun değildir?
          <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="pt-2 text-xs leading-5 text-[#657581]">{disclosure}</div>
      </details>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

export function MethodologyDisclosure({
  children,
  label = "Nasıl hesaplandı?",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <details className="calculator-disclosure group mt-4 px-4 py-2.5">
      <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f7b38] [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown aria-hidden="true" className="size-4 text-[#8c6a2d] transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-2 border-t border-[#11283a]/8 pt-3 text-sm leading-6 text-[#5c6c78]">
        {children}
      </div>
    </details>
  );
}

export function EditReferenceButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="calculator-action calculator-action--secondary mt-4 inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-bold"
    >
      <RotateCcw aria-hidden="true" className="size-4" />
      Referansı Düzenle
    </button>
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-semibold text-[#9d322f]">
      {children}
    </p>
  );
}
