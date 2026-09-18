import { ArrowRight } from "lucide-react";
import Image from "next/image";

import Badge from "@/components/ui/Badge";
import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";
import { ENERGY_LAB_PATH } from "@/lib/routes";

export default function HeroSection() {
  return (
    <Section
      className="relative overflow-hidden !py-0 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_75%_25%,rgba(201,161,74,.08),transparent_34rem)]"
      contentClassName="relative grid min-h-[calc(100svh-5rem)] items-center gap-8 py-[var(--space-section-compact)] lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,.8fr)] lg:items-start lg:gap-10 lg:py-[var(--space-panel)]"
    >
      <div className="relative z-10 max-w-[52rem] lg:self-start lg:pt-[clamp(2rem,6vh,4rem)]">
        <div className="mb-4 flex items-center gap-3">
          <Badge variant="gold" className="!px-2.5 !py-0.5 !text-[0.625rem] !tracking-[0.13em] opacity-80">
            Bilimsel Fitness Platformu
          </Badge>
          <div className="hidden h-px w-20 bg-[var(--border-emphasis)] sm:block" />
        </div>

        <h1 className="text-[3.25rem] font-[var(--type-display-weight)] leading-[0.92] tracking-[-0.055em] text-[var(--site-text-primary)] sm:text-[4rem] lg:text-[clamp(4.5rem,5.6vw,6.25rem)] lg:leading-[0.9]">
          <span className="block xl:whitespace-nowrap">BİLİMLE <span className="text-[var(--brand-gold)]">GÜÇLEN.</span></span>
          <span className="mt-2 block lg:mt-1 xl:whitespace-nowrap">KANITLA <span className="text-[var(--brand-gold)]">İLERLE.</span></span>
        </h1>

        <p className="mt-4 max-w-lg text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
          Trainology; beslenme, performans ve hareket bilgisini anlaşılır,
          kanıta dayalı araçlarla bir araya getirir.
        </p>

        <div className="mt-5 flex flex-col items-stretch gap-2 sm:w-fit sm:flex-row sm:items-center">
          <CTAButton href={ENERGY_LAB_PATH} className="w-full sm:w-auto">
            Ücretsiz Analizini Başlat <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </CTAButton>
          <CTAButton href="/calculators" variant="ghost" className="w-full sm:w-auto">
            Bilimsel Araçları Keşfet
          </CTAButton>
        </div>
      </div>

      <div className="relative mx-auto flex aspect-[4/3] w-full max-w-xl items-center justify-center overflow-hidden border-y border-[var(--border-dark)] sm:aspect-[16/10] lg:aspect-[4/5] lg:max-h-[40rem] lg:max-w-[34rem] lg:self-center lg:border-y-0 lg:border-l">
        <Image
          src="/images/homepage/heromainfinal.png"
          alt="Trainology altın T monogram heykeli"
          fill
          priority
          quality={100}
          unoptimized
          sizes="(min-width: 1024px) 42vw, 100vw"
          className="object-contain object-center p-4 sm:p-8 lg:p-10"
        />
      </div>

    </Section>
  );
}
