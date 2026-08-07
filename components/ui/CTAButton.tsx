import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export type CTAButtonVariant = "primary" | "secondary" | "ghost";

type CTAButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: CTAButtonVariant;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

const variantClasses: Record<CTAButtonVariant, string> = {
  primary:
    "border-[#C9A14A] bg-[#C9A14A] text-black shadow-[0_10px_28px_rgba(201,161,74,.16)] hover:-translate-y-1 hover:bg-[#D4AF37] hover:shadow-[0_0_30px_rgba(201,161,74,.35)]",
  secondary:
    "border-zinc-700 bg-white/[.02] text-white hover:-translate-y-1 hover:border-[#C9A14A] hover:text-[#C9A14A]",
  ghost:
    "border-transparent bg-transparent text-[#C9A14A] hover:-translate-y-0.5 hover:bg-[#C9A14A]/10",
};

export default function CTAButton({
  children,
  href,
  variant = "primary",
  className,
  disabled,
  ...buttonProps
}: CTAButtonProps) {
  const classes = `inline-flex min-h-12 items-center justify-center rounded-xl border px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] sm:px-8 sm:py-4 ${variantClasses[variant]} ${disabled ? "pointer-events-none opacity-50" : ""} ${className ?? ""}`;

  if (href) {
    return (
      <Link href={href} aria-disabled={disabled} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button disabled={disabled} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
