import { AddToCart } from "components/cart/add-to-cart";
import { WishlistToggle } from "components/wishlist/wishlist-toggle";
import Price from "components/product/price";
import { Stock } from "components/product/stock";
import Prose from "components/prose";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
        <Stock handle={product.handle} />
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <AddToCart product={product} />
        </div>
        <WishlistToggle product={product} className="h-14 w-full sm:w-14" />
      </div>
    </>
  );
}
