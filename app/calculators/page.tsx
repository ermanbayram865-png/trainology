"use client";

import {
  Calculator,
  Droplets,
  Dumbbell,
  Ruler,
  Target,
  Utensils,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import CalculatorCard from "@/components/ui/CalculatorCard";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import { ENERGY_LAB_PATH } from "@/lib/routes";

const calculatorGroups = [
  {
    id: "enerji-ve-beslenme",
    title: "ENERJİ VE BESLENME",
    calculators: [
      {
        title: "Kalori Hedefi Simülatörü / Energy Lab",
        description:
          "Bakım enerjin ve kontrollü kalori hedefin için bir başlangıç tahmini oluştur.",
        href: ENERGY_LAB_PATH,
        icon: <Calculator aria-hidden="true" />,
      },
      {
        title: "Makro Planlayıcı",
        description: "Makro besin dağılımını kalori hedefin ve tercihlerine göre planla.",
        href: "/calculators/macro",
        icon: <Utensils aria-hidden="true" />,
      },
      {
        title: "Günlük Protein Referansı",
        description: "Kilon, hedefin ve antrenman durumuna göre günlük protein referansını incele.",
        href: "/calculators/protein",
        icon: <Dumbbell aria-hidden="true" />,
      },
      {
        title: "Su & Hidrasyon",
        description: "Günlük toplam su referansını ve egzersiz hidrasyonunu ayrı modlarda değerlendir.",
        href: "/calculators/water",
        icon: <Droplets aria-hidden="true" />,
      },
    ],
  },
  {
    id: "vucut-olcumleri",
    title: "VÜCUT ÖLÇÜMLERİ",
    calculators: [
      {
        title: "Yağsız Kütle İndeksi (FFMI) Analizi",
        description: "Yağsız kütleni boyuna göre genel bir referansla incele.",
        href: "/calculators/ffmi",
        icon: <Ruler aria-hidden="true" />,
      },
      {
        title: "Vücut Kitle İndeksi (BMI) ve Ağırlık Aralığı",
        description: "Boyuna göre Vücut Kitle İndeksi (BMI) temelli genel ağırlık referans aralığını incele.",
        href: "/calculators/healthy-weight",
        icon: <Target aria-hidden="true" />,
      },
    ],
  },
] as const;

export default function CalculatorsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505] !py-4 sm:!py-5 lg:!py-5" contentClassName="space-y-4">
        <PageHeader
          badge={<Badge variant="gold">Bilimsel Araçlar</Badge>}
          title="Bilimsel Hesaplayıcılar"
          description="Kanıta dayalı hesaplayıcılarla beslenmeni, performansını ve vücut kompozisyonunu analiz et."
          className="[&>h1]:!mt-2 [&>h1]:!text-3xl sm:[&>h1]:!text-4xl [&>p]:!mt-2 [&>p]:!leading-6"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {calculatorGroups.map((group) =>
            group.calculators.map((calculator) => (
              <CalculatorCard key={calculator.title} {...calculator} compact />
            )),
          )}
        </div>
      </Section>
    </main>
  );
}
