import { ArrowDown, FlaskConical, Gauge, LineChart, SlidersHorizontal } from "lucide-react";
import Image from "next/image";

import EnergyLabExperience from "@/components/energy-lab/EnergyLabExperience";
import EnergyLabMethodology from "@/components/energy-lab/EnergyLabMethodology";

const processSteps = [
  { icon: Gauge, label: "Başlangıç tahmini" },
  { icon: SlidersHorizontal, label: "Aktivite belirsizliği" },
  { icon: FlaskConical, label: "Kontrollü hedef" },
  { icon: LineChart, label: "Trend kalibrasyonu" },
] as const;

export default function EnergyLabPage() {
  return (
    <main className="overflow-x-hidden bg-[#f4f1e9]">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#071523] px-6 py-16 text-white sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(208,175,105,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(208,175,105,.055)_1px,transparent_1px)] [background-size:56px_56px]"
        />
        <div aria-hidden="true" className="absolute -right-48 -top-48 size-[32rem] rounded-full border border-[#d0af69]/10" />
        <div aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full border border-[#d0af69]/10" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,.9fr)] lg:items-center">
          <div>
            <div className="flex items-center gap-4">
              <span className="inline-flex rounded-full border border-[#d0af69]/30 bg-[#d0af69]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#ead5a8]">
                Trainology Energy Lab 2.0
              </span>
              <span aria-hidden="true" className="hidden h-px w-20 bg-[#d0af69]/35 sm:block" />
            </div>

            <h1 className="mt-7 max-w-5xl text-[clamp(3rem,6.4vw,6.4rem)] font-semibold leading-[.93] tracking-[-0.06em]">
              Kalori Hedefi
              <span className="block text-[#d0af69]">Simülatörü</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl sm:leading-9">
              Enerji ihtiyacını tahmin et, hedefini seç ve gerçek ağırlık trendinle değerlendir.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              NASEM 2023 yetişkin enerji denklemleriyle oluşturulan sakin bir başlangıç tahmini.
              Kesin reçete, metabolizma ölçümü veya garantili kilo değişimi değildir.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#simulator"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d0af69] bg-[#d0af69] px-6 py-3 text-sm font-bold text-[#071523] transition hover:-translate-y-0.5 hover:bg-[#dfc17e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transform-none"
              >
                Simülasyonu başlat
                <ArrowDown aria-hidden="true" className="size-4" />
              </a>
              <a
                href="#nasil-hesaplandi"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-[#d0af69]/50 hover:text-[#ead5a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0af69]"
              >
                Nasıl hesaplandığını gör
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#d0af69]/25 bg-white/[.035] p-6 shadow-[0_30px_90px_rgba(0,0,0,.24)] sm:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d0af69]">
                    Energy protocol
                  </p>
                  <p className="mt-2 text-sm text-slate-400">Estimate → observe → calibrate</p>
                </div>
                <Image
                  src="/images/logo.png"
                  alt="Trainology Gold Monogram"
                  width={64}
                  height={64}
                  priority
                  className="size-14 object-contain sm:size-16"
                />
              </div>

              <ol className="mt-6 space-y-3">
                {processSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <li
                      key={step.label}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#d0af69]/25 bg-[#d0af69]/10 text-[#d0af69]">
                        <Icon aria-hidden="true" className="size-4" />
                      </span>
                      <span className="flex-1 text-sm font-semibold text-slate-200">{step.label}</span>
                      <span className="font-mono text-xs text-slate-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <EnergyLabExperience />
      <EnergyLabMethodology />
    </main>
  );
}
