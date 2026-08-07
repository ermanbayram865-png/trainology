import { ArrowRight } from "lucide-react";

import Badge from "@/components/ui/Badge";
import CTAButton from "@/components/ui/CTAButton";
import Section from "@/components/ui/Section";

export default function FinalCTA() {
  return (
    <Section className="bg-[#080808]" contentClassName="text-center">
      <div className="rounded-[2rem] border border-[#C9A14A]/25 bg-[radial-gradient(circle_at_top,rgba(201,161,74,.16),transparent_60%)] px-6 py-16 sm:px-12">
        <div className="flex justify-center">
          <Badge variant="gold">Bilimle başla</Badge>
        </div>
        <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold text-white sm:text-5xl">
          Fitness kararlarını bilimle destekle.
        </h2>
        <div className="mt-8">
          <CTAButton href="/calculators/protein">
            Ücretsiz Analizini Başlat <ArrowRight aria-hidden="true" className="ml-2 size-4" />
          </CTAButton>
        </div>
      </div>
    </Section>
  );
}
