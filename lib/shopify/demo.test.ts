import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieStore = vi.hoisted(() => {
  const values = new Map<string, string>();

  return {
    get: vi.fn((name: string) => {
      const value = values.get(name);
      return value ? { name, value } : undefined;
    }),
    set: vi.fn((name: string, value: string) => values.set(name, value)),
    reset: () => values.clear(),
  };
});

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore),
}));

vi.mock("next/server", () => ({
  NextRequest: class NextRequest {},
  NextResponse: { json: vi.fn() },
}));

let demo: typeof import("./demo");

beforeEach(async () => {
  cookieStore.reset();
  vi.clearAllMocks();
  vi.resetModules();
  demo = await import("./demo");
});

describe("demo catalog", () => {
  it("looks up products by handle", async () => {
    const product = await demo.getProduct("aurora-desk-lamp");

    expect(product).toMatchObject({
      handle: "aurora-desk-lamp",
      title: "Aurora Desk Lamp",
      priceRange: {
        minVariantPrice: { amount: "89.00", currencyCode: "USD" },
      },
    });
    expect(await demo.getProduct("does-not-exist")).toBeUndefined();
  });

  it("exposes only visible collections and filters their products", async () => {
    await expect(demo.getCollections()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ handle: "", title: "All" }),
        expect.objectContaining({ handle: "lighting", title: "Lighting" }),
        expect.objectContaining({
          handle: "accessories",
          title: "Accessories",
        }),
      ]),
    );

    expect(
      (await demo.getCollections()).map((collection) => collection.handle),
    ).toEqual(["", "lighting", "accessories"]);
    expect(
      (await demo.getCollectionProducts({ collection: "lighting" })).map(
        (product) => product.handle,
      ),
    ).toEqual(["aurora-desk-lamp", "halo-wireless-speaker"]);
    expect(
      (await demo.getCollectionProducts({ collection: "unknown" })).map(
        (product) => product.handle,
      ),
    ).toEqual([]);
    await expect(demo.getCollection("accessories")).resolves.toMatchObject({
      title: "Accessories",
    });
    await expect(demo.getCollection("unknown")).resolves.toBeUndefined();
  });

  it.each([
    ["RELEVANCE", false, ["aurora-desk-lamp", "zephyr-desk-organizer"]],
    ["BEST_SELLING", false, ["aurora-desk-lamp", "zephyr-desk-organizer"]],
    ["CREATED_AT", true, ["zephyr-desk-organizer", "aurora-desk-lamp"]],
    ["PRICE", false, ["zephyr-desk-organizer", "aurora-desk-lamp"]],
    ["PRICE", true, ["aurora-desk-lamp", "zephyr-desk-organizer"]],
  ])(
    "searches by query with %s sorting",
    async (sortKey, reverse, expected) => {
      const products = await demo.getProducts({
        query: "DeSk",
        reverse,
        sortKey,
      });

      expect(products.map((product) => product.handle)).toEqual(expected);
    },
  );

  it("creates, adds to, updates, and removes cart lines", async () => {
    const cart = await demo.createCart();
    cookieStore.set("cartId", cart.id!);

    expect(cart).toMatchObject({
      totalQuantity: 0,
      lines: [],
      cost: { totalAmount: { amount: "0" } },
    });

    const afterAdd = await demo.addToCart([
      { merchandiseId: "demo-aurora-desk-lamp-variant", quantity: 2 },
      { merchandiseId: "demo-pebble-mug-variant", quantity: 1 },
    ]);
    const lampLine = afterAdd.lines.find(
      (line) => line.merchandise.id === "demo-aurora-desk-lamp-variant",
    )!;
    const mugLine = afterAdd.lines.find(
      (line) => line.merchandise.id === "demo-pebble-mug-variant",
    )!;

    expect(afterAdd).toMatchObject({
      totalQuantity: 3,
      cost: { totalAmount: { amount: "196.00" } },
    });

    const afterUpdate = await demo.updateCart([
      {
        id: lampLine.id!,
        merchandiseId: lampLine.merchandise.id,
        quantity: 1,
      },
    ]);

    expect(afterUpdate).toMatchObject({
      totalQuantity: 2,
      cost: { totalAmount: { amount: "107.00" } },
    });

    const afterRemove = await demo.removeFromCart([mugLine.id!]);

    expect(afterRemove).toMatchObject({
      totalQuantity: 1,
      cost: { totalAmount: { amount: "89.00" } },
    });
    expect(afterRemove.lines).toHaveLength(1);
    expect(afterRemove.lines[0]?.merchandise.id).toBe(
      "demo-aurora-desk-lamp-variant",
    );
  });

  it("replaces a stale cart cookie before performing a cart mutation", async () => {
    cookieStore.set("cartId", "demo-cart-from-a-prior-server");

    const cart = await demo.addToCart([
      { merchandiseId: "demo-cedar-notebook-variant", quantity: 1 },
    ]);

    expect(cart.id).toMatch(/^demo-cart-/);
    expect(cart.id).not.toBe("demo-cart-from-a-prior-server");
    expect(cookieStore.set).toHaveBeenCalledWith("cartId", cart.id);
    expect(await demo.getCart()).toBe(cart);
    expect(cart).toMatchObject({
      totalQuantity: 1,
      cost: { totalAmount: { amount: "24.00" } },
    });
  });

  it("returns the about page", async () => {
    await expect(demo.getPage("about")).resolves.toMatchObject({
      id: "demo-page-about",
      title: "About",
      handle: "about",
      seo: { description: "About this demo storefront." },
    });
    await expect(demo.getPage("missing")).resolves.toBeUndefined();
  });
});
