"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useWishlist } from "./wishlist-context";

export function WishlistNavLink() {
  const { wishlistCount } = useWishlist();

  return (
    <Link
      aria-label="Open wishlist"
      className="relative mr-2 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors hover:border-blue-600 hover:text-blue-600 dark:border-neutral-700 dark:text-white"
      href="/wishlist"
    >
      <HeartIcon className="h-4 transition-transform hover:scale-110" />
      {wishlistCount ? (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-sm bg-blue-600 text-[11px] font-medium text-white">
          {wishlistCount}
        </span>
      ) : null}
    </Link>
  );
}
