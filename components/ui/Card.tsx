import type { ReactNode } from "react";
import Link from "next/link";

export type CardVariant = "default" | "gold" | "subtle";

type CardProps = {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  media?: ReactNode;
  mediaClassName?: string;
  childrenClassName?: string;
  href?: string;
  onClick?: () => void;
  variant?: CardVariant;
  children?: ReactNode;
  className?: string;
};

const variantClasses: Record<CardVariant, string> = {
  default:
    "border-white/10 bg-[#0B0B0B] shadow-[0_16px_40px_rgba(0,0,0,.18)] hover:-translate-y-1.5 hover:border-[#C9A14A]/60 hover:shadow-[0_22px_55px_rgba(0,0,0,.35)]",
  gold: "border-[#C9A14A]/30 bg-[#0B0B0B] shadow-[0_16px_40px_rgba(0,0,0,.18)] hover:-translate-y-1.5 hover:border-[#C9A14A] hover:shadow-[0_22px_55px_rgba(201,161,74,.12)]",
  subtle:
    "border-white/5 bg-[#0A0A0A] shadow-[0_16px_40px_rgba(0,0,0,.12)] hover:-translate-y-1 hover:border-white/15 hover:bg-[#101010] hover:shadow-[0_22px_50px_rgba(0,0,0,.28)]",
};

export default function Card({
  title,
  description,
  icon,
  media,
  mediaClassName,
  childrenClassName,
  href,
  onClick,
  variant = "default",
  children,
  className,
}: CardProps) {
  const content = (
    <>
      {media && <div className={`mb-7 ${mediaClassName ?? ""}`}>{media}</div>}

      {icon && <div className="mb-7 text-3xl text-[#C9A14A]">{icon}</div>}

      {title && (
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
          {title}
        </h3>
      )}

      {description && (
        <p className="mt-3 text-sm leading-6 text-neutral-400 sm:text-[0.9375rem]">
          {description}
        </p>
      )}

      {children && <div className={`mt-6 ${childrenClassName ?? ""}`}>{children}</div>}
    </>
  );

  const classes = `group block overflow-hidden rounded-3xl border p-7 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] sm:p-8 ${variantClasses[variant]} ${className ?? ""}`;

  if (href) {
    return <Link href={href} className={classes}>{content}</Link>;
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`w-full text-left ${classes}`}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}
