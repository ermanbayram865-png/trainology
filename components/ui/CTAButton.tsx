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
    "border-[var(--brand-gold)] bg-[var(--brand-gold)] text-black shadow-[var(--shadow-subtle)] hover:border-[var(--brand-gold-hover)] hover:bg-[var(--brand-gold-hover)]",
  secondary:
    "border-[var(--border-dark)] bg-white/[.02] text-[var(--site-text-primary)] hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)]",
  ghost:
    "border-transparent bg-transparent text-[var(--brand-gold)] hover:bg-[var(--brand-gold-muted)]",
};

export default function CTAButton({
  children,
  href,
  variant = "primary",
  className,
  disabled,
  ...buttonProps
}: CTAButtonProps) {
  const classes = `inline-flex min-h-12 items-center justify-center rounded-[var(--radius-control)] border px-6 py-3 text-sm font-semibold transition-[background-color,border-color,box-shadow,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--site-background)] sm:px-8 ${variantClasses[variant]} ${disabled ? "pointer-events-none cursor-not-allowed opacity-50" : ""} ${className ?? ""}`;

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
