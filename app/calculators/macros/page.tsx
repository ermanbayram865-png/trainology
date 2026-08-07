import type { Metadata } from "next";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/macros" },
  robots: { index: false, follow: true },
};

export default function MacrosCalculatorPage() {
  return (
    <main className="min-h-screen">
      <Section
        subtitle="BİLİMSEL HESAPLAYICILAR"
        title="Makro Hesaplayıcı"
        description="Fitness hedeflerin için kalori, makro ve performans verilerini analiz eden araçlar."
        contentClassName="max-w-2xl"
      >
        <Card
          title="Makro hesaplama aracı hazırlanıyor."
          description="Hedeflerine uygun protein, karbonhidrat ve yağ dağılımını planlamana yardımcı olacak araç yakında burada olacak."
          variant="subtle"
        />
      </Section>
    </main>
  );
}
