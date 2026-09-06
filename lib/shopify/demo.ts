import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type {
  Cart,
  CartItem,
  Collection,
  Menu,
  Page,
  Product,
  ProductVariant,
} from "./types";

// In-memory catalog used when no Shopify credentials are configured, so the
// storefront boots and renders without a real store. Swap in real credentials
// (SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN) to hit Shopify.

const USD = "USD";

const image = (seed: string) => ({
  url: `https://picsum.photos/seed/${seed}/900/900`,
  altText: "",
  width: 900,
  height: 900,
});

function makeProduct({
  handle,
  title,
  description,
  price,
  imageSeeds,
}: {
  handle: string;
  title: string;
  description: string;
  price: string;
  imageSeeds: string[];
}): Product {
  const id = `demo-${handle}`;
  const variant: ProductVariant = {
    id: `${id}-variant`,
    title: "Default Title",
    availableForSale: true,
    selectedOptions: [{ name: "Title", value: "Default Title" }],
    price: { amount: price, currencyCode: USD },
  };
  const images = imageSeeds.map((seed) => ({ ...image(seed), altText: title }));

  return {
    id,
    handle,
    availableForSale: true,
    title,
    description,
    descriptionHtml: `<p>${description}</p>`,
    options: [{ id: `${id}-option`, name: "Title", values: ["Default Title"] }],
    priceRange: {
      maxVariantPrice: { amount: price, currencyCode: USD },
      minVariantPrice: { amount: price, currencyCode: USD },
    },
    variants: [variant],
    featuredImage: images[0]!,
    images,
    seo: { title, description },
    tags: [],
    updatedAt: "2026-01-05T00:00:00.000Z",
  };
}

const products: Product[] = [
  makeProduct({
    handle: "aurora-desk-lamp",
    title: "Aurora Desk Lamp",
    description: "A warm, dimmable LED desk lamp with a brushed aluminum arm.",
    price: "89.00",
    imageSeeds: ["aurora-desk-lamp", "aurora-desk-lamp-detail"],
  }),
  makeProduct({
    handle: "cedar-notebook",
    title: "Cedar Notebook",
    description: "A refillable A5 notebook bound in soft recycled leather.",
    price: "24.00",
    imageSeeds: ["cedar-notebook", "cedar-notebook-open"],
  }),
  makeProduct({
    handle: "halo-wireless-speaker",
    title: "Halo Wireless Speaker",
    description:
      "A compact 360° speaker with rich bass and 12 hours of battery life.",
    price: "149.00",
    imageSeeds: ["halo-wireless-speaker", "halo-wireless-speaker-top"],
  }),
  makeProduct({
    handle: "nimbus-backpack",
    title: "Nimbus Backpack",
    description: "A weatherproof 22L daypack with a padded laptop sleeve.",
    price: "120.00",
    imageSeeds: ["nimbus-backpack", "nimbus-backpack-side"],
  }),
  makeProduct({
    handle: "pebble-mug",
    title: "Pebble Mug",
    description:
      "A matte stoneware mug that holds 350ml of your favorite brew.",
    price: "18.00",
    imageSeeds: ["pebble-mug"],
  }),
  makeProduct({
    handle: "solstice-sunglasses",
    title: "Solstice Sunglasses",
    description: "Polarized acetate sunglasses with UV400 protection.",
    price: "95.00",
    imageSeeds: ["solstice-sunglasses", "solstice-sunglasses-case"],
  }),
  makeProduct({
    handle: "tide-runner-sneakers",
    title: "Tide Runner Sneakers",
    description: "Lightweight knit sneakers for all-day comfort.",
    price: "130.00",
    imageSeeds: ["tide-runner-sneakers", "tide-runner-sneakers-pair"],
  }),
  makeProduct({
    handle: "vela-throw-blanket",
    title: "Vela Throw Blanket",
    description: "An oversized woven throw in 100% organic cotton.",
    price: "65.00",
    imageSeeds: ["vela-throw-blanket", "vela-throw-blanket-folded"],
  }),
  makeProduct({
    handle: "zephyr-desk-organizer",
    title: "Zephyr Desk Organizer",
    description: "A walnut and steel organizer for pens, phones, and keys.",
    price: "42.00",
    imageSeeds: ["zephyr-desk-organizer"],
  }),
];

const allCollection: Collection = {
  handle: "",
  title: "All",
  description: "All products",
  seo: { title: "All", description: "All products" },
  path: "/search",
  updatedAt: new Date().toISOString(),
};

const collections: Collection[] = [
  {
    handle: "lighting",
    title: "Lighting",
    description: "Lamps and ambient light for the modern home.",
    seo: { title: "Lighting", description: "Lamps and ambient light." },
    path: "/search/lighting",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "accessories",
    title: "Accessories",
    description: "Bags, drinkware, and everyday carry.",
    seo: { title: "Accessories", description: "Bags, drinkware, and more." },
    path: "/search/accessories",
    updatedAt: new Date().toISOString(),
  },
];

const collectionHandles: Record<string, string[]> = {
  "": products.map((product) => product.handle),
  lighting: ["aurora-desk-lamp", "halo-wireless-speaker"],
  accessories: [
    "nimbus-backpack",
    "pebble-mug",
    "solstice-sunglasses",
    "vela-throw-blanket",
  ],
  // Hidden collections drive the homepage; anything starting with `hidden-`
  // is filtered out of the search page collection list, matching Shopify setups.
  "hidden-homepage-featured-items": [
    "aurora-desk-lamp",
    "cedar-notebook",
    "halo-wireless-speaker",
  ],
  "hidden-homepage-carousel": [
    "nimbus-backpack",
    "pebble-mug",
    "solstice-sunglasses",
    "tide-runner-sneakers",
    "vela-throw-blanket",
    "zephyr-desk-organizer",
  ],
};

const pages: Page[] = [
  {
    id: "demo-page-about",
    title: "About",
    handle: "about",
    body: "<p>This is a demo storefront backed by a small in-memory catalog.</p><p>Set <code>SHOPIFY_STORE_DOMAIN</code> and <code>SHOPIFY_STOREFRONT_ACCESS_TOKEN</code> in your environment to serve real products from Shopify instead.</p>",
    bodySummary: "About this demo storefront.",
    seo: { title: "About", description: "About this demo storefront." },
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

const carts = new Map<string, Cart>();
let cartSeq = 0;

const emptyCart = (id: string): Cart => ({
  id,
  checkoutUrl: "#",
  totalQuantity: 0,
  lines: [],
  cost: {
    subtotalAmount: { amount: "0", currencyCode: USD },
    totalAmount: { amount: "0", currencyCode: USD },
    totalTaxAmount: { amount: "0", currencyCode: USD },
  },
});

function recomputeCart(cart: Cart) {
  const totalQuantity = cart.lines.reduce(
    (sum, line) => sum + line.quantity,
    0,
  );
  const totalAmount = cart.lines.reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0,
  );
  cart.totalQuantity = totalQuantity;
  cart.cost.subtotalAmount.amount = totalAmount.toFixed(2);
  cart.cost.totalAmount.amount = totalAmount.toFixed(2);
  cart.cost.totalTaxAmount.amount = "0.00";
}

function requireCart(): Cart {
  throw new Error("Cart not found");
}

function findVariant(
  merchandiseId: string,
): { product: Product; variant: ProductVariant } | undefined {
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === merchandiseId);
    if (variant) return { product, variant };
  }
  return undefined;
}

function sortProducts(
  list: Product[],
  reverse?: boolean,
  sortKey?: string,
): Product[] {
  const sorted = [...list].sort((a, b) => {
    switch (sortKey) {
      case "PRICE":
        return (
          Number(a.priceRange.minVariantPrice.amount) -
          Number(b.priceRange.minVariantPrice.amount)
        );
      case "CREATED_AT":
        return (
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      default:
        return 0;
    }
  });
  return reverse ? sorted.reverse() : sorted;
}

export async function createCart(): Promise<Cart> {
  const id = `demo-cart-${Date.now()}-${cartSeq++}`;
  const cart = emptyCart(id);
  carts.set(id, cart);
  return cart;
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value;
  const cart = (cartId && carts.get(cartId)) || requireCart();

  for (const line of lines) {
    const found = findVariant(line.merchandiseId);
    if (!found) continue;
    const { product, variant } = found;
    const existing = cart.lines.find((l) => l.merchandise.id === variant.id);

    if (existing) {
      existing.quantity += line.quantity;
      existing.cost.totalAmount.amount = (
        Number(existing.cost.totalAmount.amount) +
        Number(variant.price.amount) * line.quantity
      ).toFixed(2);
    } else {
      const item: CartItem = {
        id: `demo-line-${cartSeq++}`,
        quantity: line.quantity,
        cost: {
          totalAmount: {
            amount: (Number(variant.price.amount) * line.quantity).toFixed(2),
            currencyCode: variant.price.currencyCode,
          },
        },
        merchandise: {
          id: variant.id,
          title: variant.title,
          selectedOptions: variant.selectedOptions,
          product: {
            id: product.id,
            handle: product.handle,
            title: product.title,
            featuredImage: product.featuredImage,
          },
        },
      };
      cart.lines.push(item);
    }
  }

  recomputeCart(cart);
  return cart;
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value;
  const cart = (cartId && carts.get(cartId)) || requireCart();
  cart.lines = cart.lines.filter((line) => !lineIds.includes(line.id!));
  recomputeCart(cart);
  return cart;
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value;
  const cart = (cartId && carts.get(cartId)) || requireCart();

  for (const line of lines) {
    const item = cart.lines.find((l) => l.id === line.id);
    if (!item) continue;

    if (line.quantity <= 0) {
      cart.lines = cart.lines.filter((l) => l.id !== line.id);
      continue;
    }

    const variant = findVariant(line.merchandiseId)?.variant;
    item.quantity = line.quantity;
    item.cost.totalAmount.amount = (
      Number(variant?.price.amount ?? 0) * line.quantity
    ).toFixed(2);
  }

  recomputeCart(cart);
  return cart;
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get("cartId")?.value;
  return cartId ? carts.get(cartId) : undefined;
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  return handle === ""
    ? allCollection
    : collections.find((c) => c.handle === handle);
}

export async function getCollections(): Promise<Collection[]> {
  return [allCollection, ...collections];
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const handles = collectionHandles[collection] ?? [];
  const result = handles
    .map((handle) => products.find((p) => p.handle === handle))
    .filter((p): p is Product => Boolean(p));
  return sortProducts(result, reverse, sortKey);
}

export async function getMenu(_handle: string): Promise<Menu[]> {
  return [
    { title: "All", path: "/search" },
    ...collections.map((collection) => ({
      title: collection.title,
      path: collection.path,
    })),
  ];
}

export async function getPage(handle: string): Promise<Page> {
  // Mirrors the Shopify client's signature; unknown handles resolve to
  // undefined at runtime and callers treat that as notFound().
  return pages.find((page) => page.handle === handle)!;
}

export async function getPages(): Promise<Page[]> {
  return pages;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return products.find((product) => product.handle === handle);
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  return products.filter((product) => product.id !== productId).slice(0, 4);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  let result = products;

  if (query) {
    const needle = query.toLowerCase();
    result = result.filter(
      (product) =>
        product.title.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle),
    );
  }

  return sortProducts(result, reverse, sortKey);
}

export async function revalidate(_req: NextRequest): Promise<NextResponse> {
  // Nothing to invalidate: the demo catalog lives in memory.
  return NextResponse.json({ status: 200 });
}
