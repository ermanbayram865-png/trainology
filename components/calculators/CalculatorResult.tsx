import type { CalculatorResult as CalculatorResultData } from "@/lib/calculators";

type CalculatorResultProps = CalculatorResultData & {
  className?: string;
};

const colorClasses = {
  gold: "text-[#C9A14A]",
  success: "text-emerald-300",
  neutral: "text-white",
  warning: "text-amber-300",
} as const;

export default function CalculatorResult({
  title,
  value,
  unit,
  color = "gold",
  explanation,
  className,
}: CalculatorResultProps) {
  return (
    <div className={className}>
      <p className="text-sm text-neutral-400">{title}</p>
      <p className={`mt-3 text-4xl font-bold ${colorClasses[color]}`}>
        {value}
        {unit && <span className="ml-2 text-xl font-semibold">{unit}</span>}
      </p>
      {explanation && <p className="mt-3 text-sm leading-6 text-neutral-500">{explanation}</p>}
    </div>
  );
}
