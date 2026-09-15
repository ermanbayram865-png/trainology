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
    <main className="calculator-shell">
      <Section
        className={`!px-4 !py-7 sm:!px-6 sm:!py-9 lg:!py-10 ${sectionClassName ?? ""}`}
        contentClassName={`calculator-content ${contentClassName ?? "space-y-6 lg:space-y-7"}`}
      >
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
            }}
          />
        )}

        <PageHeader
          title={title}
          description={description}
          className="[&>h1]:!mt-0 [&>h1]:!font-semibold [&>h1]:!tracking-[-0.045em] [&>p]:!mt-3 [&>p]:!leading-7"
        />

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
