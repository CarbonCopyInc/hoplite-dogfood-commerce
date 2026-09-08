"use client";

import { addItem } from "components/cart/actions";
import { useCart } from "components/cart/cart-context";
import type { Product } from "lib/shopify/types";
import { startTransition } from "react";
import { WishlistList } from "./wishlist-list";
import { useWishlist } from "./wishlist-context";

export function WishlistPage({ products }: { products: Product[] }) {
  const { addCartItem } = useCart();
  const { isLoaded, removeWishlistItem, wishlist } = useWishlist();
  const savedProducts = wishlist
    .map((handle) => products.find((product) => product.handle === handle))
    .filter((product): product is Product => Boolean(product));

  const addToCart = (product: Product) => {
    const variant = product.variants[0];
    if (!variant) return;

    addCartItem(variant, product);
    startTransition(() => {
      void addItem(null, variant.id);
    });
  };

  return (
    <WishlistList
      addToCart={addToCart}
      isLoaded={isLoaded}
      products={savedProducts}
      removeWishlistItem={removeWishlistItem}
    />
  );
}
