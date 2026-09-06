"use client";

import {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "components/wishlist/actions";
import {
  createContext,
  startTransition,
  use,
  useContext,
  useMemo,
  useOptimistic,
} from "react";

type WishlistAction =
  | { type: "ADD"; handle: string }
  | { type: "REMOVE"; handle: string }
  | { type: "TOGGLE"; handle: string };

type WishlistContextValue = {
  wishlistPromise: Promise<string[]>;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

function wishlistReducer(wishlist: string[], action: WishlistAction): string[] {
  switch (action.type) {
    case "ADD":
      return wishlist.includes(action.handle)
        ? wishlist
        : [...wishlist, action.handle];
    case "REMOVE":
      return wishlist.filter((handle) => handle !== action.handle);
    case "TOGGLE":
      return wishlist.includes(action.handle)
        ? wishlist.filter((handle) => handle !== action.handle)
        : [...wishlist, action.handle];
  }
}

export function WishlistProvider({
  children,
  wishlistPromise,
}: {
  children: React.ReactNode;
  wishlistPromise: Promise<string[]>;
}) {
  return (
    <WishlistContext.Provider value={{ wishlistPromise }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  const initialWishlist = use(context.wishlistPromise);
  const [wishlist, updateOptimisticWishlist] = useOptimistic(
    initialWishlist,
    wishlistReducer,
  );

  const runOptimisticAction = (
    action: WishlistAction,
    mutation: () => Promise<string[]>,
  ) => {
    startTransition(async () => {
      updateOptimisticWishlist(action);
      await mutation();
    });
  };

  return useMemo(
    () => ({
      wishlist,
      wishlistCount: wishlist.length,
      isWishlisted: (handle: string) => wishlist.includes(handle),
      addWishlistItem: (handle: string) =>
        runOptimisticAction({ type: "ADD", handle }, () =>
          addToWishlist(handle),
        ),
      removeWishlistItem: (handle: string) =>
        runOptimisticAction({ type: "REMOVE", handle }, () =>
          removeFromWishlist(handle),
        ),
      toggleWishlistItem: (handle: string) =>
        runOptimisticAction({ type: "TOGGLE", handle }, () =>
          toggleWishlist(handle),
        ),
    }),
    [wishlist],
  );
}
