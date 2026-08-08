import Image from "next/image";

import FavoriteButton from "@/components/movements/FavoriteButton";
import MovementBreadcrumbs from "@/components/movements/MovementBreadcrumbs";
import MovementDifficulty from "@/components/movements/MovementDifficulty";
import MovementShareActions from "@/components/movements/MovementShareActions";
import Badge from "@/components/ui/Badge";
import { getMovementType } from "@/lib/movements/discovery";
import type { Movement } from "@/lib/movements/types";
import { absoluteUrl } from "@/lib/seo";

type MovementDetailHeroProps = {
  movement: Movement;
};

export default function MovementDetailHero({ movement }: MovementDetailHeroProps) {
  const movementType = getMovementType(movement);
  const hasImage = movement.image.trim().length > 0;

  return (
    <section
      aria-labelledby="movement-title"
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] p-6 shadow-[0_28px_80px_rgba(0,0,0,.32)] sm:p-8 lg:p-10"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[#C9A14A]/[0.06] blur-3xl" />
      <div className="relative">
        <MovementBreadcrumbs category={movement.muscleGroup} title={movement.name} />

        <div className={`mt-8 grid items-center gap-10 ${hasImage ? "lg:grid-cols-[minmax(0,1fr)_26.125rem] lg:gap-14" : ""}`}>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A14A]">Movement Library</p>
            <h1 id="movement-title" className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
              {movement.name}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300 sm:text-lg">{movement.description}</p>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <Badge variant="gold">{movement.muscleGroup}</Badge>
              <Badge variant="neutral">{movement.equipment}</Badge>
              <Badge variant={movementType === "Compound" ? "success" : "warning"}>{movementType}</Badge>
              <span className="inline-flex min-h-7 items-center rounded-full border border-white/10 bg-white/5 px-3">
                <MovementDifficulty difficulty={movement.difficulty} />
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <FavoriteButton slug={movement.slug} />
              <MovementShareActions url={absoluteUrl(`/movements/${movement.slug}`)} />
            </div>
          </div>

          {hasImage && (
            <div className="relative mx-auto aspect-square w-full max-w-[26.125rem] overflow-hidden rounded-[1.75rem] border border-[#C9A14A]/20 bg-[radial-gradient(circle_at_50%_45%,rgba(201,161,74,.11),transparent_56%),#070707] shadow-[inset_0_0_0_1px_rgba(255,255,255,.02),0_24px_60px_rgba(0,0,0,.35)]">
              <Image
                src={movement.image}
                alt={`${movement.name} hareket görseli`}
                fill
                preload
                sizes="(min-width: 1024px) 418px, (min-width: 640px) 60vw, 88vw"
                className="object-contain p-4 sm:p-5"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
