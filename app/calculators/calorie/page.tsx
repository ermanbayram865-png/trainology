import EnergyLabExperience from "@/components/energy-lab/EnergyLabExperience";
import EnergyLabMethodology from "@/components/energy-lab/EnergyLabMethodology";

export default function EnergyLabPage() {
  return (
    <main className="calculator-shell">
      <section className="calculator-energy-intro relative border-b border-[var(--border-dark)] px-5 py-7 text-white sm:px-6 sm:py-8 lg:py-5">
        <div className="calculator-content relative">
          <p className="font-mono text-[var(--type-technical-label-size)] font-bold uppercase tracking-[var(--type-technical-label-tracking)] text-[var(--brand-gold)]">
            Enerji hesabı
          </p>
          <h1 className="mt-3 text-[var(--type-page-title-size)] font-[var(--type-page-title-weight)] leading-[var(--type-page-title-leading)] tracking-[-0.045em]">
            Kalori Hedefi Simülatörü
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Günlük enerji ihtiyacın ve hedefin için tahmini bir başlangıç noktası oluştur.
          </p>
        </div>
      </section>

      <EnergyLabExperience />
      <EnergyLabMethodology />
    </main>
  );
}
