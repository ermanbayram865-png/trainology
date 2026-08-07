import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#050505]">

      <Container>

        <div className="grid min-h-[90vh] items-center gap-20 lg:grid-cols-2">

          {/* SOL TARAF */}

          <div>

            <div className="mb-8 flex items-center gap-5">

              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C9A14A]">
                Bilimsel Fitness Platformu
              </span>

              <div className="h-px w-24 bg-[#C9A14A]/40" />

            </div>


            <h1 className="font-black leading-[0.92] tracking-[-0.05em]">

              <span className="block text-7xl text-white lg:text-8xl">
                BİLİMLE
              </span>

              <span className="block text-7xl text-[#C9A14A] lg:text-8xl">
                GÜÇLEN.
              </span>

              <span className="block text-7xl text-white lg:text-8xl">
                KANITLA
              </span>

              <span className="block text-7xl text-[#C9A14A] lg:text-8xl">
                İLERLE.
              </span>

            </h1>


            <p className="mt-10 max-w-xl text-lg leading-9 text-zinc-400">

              Trainology, bilimsel araştırmaları herkesin
              anlayabileceği şekilde sunan yeni nesil
              fitness platformudur.

            </p>


            <div className="mt-12 flex gap-5">

              <Button>
                Hemen Başla
              </Button>


              <button
                className="
                rounded-xl
                border
                border-zinc-700
                px-8
                py-4
                text-white
                transition
                hover:border-[#C9A14A]
                hover:text-[#C9A14A]
                "
              >
                Nasıl Çalışır?
              </button>


            </div>


          </div>


          {/* SAĞ TARAF */}

          <div className="relative">

            <HeroVisual />

          </div>


        </div>


      </Container>


    </section>
  );
}