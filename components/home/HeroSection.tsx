import { ArrowRight, Sparkles } from "lucide-react";

import HeroVisual from "@/components/hero/HeroVisual";
import Badge from "@/components/ui/Badge";
import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";

export default function HeroSection() {
  return (
    <Section
      className="relative overflow-hidden bg-[#050505] py-0"
      contentClassName="grid min-h-[calc(100vh-5rem)] items-center gap-14 py-24 sm:py-28 lg:grid-cols-2 lg:gap-20 lg:py-20"
    >
      <div className="relative z-10 max-w-3xl">
        <div className="mb-9 flex items-center gap-4">
          <Badge variant="gold">Bilimsel Fitness Platformu</Badge>
          <div className="hidden h-px w-20 bg-[#C9A14A]/40 sm:block" />
        </div>

        <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-6xl lg:text-8xl">
          BİLİMLE <span className="text-[#C9A14A]">GÜÇLEN.</span>
          <br />
          KANITLA <span className="text-[#C9A14A]">İLERLE.</span>
        </h1>

        <p className="mt-9 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg sm:leading-8">
          Trainology; beslenme, performans ve hareket bilgisini anlaşılır,
          kanıta dayalı araçlarla bir araya getirir.
        </p>

        <div className="mt-11 flex flex-col gap-4 sm:flex-row">
          <CTAButton href="/analysis" className="w-full sm:w-auto">
            Ücretsiz Analizini Başlat <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </CTAButton>
          <CTAButton href="/calculators" variant="secondary" className="w-full sm:w-auto">
            <Sparkles aria-hidden="true" className="mr-2 size-4" />
            Bilimsel Araçları Keşfet
          </CTAButton>
        </div>
      </div>

      <div className="relative hidden min-h-[34rem] lg:block">
        <HeroVisual />
      </div>
    </Section>
  );
}
