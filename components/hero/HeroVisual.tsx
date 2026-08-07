import Image from "next/image";

export default function HeroVisual() {
  return (
    <div className="relative h-[760px] w-full overflow-visible">

      <Image
        src="/images/hero/trainology-hero-object.png"
        alt="Trainology Hero Scene"
        width={1400}
        height={1400}
        priority
        className="
          absolute
          left-1/2
          top-1/2
          w-[1150px]
          max-w-none
          -translate-x-[34%]
          -translate-y-[52%]
          object-contain
          drop-shadow-[0_0_120px_rgba(212,175,55,0.25)]
        "
      />

    </div>
  );
}