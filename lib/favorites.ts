export type FavoriteKind = "movements" | "supplements";

export const favoriteStorageKeys: Record<FavoriteKind, string> = {
  movements: "trainology.favorite-movements",
  supplements: "trainology.favorite-supplements",
};

const favoritesChangedEvent = "trainology:favorites-changed";

export function readFavoriteSlugs(kind: FavoriteKind): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(favoriteStorageKeys[kind]) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((value): value is string => typeof value === "string"))];
  } catch {
    return [];
  }
}

export function writeFavoriteSlugs(kind: FavoriteKind, slugs: readonly string[]) {
  const uniqueSlugs = [...new Set(slugs)];
  const storageKey = favoriteStorageKeys[kind];

  if (uniqueSlugs.length === 0) {
    window.localStorage.removeItem(storageKey);
  } else {
    window.localStorage.setItem(storageKey, JSON.stringify(uniqueSlugs));
  }

  window.dispatchEvent(new CustomEvent(favoritesChangedEvent, { detail: { kind } }));
}

export function clearFavoriteSlugs(kind: FavoriteKind) {
  writeFavoriteSlugs(kind, []);
}

export function subscribeToFavorites(kind: FavoriteKind, callback: () => void) {
  function handleCustomEvent(event: Event) {
    if ((event as CustomEvent<{ kind?: FavoriteKind }>).detail?.kind === kind) callback();
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === favoriteStorageKeys[kind]) callback();
  }

  window.addEventListener(favoritesChangedEvent, handleCustomEvent);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(favoritesChangedEvent, handleCustomEvent);
    window.removeEventListener("storage", handleStorage);
  };
}
