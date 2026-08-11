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
        category: "Enerji tahmini",
        badge: "ENERGY LAB 2.0",
        href: ENERGY_LAB_PATH,
        icon: <Calculator aria-hidden="true" />,
      },
      {
        title: "Makro Planlayıcı",
        description: "Makro besin dağılımını kalori hedefin ve tercihlerine göre planla.",
        category: "Makro planlama",
        badge: "ENERGY LAB İLE BAĞLANTILI",
        href: "/calculators/macro",
        icon: <Utensils aria-hidden="true" />,
      },
      {
        title: "Protein İhtiyacı",
        description: "Hedefine uygun günlük protein ihtiyacını genel bir referansla incele.",
        category: "Protein",
        badge: "HIZLI HESAPLAMA",
        href: "/calculators/protein",
        icon: <Dumbbell aria-hidden="true" />,
      },
      {
        title: "Su İhtiyacı",
        description: "Aktivite bilgilerine göre günlük tahmini su ihtiyacını incele.",
        category: "Hidrasyon",
        badge: "HIZLI HESAPLAMA",
        href: "/calculators/water",
        icon: <Droplets aria-hidden="true" />,
      },
    ],
  },
  {
    id: "performans",
    title: "PERFORMANS",
    calculators: [
      {
        title: "1RM Hesaplayıcı",
        description: "Tek tekrar maksimumunu güvenli bir başlangıç tahminiyle incele.",
        category: "Kuvvet",
        badge: "HIZLI HESAPLAMA",
        href: "/calculators/1rm",
        icon: <Trophy aria-hidden="true" />,
      },
      {
        title: "Performans Analizi",
        description: "Tahmini 1RM değerlerini ve kuvvet dağılımını tek yerde incele.",
        category: "Performans",
        badge: "GELİŞMİŞ ANALİZ",
        href: "/calculators/performance",
        icon: <Activity aria-hidden="true" />,
      },
    ],
  },
  {
    id: "vucut-olcumleri",
    title: "VÜCUT ÖLÇÜMLERİ",
    calculators: [
      {
        title: "FFMI Analizi",
        description: "Yağsız kütleni boyuna göre genel bir referansla incele.",
        category: "Vücut kompozisyonu",
        badge: "HIZLI HESAPLAMA",
        href: "/calculators/ffmi",
        icon: <Ruler aria-hidden="true" />,
      },
      {
        title: "BMI ve Ağırlık Aralığı",
        description: "Boyuna göre BMI temelli genel ağırlık referans aralığını incele.",
        category: "BMI referansı",
        badge: "HIZLI HESAPLAMA",
        href: "/calculators/healthy-weight",
        icon: <Target aria-hidden="true" />,
      },
    ],
  },
] as const;

export default function CalculatorsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505] !py-10 sm:!py-12 lg:!py-14" contentClassName="space-y-10 lg:space-y-12">
        <PageHeader
          badge={<Badge variant="gold">Bilimsel Araçlar</Badge>}
          title="Bilimsel Hesaplayıcılar"
          description="Kanıta dayalı hesaplayıcılarla beslenmeni, performansını ve vücut kompozisyonunu analiz et."
        />

        <div className="space-y-12">
          {calculatorGroups.map((group) => (
            <section key={group.id} aria-labelledby={group.id}>
              <div className="mb-5 flex items-center gap-4">
                <h2
                  id={group.id}
                  className="text-sm font-semibold tracking-[0.18em] text-[#D6B25E]"
                >
                  {group.title}
                </h2>
                <div aria-hidden="true" className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {group.calculators.map((calculator) => (
                  <CalculatorCard key={calculator.title} {...calculator} compact />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>
    </main>
  );
}
