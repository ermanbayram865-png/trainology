"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

const storageKey = "trainology.favorite-movements";

function readFavorites() {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

type FavoriteButtonProps = { slug: string; className?: string };

export default function FavoriteButton({ slug, className }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsFavorite(readFavorites().includes(slug));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [slug]);

  function toggleFavorite() {
    const favorites = readFavorites();
    const nextFavorites = favorites.includes(slug) ? favorites.filter((item) => item !== slug) : [...favorites, slug];
    window.localStorage.setItem(storageKey, JSON.stringify(nextFavorites));
    setIsFavorite(nextFavorites.includes(slug));
  }

  return <button type="button" onClick={toggleFavorite} aria-label={isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"} aria-pressed={isFavorite} className={`inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-black/65 text-neutral-300 transition hover:border-[#C9A14A]/60 hover:text-[#D6B25E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A14A] ${className ?? ""}`}><Heart aria-hidden="true" className={`size-4 ${isFavorite ? "fill-[#C9A14A] text-[#C9A14A]" : ""}`} /></button>;
}
