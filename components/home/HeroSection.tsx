import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

import Badge from "@/components/ui/Badge";
import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";

export default function HeroSection() {
  return (
    <Section
      className="relative py-0"
      contentClassName="relative grid gap-7 py-7 sm:gap-9 sm:py-9 lg:h-[calc(100svh-6rem)] lg:-translate-y-24 lg:grid-cols-[minmax(0,.45fr)_minmax(0,.55fr)] lg:items-center lg:gap-0 lg:pt-0 lg:pb-6"
    >
      <div className="relative z-10 max-w-3xl">
        <div className="mb-5 flex items-center gap-4">
          <Badge variant="gold">Bilimsel Fitness Platformu</Badge>
          <div className="hidden h-px w-20 bg-[#C9A14A]/40 sm:block" />
        </div>

        <h1 className="max-w-3xl text-[clamp(3rem,5.2vw,6.5rem)] font-black leading-[0.88] tracking-[-0.06em] text-white">
          <span className="block">BİLİMLE</span>
          <span className="block text-[#C9A14A]">GÜÇLEN.</span>
          <span className="block">KANITLA</span>
          <span className="block text-[#C9A14A]">İLERLE.</span>
        </h1>

        <p className="mt-4 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
          Trainology; beslenme, performans ve hareket bilgisini anlaşılır,
          kanıta dayalı araçlarla bir araya getirir.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <CTAButton href="/analysis" className="w-full sm:w-auto">
            Ücretsiz Analizini Başlat <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </CTAButton>
          <CTAButton href="/calculators" variant="secondary" className="w-full sm:w-auto">
            <Sparkles aria-hidden="true" className="mr-2 size-4" />
            Bilimsel Araçları Keşfet
          </CTAButton>
        </div>
      </div>

      <div className="relative mt-2 flex aspect-[16/9] w-full items-center justify-center lg:col-start-2 lg:row-start-1 lg:mt-0 lg:h-full lg:self-stretch lg:aspect-auto">
        <Image
          src="/images/homepage/heromainfinal.png"
          alt="Trainology altın T monogram heykeli"
          fill
          priority
          quality={100}
          unoptimized
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-contain object-center"
        />
      </div>

    </Section>
  );
}
