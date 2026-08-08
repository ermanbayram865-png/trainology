import Link from "next/link";

type MovementBreadcrumbsProps = { category: string; title: string };

export default function MovementBreadcrumbs({ category, title }: MovementBreadcrumbsProps) {
  return <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-neutral-500"><Link href="/" className="hover:text-[#C9A14A]">Ana Sayfa</Link><span aria-hidden="true">/</span><Link href="/movements" className="hover:text-[#C9A14A]">Hareket Kütüphanesi</Link><span aria-hidden="true">/</span><span>{category}</span><span aria-hidden="true">/</span><span className="text-neutral-300">{title}</span></nav>;
}
