import type { Metadata } from "next";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/performance" },
  robots: { index: false, follow: true },
};

export default function PerformanceCalculatorPage() {
  return (
    <main className="min-h-screen">
      <Section
        subtitle="BİLİMSEL HESAPLAYICILAR"
        title="Performans Analizi"
        description="Fitness hedeflerin için kalori, makro ve performans verilerini analiz eden araçlar."
        contentClassName="max-w-2xl"
      >
        <Card
          title="Performans analiz aracı hazırlanıyor."
          description="Vücut ve antrenman verilerini daha bilinçli takip etmene yardımcı olacak analiz aracı yakında burada olacak."
          variant="subtle"
        />
      </Section>
    </main>
  );
}
