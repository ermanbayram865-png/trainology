import type { ReactNode } from "react";

type SectionProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function Section({
  title,
  subtitle,
  description,
  children,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section className={`px-6 py-24 ${className ?? ""}`}>
      <div className="mx-auto max-w-7xl">
        {(title || subtitle || description) && (
          <header className="mb-14 max-w-2xl">
            {subtitle && (
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C9A14A]">
                {subtitle}
              </p>
            )}

            {title && <h2 className="mt-4 text-4xl font-semibold text-white">{title}</h2>}

            {description && <p className="mt-4 text-neutral-400">{description}</p>}
          </header>
        )}

        <div className={contentClassName}>{children}</div>
      </div>
    </section>
  );
}
