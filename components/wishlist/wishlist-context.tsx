"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const WISHLIST_STORAGE_KEY = "storefront:wishlist";

type WishlistContextValue = {
  wishlist: string[];
  wishlistCount: number;
  isLoaded: boolean;
  isWishlisted: (handle: string) => boolean;
  addWishlistItem: (handle: string) => void;
  removeWishlistItem: (handle: string) => void;
  toggleWishlistItem: (handle: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export function parseWishlist(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return [
      ...new Set(
        parsed
          .filter((item): item is string => {
            return typeof item === "string" && item.trim().length > 0;
          })
          .map((item) => item.trim()),
      ),
    ];
  } catch {
    return [];
  }
}

export function readWishlist(storage: Pick<Storage, "getItem">): string[] {
  try {
    return parseWishlist(storage.getItem(WISHLIST_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function writeWishlist(
  storage: Pick<Storage, "setItem">,
  wishlist: string[],
): void {
  try {
    storage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  } catch {
    // Keep wishlist controls usable in memory when browser storage is blocked.
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setWishlist(readWishlist(window.localStorage));
    setIsLoaded(true);

    const syncWishlist = (event: StorageEvent) => {
      if (event.key === WISHLIST_STORAGE_KEY) {
        setWishlist(parseWishlist(event.newValue));
      }
    };

    window.addEventListener("storage", syncWishlist);
    return () => window.removeEventListener("storage", syncWishlist);
  }, []);

  const updateWishlist = useCallback(
    (update: (current: string[]) => string[]) => {
      setWishlist((current) => {
        const next = update(current);
        writeWishlist(window.localStorage, next);
        return next;
      });
    },
    [],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlist,
      wishlistCount: wishlist.length,
      isLoaded,
      isWishlisted: (handle) => wishlist.includes(handle),
      addWishlistItem: (handle) =>
        updateWishlist((current) =>
          current.includes(handle) ? current : [...current, handle],
        ),
      removeWishlistItem: (handle) =>
        updateWishlist((current) => current.filter((item) => item !== handle)),
      toggleWishlistItem: (handle) =>
        updateWishlist((current) =>
          current.includes(handle)
            ? current.filter((item) => item !== handle)
            : [...current, handle],
        ),
    }),
    [isLoaded, updateWishlist, wishlist],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  return context;
}
