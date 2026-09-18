import Link from "next/link";

import Section from "@/components/ui/Section";

const values = [
  {
    title: "Bilimsel Hesaplayıcılar",
    description: "Enerji, makro, protein ve vücut ölçümlerini anlaşılır araçlarla incele.",
    href: "/calculators",
  },
];

export default function ValueProposition() {
  return (
    <Section
      className="border-y border-[var(--border-dark)] !py-[var(--space-section-compact)]"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] lg:items-end">
        <p className="font-mono text-[var(--type-technical-label-size)] font-semibold uppercase tracking-[var(--type-technical-label-tracking)] text-[var(--brand-gold)]">
          TRAINOLOGY PLATFORMU
        </p>
        {values.map((value) => (
          <div key={value.title} className="border-l border-[var(--border-emphasis)] pl-5 sm:pl-8">
            <h2 className="text-[var(--type-section-title-size)] font-[var(--type-section-title-weight)] leading-[var(--type-section-title-leading)] tracking-[-0.03em] text-white">
              Fitness hedeflerin için bilimsel araçlar ve güvenilir bilgiler.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--site-text-secondary)]">
              Karar vermeyi kolaylaştıran, birbirini tamamlayan araçlar.
            </p>
            <Link href={value.href} className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--brand-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
              {value.title}
            </Link>
            <p className="max-w-xl text-sm leading-6 text-[var(--site-text-secondary)]">{value.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
