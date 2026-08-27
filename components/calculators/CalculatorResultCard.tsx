import type { ReactNode } from "react";

import CalculatorResult from "@/components/calculators/CalculatorResult";
import type { CalculatorResult as CalculatorResultData } from "@/lib/calculators";

type CalculatorResultCardProps = {
  results: readonly CalculatorResultData[];
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
};

export default function CalculatorResultCard({
  results,
  title,
  description,
  className,
}: CalculatorResultCardProps) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-[#0B0B0B] p-6 sm:p-7 ${className ?? ""}`}>
      {(title || description) && (
        <header className="mb-5">
          {title && <h2 className="text-2xl font-semibold text-white">{title}</h2>}
          {description && <p className="mt-3 text-neutral-400">{description}</p>}
        </header>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.map((result) => (
          <CalculatorResult key={result.title} {...result} />
        ))}
      </div>
    </section>
  );
}
