import type { ReactNode } from "react";

export type PageHeaderAlignment = "left" | "center";

type PageHeaderProps = {
  badge?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  alignment?: PageHeaderAlignment;
  className?: string;
};

const alignmentClasses: Record<PageHeaderAlignment, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
};

export default function PageHeader({
  badge,
  title,
  description,
  alignment = "left",
  className,
}: PageHeaderProps) {
  return (
    <header className={`flex max-w-3xl flex-col ${alignmentClasses[alignment]} ${className ?? ""}`}>
      {badge && <div>{badge}</div>}

      <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">{title}</h1>

      {description && (
        <p className="mt-6 max-w-2xl text-neutral-400">{description}</p>
      )}
    </header>
  );
}
