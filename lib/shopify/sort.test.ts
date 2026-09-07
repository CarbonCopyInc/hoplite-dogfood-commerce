import { describe, expect, it } from "vitest";

import { sortProducts } from "./sort";

const products = [
  {
    title: "Zephyr Desk Organizer",
    createdAt: "2026-09-03T10:00:00.000Z",
    priceRange: { minVariantPrice: { amount: "42.00" } },
  },
  {
    title: "Aurora Desk Lamp",
    createdAt: "2026-06-12T10:00:00.000Z",
    priceRange: { minVariantPrice: { amount: "89.00" } },
  },
  {
    title: "Cedar Notebook",
    createdAt: "2026-06-26T10:00:00.000Z",
    priceRange: { minVariantPrice: { amount: "24.00" } },
  },
];

describe("sortProducts", () => {
  it.each([
    [
      "TITLE",
      false,
      ["Aurora Desk Lamp", "Cedar Notebook", "Zephyr Desk Organizer"],
    ],
    [
      "PRICE",
      false,
      ["Cedar Notebook", "Zephyr Desk Organizer", "Aurora Desk Lamp"],
    ],
    [
      "PRICE",
      true,
      ["Aurora Desk Lamp", "Zephyr Desk Organizer", "Cedar Notebook"],
    ],
  ])("sorts products by %s", (sortKey, reverse, expected) => {
    expect(
      sortProducts(products, reverse, sortKey).map((product) => product.title),
    ).toEqual(expected);
  });
});
