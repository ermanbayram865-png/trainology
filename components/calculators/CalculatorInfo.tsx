import type { ReactNode } from "react";

type CalculatorInfoProps = {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function CalculatorInfo({
  title = "Bilgilendirme",
  children,
  className,
}: CalculatorInfoProps) {
  return (
    <aside className={`calculator-disclosure p-5 text-[var(--calculator-text-primary)] sm:p-6 ${className ?? ""}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-[var(--calculator-text-secondary)]">{children}</div>
    </aside>
  );
}
