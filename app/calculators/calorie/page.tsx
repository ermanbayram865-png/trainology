import EnergyLabExperience from "@/components/energy-lab/EnergyLabExperience";
import EnergyLabMethodology from "@/components/energy-lab/EnergyLabMethodology";

export default function EnergyLabPage() {
  return (
    <main className="bg-[#f4f1e9]">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#071523] px-5 py-8 text-white sm:px-6 sm:py-9 lg:py-4 [@media(min-width:1024px)_and_(max-height:850px)]:py-2.5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(208,175,105,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(208,175,105,.055)_1px,transparent_1px)] [background-size:56px_56px]"
        />
        <div className="relative mx-auto max-w-5xl">
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
