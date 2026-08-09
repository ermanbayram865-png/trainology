"use client";

import {
  Activity,
  Calculator,
  Droplets,
  Dumbbell,
  Ruler,
  Target,
  Trophy,
  Utensils,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import CalculatorCard from "@/components/ui/CalculatorCard";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

const activeCalculators = [
  {
    title: "Kalori Hesaplayıcı",
    description: "Günlük enerji ihtiyacını hedeflerine göre hesapla.",
    category: "Bilimsel Hesaplayıcılar",
    status: "active" as const,
    href: "/calculators/calorie",
    icon: <Calculator aria-hidden="true" />,
  },
  {
    title: "Macro Hesaplayıcı",
    description: "Makro besin dağılımını hedeflerine göre planla.",
    category: "Beslenme",
    status: "active" as const,
    href: "/calculators/macro",
    icon: <Utensils aria-hidden="true" />,
  },
  {
    title: "Protein Hesaplayıcı",
    description: "Hedefine uygun günlük protein ihtiyacını öğren.",
    category: "Bilimsel Hesaplayıcılar",
    status: "active" as const,
    href: "/calculators/protein",
    icon: <Dumbbell aria-hidden="true" />,
  },
  {
    title: "Su İhtiyacı Hesaplayıcı",
    description: "Günlük tahmini su ihtiyacını aktivite seviyene göre incele.",
    category: "Beslenme",
    status: "active" as const,
    href: "/calculators/water",
    icon: <Droplets aria-hidden="true" />,
  },
  {
    title: "1RM Hesaplayıcı",
    description: "Tek tekrar maksimumunu güvenli şekilde tahmin et.",
    category: "Performans",
    status: "active" as const,
    href: "/calculators/1rm",
    icon: <Trophy aria-hidden="true" />,
  },
  {
    title: "Performans Analizi",
    description: "Tahmini 1RM değerlerini ve kuvvet dağılımını tek yerde incele.",
    category: "Performans",
    status: "active" as const,
    href: "/calculators/performance",
    icon: <Activity aria-hidden="true" />,
  },
  {
    title: "FFMI Hesaplayıcı",
    description: "Yağsız kütleni boyuna göre incele.",
    category: "Vücut Kompozisyonu",
    status: "active" as const,
    href: "/calculators/ffmi",
    icon: <Ruler aria-hidden="true" />,
  },
  {
    title: "Sağlıklı Ağırlık Aralığı Hesaplayıcı",
    description: "Boyuna göre tahmini sağlıklı ağırlık aralığını incele.",
    category: "Beslenme",
    status: "active" as const,
    href: "/calculators/healthy-weight",
    icon: <Target aria-hidden="true" />,
  },
];

export default function CalculatorsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505] !py-10 sm:!py-12 lg:!py-14" contentClassName="space-y-10 lg:space-y-12">
        <PageHeader
          badge={<Badge variant="gold">Bilimsel Araçlar</Badge>}
          title="Bilimsel Hesaplayıcılar"
          description="Kanıta dayalı hesaplayıcılarla beslenmeni, performansını ve vücut kompozisyonunu analiz et."
        />

        <section aria-label="Aktif hesaplayıcılar">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {activeCalculators.map((calculator) => (
              <CalculatorCard key={calculator.title} {...calculator} compact />
            ))}
          </div>
        </section>
      </Section>
    </main>
  );
}
