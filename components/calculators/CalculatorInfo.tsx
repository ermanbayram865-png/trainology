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
    <aside className={`rounded-3xl border border-[#C9A14A]/20 bg-[#C9A14A]/5 p-6 ${className ?? ""}`}>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-neutral-400">{children}</div>
    </aside>
  );
}
