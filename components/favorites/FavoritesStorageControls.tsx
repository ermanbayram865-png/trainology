"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  clearFavoriteSlugs,
  readFavoriteSlugs,
  subscribeToFavorites,
  type FavoriteKind,
} from "@/lib/favorites";

type FavoritesStorageControlsProps = {
  kind: FavoriteKind;
  itemLabel: string;
};

export default function FavoritesStorageControls({ kind, itemLabel }: FavoritesStorageControlsProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readFavoriteSlugs(kind).length);
    const frame = window.requestAnimationFrame(sync);
    const unsubscribe = subscribeToFavorites(kind, sync);

    return () => {
      window.cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, [kind]);

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0A0A0A] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-white">Favoriler yalnızca bu tarayıcıda saklanır.</p>
        <p className="mt-1 text-xs leading-5 text-neutral-500">
          {count > 0 ? `${count} ${itemLabel} favoride.` : `Henüz favori ${itemLabel} yok.`}
        </p>
      </div>
      <button
        type="button"
        disabled={count === 0}
        onClick={() => clearFavoriteSlugs(kind)}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-medium text-neutral-300 transition hover:border-[#C9A14A]/60 hover:text-[#D6B25E] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Trash2 aria-hidden="true" className="size-4" />
        Tüm favorileri temizle
      </button>
    </aside>
  );
}
