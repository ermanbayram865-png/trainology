import type { ReactNode } from "react";

type ArticleSectionProps = {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function ArticleSection({
  id,
  title,
  description,
  children,
  className,
}: ArticleSectionProps) {
  return (
    <section id={id} className={className}>
      <div className="mb-6 max-w-3xl">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
        {description && <p className="mt-3 text-sm leading-7 text-neutral-400">{description}</p>}
      </div>
      {children}
    </section>
  );
}
