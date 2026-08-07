import type { ReactNode } from "react";

type CalculatorSectionProps = {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function CalculatorSection({
  title,
  description,
  children,
  className,
}: CalculatorSectionProps) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-[#0B0B0B] p-6 sm:p-8 ${className ?? ""}`}>
      {(title || description) && (
        <header className="mb-8">
          {title && <h2 className="text-2xl font-semibold text-white">{title}</h2>}
          {description && <p className="mt-3 text-neutral-400">{description}</p>}
        </header>
      )}

      {children}
    </section>
  );
}
