import Image from "next/image";

const tools = [
  {
    title: "Kalori Hesapla",
    description:
      "Günlük kalori ihtiyacını ve hedeflerine uygun enerji dengesini hesapla.",
    image: "/images/tools/calculator-v2.png",
    button: "Hesaplamaya Başla",
  },
  {
    title: "Protein İhtiyacını Öğren",
    description:
      "Hedeflerine ve aktivite seviyene göre günlük protein ihtiyacını belirle.",
    image: "/images/tools/protein-shaker.png",
    button: "Protein Hesapla",
  },
  {
    title: "Performansını Ölç",
    description:
      "Antrenman seviyeni ve performans göstergelerini bilimsel yaklaşımla analiz et.",
    image: "/images/tools/performance.png",
    button: "Analize Başla",
  },
];

export default function ScientificTools() {
  return (
    <section className="bg-black px-6 py-24">

      <div className="mx-auto max-w-7xl">

        {/* Section Header */}

        <div className="mb-14 max-w-2xl">

          <h2 className="text-4xl font-semibold text-white">
            Bilimsel Araçlar
          </h2>

          <p className="mt-4 text-neutral-400">
            Hedeflerine ulaşmak için ihtiyacın olan hesaplamaları
            bilimsel verilerle yap.
          </p>

        </div>


        {/* Cards */}

        <div className="grid gap-8 md:grid-cols-3">

          {tools.map((tool) => (

            <div
              key={tool.title}
              className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-neutral-950
              p-8
              transition
              duration-300
              hover:-translate-y-2
              hover:border-yellow-500/40
              "
            >

              {/* Image */}

              <div className="relative h-52">

                <Image
                  src={tool.image}
                  alt={tool.title}
                  fill
                  className="
                  object-contain
                  transition
                  duration-500
                  group-hover:scale-105
                  "
                />

              </div>


              {/* Content */}

              <h3 className="mt-8 text-2xl font-semibold text-white">
                {tool.title}
              </h3>


              <p className="mt-3 text-sm leading-6 text-neutral-400">
                {tool.description}
              </p>


              <button
                className="
                mt-8
                rounded-full
                border
                border-yellow-500/40
                px-5
                py-3
                text-sm
                text-yellow-400
                transition
                hover:bg-yellow-500
                hover:text-black
                "
              >
                {tool.button}
              </button>


            </div>

          ))}

        </div>

      </div>

    </section>
  );
}