"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { readFavoriteSlugs, subscribeToFavorites, writeFavoriteSlugs } from "@/lib/favorites";

export default function FavoriteSupplementButton({ slug, className }: { slug: string; className?: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => { const sync = () => setIsFavorite(readFavoriteSlugs("supplements").includes(slug)); const frame = window.requestAnimationFrame(sync); const unsubscribe = subscribeToFavorites("supplements", sync); return () => { window.cancelAnimationFrame(frame); unsubscribe(); }; }, [slug]);
  function toggle() { const favorites = readFavoriteSlugs("supplements"); const next = favorites.includes(slug) ? favorites.filter((item) => item !== slug) : [...favorites, slug]; writeFavoriteSlugs("supplements", next); }
  return <button type="button" aria-label={isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"} aria-pressed={isFavorite} onClick={toggle} className={`inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-black/65 text-neutral-300 transition hover:border-[#C9A14A]/60 hover:text-[#D6B25E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A] ${className ?? ""}`}><Heart aria-hidden="true" className={`size-4 ${isFavorite ? "fill-[#C9A14A] text-[#C9A14A]" : ""}`} /></button>;
}
