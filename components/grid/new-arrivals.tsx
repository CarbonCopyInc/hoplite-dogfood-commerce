import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import { WishlistToggle } from "components/wishlist/wishlist-toggle";
import { getProducts } from "lib/shopify";
import Link from "next/link";

export async function NewArrivals() {
  const products = await getProducts({ sortKey: "CREATED_AT", reverse: true });
  const newArrivals = products.slice(0, 4);

  if (!newArrivals.length) return null;

  return (
    <section className="mx-auto max-w-(--breakpoint-2xl) px-4 pb-4 pt-8">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">
        New arrivals
      </h2>
      <Grid className="grid-cols-2 md:grid-cols-4">
        {newArrivals.map((product) => (
          <Grid.Item key={product.handle} className="animate-fadeIn">
            <div className="relative h-full w-full">
              <Link
                className="relative inline-block h-full w-full"
                href={`/product/${product.handle}`}
                prefetch={true}
              >
                <span className="absolute left-3 top-14 z-10 rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white dark:bg-white dark:text-black">
                  New
                </span>
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.priceRange.maxVariantPrice.amount,
                    currencyCode:
                      product.priceRange.maxVariantPrice.currencyCode,
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              </Link>
              <WishlistToggle
                product={product}
                className="absolute right-3 top-3 z-20"
              />
            </div>
          </Grid.Item>
        ))}
      </Grid>
    </section>
  );
}
