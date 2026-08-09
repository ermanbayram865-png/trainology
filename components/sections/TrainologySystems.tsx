import Link from "next/link";

const systems = [
  {
    title: "Hareket Kütüphanesi",
    description:
      "Yüzlerce egzersizi doğru teknik, çalışan kas grubu ve uygulama ipuçlarıyla keşfet.",
    href: "/movements",
    button: "Keşfet →",
  },
  {
    title: "Supplement Bilimi",
    description:
      "Supplementleri kanıt düzeyine göre değerlendir. Tarafsız ve güncel bilgiler.",
    href: "/supplements",
    button: "İncele →",
  },
  {
    title: "Neden Trainology?",
    description:
      "Kanıta dayalı içerikler, güvenilir kaynaklar ve reklamlardan bağımsız yaklaşım.",
    href: "/about",
    button: "Daha Fazla →",
  },
];

export default function TrainologySystems() {
  return (
    <section className="bg-[#050505] px-6 py-24">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-14 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#C8A45D]">
            Trainology Sistemleri
          </p>

          <h2 className="mt-4 text-5xl font-bold text-white">
            Bilimsel yaklaşım, güçlü sonuçlar.
          </h2>
        </div>

        {/* Cards */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {systems.map((item) => (
            <div
              key={item.title}
              className="
                group
                rounded-3xl
                border
                border-white/10
                bg-[#0B0B0B]
                p-8
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-[#C8A45D]/40
              "
            >

              {/* Placeholder Image */}

              <div className="mb-8 flex h-40 items-center justify-center rounded-2xl border border-white/5 bg-[#111111]">
                <span className="text-neutral-600 text-sm">
                  Görsel
                </span>
              </div>

              <h3 className="text-2xl font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-neutral-400">
                {item.description}
              </p>

              <Link
                href={item.href}
                className="
                  mt-8
                  inline-flex
                  text-[#C8A45D]
                  transition
                  group-hover:translate-x-1
                "
              >
                {item.button}
              </Link>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
