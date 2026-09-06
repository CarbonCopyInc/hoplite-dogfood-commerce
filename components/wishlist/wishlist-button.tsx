"use client";

import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import type { Product } from "lib/shopify/types";

type WishlistButtonProps = {
  product: Product;
  isWishlisted: boolean;
  toggleWishlist: (product: Product) => void;
  className?: string;
};

export function WishlistButton({
  product,
  isWishlisted,
  toggleWishlist,
  className,
}: WishlistButtonProps) {
  const label = isWishlisted
    ? `Remove ${product.title} from wishlist`
    : `Add ${product.title} to wishlist`;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isWishlisted}
      className={clsx(
        "flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-700 shadow-sm transition-colors hover:border-blue-600 hover:text-blue-600 dark:border-neutral-700 dark:bg-black/90 dark:text-neutral-200",
        className,
      )}
      onClick={() => toggleWishlist(product)}
    >
      {isWishlisted ? (
        <HeartSolidIcon className="h-5 w-5 text-blue-600" />
      ) : (
        <HeartOutlineIcon className="h-5 w-5" />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
