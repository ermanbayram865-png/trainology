import type { ReactNode } from "react";

import CalculatorDisclaimer from "@/components/calculators/CalculatorDisclaimer";
import CalculatorInfo from "@/components/calculators/CalculatorInfo";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import { absoluteUrl, siteConfig } from "@/lib/seo";

type CalculatorLayoutProps = {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  info?: ReactNode;
  references?: ReactNode;
  disclaimer?: ReactNode;
  seoPath?: string;
  sectionClassName?: string;
  contentClassName?: string;
};

export default function CalculatorLayout({
  title,
  description,
  children,
  info,
  references,
  disclaimer,
  seoPath,
  sectionClassName,
  contentClassName,
}: CalculatorLayoutProps) {
  const structuredData =
    seoPath && typeof title === "string"
      ? {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: title,
          description: typeof description === "string" ? description : undefined,
          applicationCategory: "HealthApplication",
          operatingSystem: "Any",
          isAccessibleForFree: true,
          url: absoluteUrl(seoPath),
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
          },
        }
      : null;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section
        className={`bg-[#050505] ${sectionClassName ?? ""}`}
        contentClassName={contentClassName ?? "space-y-10"}
      >
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
            }}
          />
        )}

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
