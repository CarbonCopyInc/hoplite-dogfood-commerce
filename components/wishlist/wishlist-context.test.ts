import { describe, expect, it } from "vitest";
import {
  parseWishlist,
  readWishlist,
  WISHLIST_STORAGE_KEY,
  writeWishlist,
} from "./wishlist-context";

describe("parseWishlist", () => {
  it("returns unique normalized product handles", () => {
    expect(parseWishlist('[" mug ","shirt","mug",null,""]')).toEqual([
      "mug",
      "shirt",
    ]);
  });

  it("returns an empty wishlist for invalid stored data", () => {
    expect(parseWishlist("not-json")).toEqual([]);
    expect(parseWishlist('{"handle":"mug"}')).toEqual([]);
    expect(parseWishlist(null)).toEqual([]);
  });
});

describe("wishlist storage", () => {
  it("falls back to an empty wishlist when storage is unavailable", () => {
    expect(
      readWishlist({
        getItem: () => {
          throw new Error("Storage disabled");
        },
      }),
    ).toEqual([]);
  });

  it("does not throw when a wishlist cannot be persisted", () => {
    expect(() =>
      writeWishlist(
        {
          setItem: () => {
            throw new Error("Quota exceeded");
          },
        },
        ["mug"],
      ),
    ).not.toThrow();
  });

  it("persists wishlist handles under the storefront key", () => {
    let storedKey = "";
    let storedValue = "";

    writeWishlist(
      {
        setItem: (key, value) => {
          storedKey = key;
          storedValue = value;
        },
      },
      ["mug", "shirt"],
    );

    expect(storedKey).toBe(WISHLIST_STORAGE_KEY);
    expect(storedValue).toBe('["mug","shirt"]');
  });
});
