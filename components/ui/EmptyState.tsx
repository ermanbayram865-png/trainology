import type { ReactNode } from "react";

type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  button?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  button,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-[#0B0B0B] px-6 py-16 text-center sm:px-10 ${className ?? ""}`}>
      {icon && <div className="mx-auto mb-6 text-4xl text-[#C9A14A]">{icon}</div>}

      <h2 className="text-2xl font-semibold text-white">{title}</h2>

      {description && (
        <p className="mx-auto mt-3 max-w-md text-neutral-400">{description}</p>
      )}

      {button && <div className="mt-8">{button}</div>}
    </section>
  );
}
