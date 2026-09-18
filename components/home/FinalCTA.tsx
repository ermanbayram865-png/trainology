import { ArrowRight } from "lucide-react";

import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";
import { ENERGY_LAB_PATH } from "@/lib/routes";

export default function FinalCTA() {
  return (
    <Section className="border-t border-[var(--border-dark)] bg-[var(--site-surface)] !py-[var(--space-section-compact)]">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[var(--type-technical-label-tracking)] text-[var(--brand-gold)]">Bilimle başla</p>
          <h2 className="mt-5 max-w-2xl text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
            Fitness kararlarını
            <span className="block text-[var(--brand-gold)]">bilimle şekillendir.</span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8">
            Bilimsel araçlarla daha bilinçli fitness kararları için Trainology&apos;i keşfet.
          </p>
        </div>
        <CTAButton href={ENERGY_LAB_PATH} className="w-full lg:w-auto">
          Ücretsiz Analizini Başlat
          <ArrowRight aria-hidden="true" className="ml-2 size-4" />
        </CTAButton>
      </div>
    </Section>
  );
}
