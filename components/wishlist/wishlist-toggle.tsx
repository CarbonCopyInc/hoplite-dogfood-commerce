"use client";

import type { Product } from "lib/shopify/types";
import { WishlistButton } from "./wishlist-button";
import { useWishlist } from "./wishlist-context";

export function WishlistToggle({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { isWishlisted, toggleWishlistItem } = useWishlist();

  return (
    <WishlistButton
      className={className}
      isWishlisted={isWishlisted(product.handle)}
      product={product}
      toggleWishlist={() => toggleWishlistItem(product.handle)}
    />
  );
}
