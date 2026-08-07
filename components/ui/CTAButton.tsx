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
    "border-[#C9A14A] bg-[#C9A14A] text-black hover:-translate-y-1 hover:bg-[#D4AF37] hover:shadow-[0_0_30px_rgba(201,161,74,.35)]",
  secondary:
    "border-zinc-700 bg-transparent text-white hover:border-[#C9A14A] hover:text-[#C9A14A]",
  ghost: "border-transparent bg-transparent text-[#C9A14A] hover:bg-[#C9A14A]/10",
};

export default function CTAButton({
  children,
  href,
  variant = "primary",
  className,
  disabled,
  ...buttonProps
}: CTAButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-xl border px-8 py-4 text-sm font-semibold tracking-wide transition-all duration-300 ${variantClasses[variant]} ${disabled ? "pointer-events-none opacity-50" : ""} ${className ?? ""}`;

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
