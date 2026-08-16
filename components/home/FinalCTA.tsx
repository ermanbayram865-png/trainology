import { ArrowRight } from "lucide-react";

import Badge from "@/components/ui/Badge";
import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";
import { ENERGY_LAB_PATH } from "@/lib/routes";

export default function FinalCTA() {
  return (
    <Section className="bg-[#080808]" contentClassName="text-center">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#C9A14A]/25 bg-[radial-gradient(circle_at_top,rgba(201,161,74,.18),transparent_60%)] px-6 py-14 shadow-[0_24px_70px_rgba(0,0,0,.3)] sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A14A]/60 to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <Badge variant="gold" className="mx-auto">
            Bilimle başla
          </Badge>

          <h2 className="mx-auto mt-7 max-w-2xl text-center text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
            Fitness kararlarını
            <br />
            bilimle şekillendir.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-center text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8">
            Bilimsel araçlarla daha bilinçli fitness kararları için Trainology&apos;i keşfet.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <CTAButton href={ENERGY_LAB_PATH} className="w-full sm:w-auto">
              Ücretsiz Analizini Başlat
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </CTAButton>

          </div>
        </div>
      </div>
    </Section>
  );
}
