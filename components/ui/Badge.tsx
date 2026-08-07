import type { ReactNode } from "react";

export type BadgeVariant = "gold" | "neutral" | "success" | "warning";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  gold: "border-[#C9A14A]/30 bg-[#C9A14A]/10 text-[#C9A14A]",
  neutral: "border-white/10 bg-white/5 text-neutral-300",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-300",
};

export default function Badge({
  children,
  variant = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${variantClasses[variant]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
