import EnergyLabExperience from "@/components/energy-lab/EnergyLabExperience";
import EnergyLabMethodology from "@/components/energy-lab/EnergyLabMethodology";

export default function EnergyLabPage() {
  return (
    <main className="calculator-shell">
      <section className="relative overflow-hidden border-b border-white/10 px-5 py-8 text-white sm:px-6 sm:py-9 lg:py-4 [@media(min-width:1024px)_and_(max-height:850px)]:py-2.5">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full text-[#d0af69] opacity-[.045]"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="energy-hero-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#energy-hero-grid)" />
        </svg>
        <div className="calculator-content relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d0af69]">
            Enerji hesabı
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:mt-2 lg:text-[2.75rem] lg:leading-tight [@media(min-width:1024px)_and_(max-height:850px)]:mt-1">
            Kalori Hedefi Simülatörü
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg lg:mt-2 lg:text-base lg:leading-6 [@media(min-width:1024px)_and_(max-height:850px)]:mt-1 [@media(min-width:1024px)_and_(max-height:850px)]:leading-5">
            Günlük enerji ihtiyacın ve hedefin için tahmini bir başlangıç noktası oluştur.
          </p>
        </div>
      </section>

      <EnergyLabExperience />
      <EnergyLabMethodology />
    </main>
  );
}
