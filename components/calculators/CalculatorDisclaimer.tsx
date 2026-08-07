import type { ReactNode } from "react";

export const CALCULATOR_DISCLAIMER =
  "Bu araç genel bilgilendirme amaçlı tahmin sunar. Sonuçlar kişisel özellikler, ölçüm yöntemleri ve hedeflere göre değişebilir.";

type CalculatorDisclaimerProps = {
  children?: ReactNode;
  className?: string;
};

export default function CalculatorDisclaimer({
  children,
  className,
}: CalculatorDisclaimerProps) {
  return (
    <div className={`space-y-2 text-sm leading-6 text-neutral-500 ${className ?? ""}`}>
      <p>{CALCULATOR_DISCLAIMER}</p>
      {children && <p>{children}</p>}
    </div>
  );
}
