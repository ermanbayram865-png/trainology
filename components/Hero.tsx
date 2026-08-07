"use client";

export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center py-24 px-6">
      <h1 className="text-6xl font-bold tracking-tight">
        TRAINOLOGY
      </h1>

      <p className="mt-6 max-w-2xl text-xl text-zinc-400">
        Evidence Based Fitness Platform
      </p>

      <button className="mt-10 rounded-xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-105">
        Hemen Başla
      </button>
    </section>
  );
}