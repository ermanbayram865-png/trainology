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
    <section className={`px-6 py-20 sm:py-24 lg:py-28 ${className ?? ""}`}>
      <div className="mx-auto max-w-7xl">
        {(title || subtitle || description) && (
          <header className="mb-12 max-w-3xl sm:mb-16">
            {subtitle && (
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C9A14A]">
                {subtitle}
              </p>
            )}

            {title && (
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-400 sm:text-lg">
                {description}
              </p>
            )}
          </header>
        )}

        <div className={contentClassName}>{children}</div>
      </div>
    </section>
  );
}
