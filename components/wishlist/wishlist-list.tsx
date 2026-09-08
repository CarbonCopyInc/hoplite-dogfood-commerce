"use client";

import {
  HeartIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Price from "components/product/price";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

type WishlistItemProps = {
  product: Product;
  removeWishlistItem: (handle: string) => void;
  addToCart: (product: Product) => void;
};

export function WishlistItem({
  product,
  removeWishlistItem,
  addToCart,
}: WishlistItemProps) {
  return (
    <li className="relative flex flex-col gap-4 border-b border-neutral-200 py-6 sm:flex-row sm:items-center dark:border-neutral-800">
      <Link
        href={`/product/${product.handle}`}
        className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <Image
          alt={product.featuredImage.altText || product.title}
          className="h-full w-full object-contain"
          height={product.featuredImage.height}
          src={product.featuredImage.url}
          width={product.featuredImage.width}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2 pr-10 sm:pr-0">
        <Link
          href={`/product/${product.handle}`}
          className="w-fit text-lg font-medium hover:underline"
        >
          {product.title}
        </Link>
        <Price
          amount={product.priceRange.minVariantPrice.amount}
          className="text-sm text-neutral-600 dark:text-neutral-400"
          currencyCode={product.priceRange.minVariantPrice.currencyCode}
          currencyCodeClassName="text-xs"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <ShoppingBagIcon className="h-4 w-4" />
            Add to cart
          </button>
          <button
            type="button"
            onClick={() => removeWishlistItem(product.handle)}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:border-neutral-500 dark:border-neutral-700 dark:hover:border-neutral-500"
          >
            Remove
          </button>
        </div>
      </div>
      <button
        type="button"
        aria-label={`Remove ${product.title} from wishlist`}
        className="absolute right-0 top-6 flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black dark:hover:bg-neutral-900 dark:hover:text-white"
        onClick={() => removeWishlistItem(product.handle)}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </li>
  );
}

export function WishlistList({
  products,
  removeWishlistItem,
  addToCart,
  isLoaded,
}: {
  products: Product[];
  removeWishlistItem: (handle: string) => void;
  addToCart: (product: Product) => void;
  isLoaded: boolean;
}) {
  if (!isLoaded) {
    return (
      <div className="h-52 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 py-20 text-center dark:border-neutral-700">
        <HeartIcon className="h-12 w-12 text-neutral-400" />
        <h2 className="mt-4 text-xl font-semibold">Your wishlist is empty</h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Save products you love to find them here later.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <ul>
      {products.map((product) => (
        <WishlistItem
          key={product.handle}
          product={product}
          removeWishlistItem={removeWishlistItem}
          addToCart={addToCart}
        />
      ))}
    </ul>
  );
}
