import { describe, expect, it } from "vitest";
import { parseWishlist } from "./wishlist-context";

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
