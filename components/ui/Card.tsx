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
    "border-[var(--border-dark)] bg-[var(--site-surface)] shadow-[var(--shadow-subtle)] hover:border-[var(--border-emphasis)] hover:shadow-[var(--shadow-elevated)]",
  gold: "border-[var(--border-emphasis)] bg-[var(--site-surface)] shadow-[var(--shadow-subtle)] hover:border-[var(--brand-gold)] hover:shadow-[var(--shadow-elevated)]",
  subtle:
    "border-[var(--border-dark)] bg-[var(--site-surface)] shadow-none hover:border-[var(--border-dark)] hover:bg-[var(--site-surface-elevated)] hover:shadow-[var(--shadow-subtle)]",
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

      {icon && <div className="mb-7 text-3xl text-[var(--brand-gold)]">{icon}</div>}

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

  const classes = `site-card group block overflow-hidden rounded-[var(--radius-card)] border p-7 transition-[background-color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--site-background)] sm:p-8 ${variantClasses[variant]} ${className ?? ""}`;

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
