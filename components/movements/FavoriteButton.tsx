"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { readFavoriteSlugs, subscribeToFavorites, writeFavoriteSlugs } from "@/lib/favorites";

type FavoriteButtonProps = { slug: string; className?: string };

export default function FavoriteButton({ slug, className }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const sync = () => setIsFavorite(readFavoriteSlugs("movements").includes(slug));
    const frame = window.requestAnimationFrame(sync);
    const unsubscribe = subscribeToFavorites("movements", sync);
    return () => { window.cancelAnimationFrame(frame); unsubscribe(); };
  }, [slug]);

  function toggleFavorite() {
    const favorites = readFavoriteSlugs("movements");
    const nextFavorites = favorites.includes(slug) ? favorites.filter((item) => item !== slug) : [...favorites, slug];
    writeFavoriteSlugs("movements", nextFavorites);
  }

  return <button type="button" onClick={toggleFavorite} aria-label={isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"} aria-pressed={isFavorite} className={`inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-black/65 text-neutral-300 transition hover:border-[#C9A14A]/60 hover:text-[#D6B25E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A] ${className ?? ""}`}><Heart aria-hidden="true" className={`size-4 ${isFavorite ? "fill-[#C9A14A] text-[#C9A14A]" : ""}`} /></button>;
}
