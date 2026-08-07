import type { ReactNode } from "react";

import CalculatorDisclaimer from "@/components/calculators/CalculatorDisclaimer";
import CalculatorInfo from "@/components/calculators/CalculatorInfo";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

type CalculatorLayoutProps = {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  info?: ReactNode;
  references?: ReactNode;
  disclaimer?: ReactNode;
};

export default function CalculatorLayout({
  title,
  description,
  children,
  info,
  references,
  disclaimer,
}: CalculatorLayoutProps) {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-10">
        <PageHeader title={title} description={description} />

        {children}

        {info && <CalculatorInfo>{info}</CalculatorInfo>}

        {references && (
          <CalculatorInfo title="Kaynaklar">{references}</CalculatorInfo>
        )}

        <CalculatorDisclaimer>{disclaimer}</CalculatorDisclaimer>
      </Section>
    </main>
  );
}
