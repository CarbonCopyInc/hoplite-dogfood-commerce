import Footer from "components/layout/footer";
import { getWishlist } from "components/wishlist/actions";
import { WishlistPage } from "components/wishlist/wishlist-page";
import { getProducts } from "lib/shopify";
import type { Product } from "lib/shopify/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved products.",
};

export default async function WishlistRoute() {
  const [wishlist, products] = await Promise.all([
    getWishlist(),
    getProducts({}),
  ]);
  const productsByHandle = new Map(
    products.map((product) => [product.handle, product]),
  );
  const savedProducts = wishlist
    .map((handle) => productsByHandle.get(handle))
    .filter((product): product is Product => Boolean(product));

  return (
    <>
      <section className="mx-auto min-h-[60vh] max-w-(--breakpoint-xl) px-4 py-10 md:py-16">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Wishlist
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Keep track of products you want to come back to.
        </p>
        <div className="mt-8">
          <WishlistPage products={savedProducts} />
        </div>
      </section>
      <Footer />
    </>
  );
}
