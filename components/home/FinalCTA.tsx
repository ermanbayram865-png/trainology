import { ArrowRight } from "lucide-react";

import Badge from "@/components/ui/Badge";
import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";

export default function FinalCTA() {
  return (
    <Section className="bg-[#080808]" contentClassName="text-center">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#C9A14A]/25 bg-[radial-gradient(circle_at_top,rgba(201,161,74,.18),transparent_60%)] px-6 py-16 shadow-[0_24px_70px_rgba(0,0,0,.3)] sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A14A]/60 to-transparent" />
        <div className="flex justify-center">
          <Badge variant="gold">Bilimle başla</Badge>
        </div>
        <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
          Fitness kararlarını bilimle destekle.
        </h2>
        <div className="mt-9">
          <CTAButton href="/analysis" className="w-full sm:w-auto">
            Ücretsiz Analizini Başlat <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </CTAButton>
        </div>
      </div>
    </Section>
  );
}
