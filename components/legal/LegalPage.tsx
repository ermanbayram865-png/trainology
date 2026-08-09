import type { ReactNode } from "react";

import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

type LegalPageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505] !py-14 sm:!py-18 lg:!py-22">
        <div className="mx-auto max-w-3xl">
          <PageHeader
            badge={
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A14A]">
                Yasal Bilgilendirme
              </span>
            }
            title={title}
            description={description}
          />
          <p className="mt-5 text-sm text-neutral-500">Son güncelleme: 9 Ağustos 2026</p>

          <article className="mt-10 space-y-9 rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 text-[0.95rem] leading-7 text-neutral-300 sm:p-9 sm:text-base sm:leading-8">
            {children}
          </article>
        </div>
      </Section>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold leading-tight text-white sm:text-2xl">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-6 marker:text-[#C9A14A]">{children}</ul>;
}

export const legalLinkClass =
  "text-[#D6B25E] underline decoration-[#C9A14A]/40 underline-offset-4 transition hover:text-[#E5C875]";
