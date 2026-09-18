"use client";

import {
  ArrowRight,
  Calculator,
  Dumbbell,
  Ruler,
  Utensils,
} from "lucide-react";
import Link from "next/link";

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
          "Günlük enerji ihtiyacın ve kalori hedefin için bir başlangıç tahmini oluştur.",
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
    ],
  },
] as const;

const toolGuideItems = [
  {
    need: "Günlük kalori hedefim için bir başlangıç tahmini istiyorum.",
    tool: "Kalori Hedefi Simülatörü",
    destination: ENERGY_LAB_PATH,
  },
  {
    need: "Kalori hedefim hazır; protein, karbonhidrat ve yağ dağılımını planlamak istiyorum.",
    tool: "Makro Planlayıcı",
    destination: "/calculators/macro",
  },
  {
    need: "Günlük protein için pratik bir referans istiyorum.",
    tool: "Günlük Protein Referansı",
    destination: "/calculators/protein",
  },
  {
    need: "Yağsız kütlemi boyuma göre genel bir bağlamda incelemek istiyorum.",
    tool: "FFMI Analizi",
    destination: "/calculators/ffmi",
  },
] as const;

export default function CalculatorsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Section className="bg-[#050505] !py-4 sm:!py-5 lg:!py-5" contentClassName="space-y-4">
        <PageHeader
          badge={<Badge variant="gold">Bilimsel Araçlar</Badge>}
          title="Bilimsel Hesaplayıcılar"
          description="Kanıta dayalı hesaplayıcılarla enerji, beslenme ve vücut ölçümlerini incele."
          className="[&>h1]:!mt-2 [&>h1]:!text-3xl sm:[&>h1]:!text-4xl [&>p]:!mt-2 [&>p]:!leading-6"
        />

        <section
          aria-labelledby="tool-guide-title"
          className="rounded-[var(--radius-panel)] border border-[var(--border-dark)] bg-[var(--site-surface)] px-4 py-4 sm:px-5"
        >
          <div className="sm:flex sm:items-baseline sm:justify-between sm:gap-6">
            <h2 id="tool-guide-title" className="text-lg font-semibold tracking-[-0.02em] text-white">
              Ne hesaplamak istiyorsun?
            </h2>
            <p className="mt-1 text-sm leading-5 text-neutral-400 sm:mt-0 sm:text-right">
              İhtiyacına en yakın seçeneği seç; araçları belirli bir sırayla kullanman gerekmez.
            </p>
          </div>

          <div className="mt-3 divide-y divide-[var(--border-dark)] border-y border-[var(--border-dark)]">
            {toolGuideItems.map((item) => (
              <Link
                key={item.need}
                href={item.destination}
                className="group flex min-h-12 flex-col justify-center gap-1 py-3 outline-none transition-colors hover:text-[var(--brand-gold)] focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] sm:flex-row sm:items-center sm:justify-between sm:gap-5"
              >
                <span className="text-sm leading-5 text-neutral-300 transition-colors group-hover:text-white">
                  {item.need}
                </span>
                <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--brand-gold)]">
                  {item.tool}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
