"use client";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import type { Product } from "lib/shopify/types";
import { useEffect, useState } from "react";

const STORAGE_KEY = "recently-viewed-products";
const MAX_RECENT_PRODUCTS = 5;
const MAX_DISPLAYED_PRODUCTS = 4;

function getStoredHandles(): string[] {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    const parsed = value ? JSON.parse(value) : [];

    return Array.isArray(parsed)
      ? [
          ...new Set(
            parsed.filter(
              (handle): handle is string =>
                typeof handle === "string" && handle.length > 0,
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}

export function RecentlyViewedProducts({
  currentProductHandle,
  products,
}: {
  currentProductHandle: string;
  products: Product[];
}) {
  const [recentlyViewedHandles, setRecentlyViewedHandles] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const storedHandles = getStoredHandles();
    const previousHandles = storedHandles.filter(
      (handle) => handle !== currentProductHandle,
    );
    const nextHandles = [currentProductHandle, ...previousHandles].slice(
      0,
      MAX_RECENT_PRODUCTS,
    );

    setRecentlyViewedHandles(previousHandles.slice(0, MAX_DISPLAYED_PRODUCTS));

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHandles));
    } catch {
      // Keep rendering functional when storage is unavailable or full.
    }
  }, [currentProductHandle]);

  const productsByHandle = new Map(
    products.map((product) => [product.handle, product]),
  );
  const recentlyViewedProducts = recentlyViewedHandles
    .map((handle) => productsByHandle.get(handle))
    .filter((product): product is Product => Boolean(product));

  if (!recentlyViewedProducts.length) return null;

  return (
    <section className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Recently Viewed</h2>
      <Grid className="grid-cols-2 sm:grid-cols-4">
        <ProductGridItems products={recentlyViewedProducts} />
      </Grid>
    </section>
  );
}
