"use client";

import type { ReactNode } from "react";
import {
  Activity,
  Calculator,
  Droplets,
  Dumbbell,
  Gauge,
  Percent,
  Ruler,
  Scale,
  Target,
  Timer,
  Trophy,
  Utensils,
} from "lucide-react";
import { useState } from "react";

import Badge from "@/components/ui/Badge";
import CalculatorCard, {
  type CalculatorCardStatus,
} from "@/components/ui/CalculatorCard";
import Card from "@/components/ui/Card";
import CTAButton from "@/components/ui/CTAButton";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

type CalculatorItem = {
  title: string;
  description: string;
  category: string;
  status: CalculatorCardStatus;
  href?: string;
  icon: ReactNode;
};

type CalculatorCategory = {
  title: string;
  calculators: CalculatorItem[];
};

const categories: CalculatorCategory[] = [
  {
    title: "Bilimsel Hesaplayıcılar",
    calculators: [
      {
        title: "Kalori Hesaplayıcı",
        description: "Günlük enerji ihtiyacını hedeflerine göre hesapla.",
        category: "Bilimsel Hesaplayıcılar",
        status: "active",
        href: "/calculators/calorie",
        icon: <Calculator aria-hidden="true" />,
      },
      {
        title: "Protein Hesaplayıcı",
        description: "Hedefine uygun günlük protein ihtiyacını öğren.",
        category: "Bilimsel Hesaplayıcılar",
        status: "active",
        href: "/calculators/protein",
        icon: <Dumbbell aria-hidden="true" />,
      },
      {
        title: "BMI Hesaplayıcı",
        description: "Vücut kitle indeksini hızlıca değerlendir.",
        category: "Bilimsel Hesaplayıcılar",
        status: "comingSoon",
        icon: <Scale aria-hidden="true" />,
      },
      {
        title: "TDEE Hesaplayıcı",
        description: "Toplam günlük enerji harcamanı tahmin et.",
        category: "Bilimsel Hesaplayıcılar",
        status: "new",
        icon: <Gauge aria-hidden="true" />,
      },
      {
        title: "FFMI Hesaplayıcı",
        description: "Yağsız kütleni boyuna göre incele.",
        category: "Vücut Kompozisyonu",
        status: "active",
        href: "/calculators/ffmi",
        icon: <Ruler aria-hidden="true" />,
      },
      {
        title: "Body Fat Hesaplayıcı",
        description: "Tahmini vücut yağ oranını değerlendir.",
        category: "Bilimsel Hesaplayıcılar",
        status: "comingSoon",
        icon: <Percent aria-hidden="true" />,
      },
    ],
  },
  {
    title: "Performans",
    calculators: [
      {
        title: "1RM Hesaplayıcı",
        description: "Tek tekrar maksimumunu güvenli şekilde tahmin et.",
        category: "Performans",
        status: "active",
        href: "/calculators/1rm",
        icon: <Trophy aria-hidden="true" />,
      },
      {
        title: "Pace Hesaplayıcı",
        description: "Koşu ve kardiyo hedeflerin için tempo planla.",
        category: "Performans",
        status: "comingSoon",
        icon: <Timer aria-hidden="true" />,
      },
      {
        title: "VO₂ Max Hesaplayıcı",
        description: "Aerobik kapasiteni performans verilerinle analiz et.",
        category: "Performans",
        status: "comingSoon",
        icon: <Activity aria-hidden="true" />,
      },
    ],
  },
  {
    title: "Beslenme",
    calculators: [
      {
        title: "Macro Hesaplayıcı",
        description: "Makro besin dağılımını hedeflerine göre planla.",
        category: "Beslenme",
        status: "active",
        href: "/calculators/macro",
        icon: <Utensils aria-hidden="true" />,
      },
      {
        title: "Water Intake Hesaplayıcı",
        description: "Günlük su ihtiyacını yaşam tarzına göre belirle.",
        category: "Beslenme",
        status: "comingSoon",
        icon: <Droplets aria-hidden="true" />,
      },
      {
        title: "Ideal Weight Hesaplayıcı",
        description: "Boyuna göre sağlıklı ağırlık aralığını incele.",
        category: "Beslenme",
        status: "comingSoon",
        icon: <Target aria-hidden="true" />,
      },
    ],
  },
];

export default function CalculatorsPage() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505]" contentClassName="space-y-16">
        <PageHeader
          badge={<Badge variant="gold">Bilimsel Araçlar</Badge>}
          title="Bilimsel Hesaplayıcılar"
          description="Kanıta dayalı hesaplayıcılarla beslenmeni, performansını ve vücut kompozisyonunu analiz et."
        />

        {notice && (
          <p
            role="status"
            className="rounded-xl border border-[#C9A14A]/20 bg-[#C9A14A]/10 px-5 py-4 text-sm text-[#C9A14A]"
          >
            {notice}
          </p>
        )}

        {categories.map((category) => (
          <section key={category.title}>
            <div className="mb-8 flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-white">{category.title}</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {category.calculators.map((calculator) => (
                <CalculatorCard
                  key={calculator.title}
                  {...calculator}
                  onClick={
                    calculator.href
                      ? undefined
                      : () =>
                          setNotice(
                            `${calculator.title} yakında kullanıma sunulacak.`,
                          )
                  }
                />
              ))}
            </div>
          </section>
        ))}

        <Card
          title="Daha Fazla Bilimsel Araç Yakında"
          description="Trainology bilimsel araç kütüphanesi sürekli geliştirilmektedir."
          variant="gold"
          className="text-center"
        >
          <CTAButton
            variant="primary"
            onClick={() =>
              setNotice("Yeni özellik duyurularını yakında paylaşacağız.")
            }
          >
            Yeni Özellikleri Takip Et
          </CTAButton>
        </Card>
      </Section>
    </main>
  );
}
