import type { ReactNode } from "react";
import Link from "next/link";

export type CardVariant = "default" | "gold" | "subtle";

type CardProps = {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: CardVariant;
  children?: ReactNode;
  className?: string;
};

const variantClasses: Record<CardVariant, string> = {
  default:
    "border-white/10 bg-[#0B0B0B] hover:-translate-y-1 hover:border-[#C9A14A]/60",
  gold: "border-[#C9A14A]/30 bg-[#0B0B0B] hover:-translate-y-1 hover:border-[#C9A14A]",
  subtle: "border-white/5 bg-[#0A0A0A] hover:border-white/15 hover:bg-[#101010]",
};

export default function Card({
  title,
  description,
  icon,
  href,
  onClick,
  variant = "default",
  children,
  className,
}: CardProps) {
  const content = (
    <>
      {icon && <div className="mb-6 text-3xl text-[#C9A14A]">{icon}</div>}

      {title && <h3 className="text-2xl font-semibold text-white">{title}</h3>}

      {description && (
        <p className="mt-3 text-sm leading-6 text-neutral-400">{description}</p>
      )}

      {children && <div className="mt-6">{children}</div>}
    </>
  );

  const classes = `block rounded-3xl border p-8 transition duration-300 ${variantClasses[variant]} ${className ?? ""}`;

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
