import { describe, expect, it } from "vitest";
import { isCartDto, isCartItemDto, toCartModel, toMergeItems } from "@/models/cart.dto";

const validItem = {
  productId: 12,
  productName: "Unicorn plush",
  imageBase: "unicorn-plush",
  unitPrice: 14990,
  quantity: 2,
  subtotal: 29980,
};

const validCart = { items: [validItem], itemCount: 2, total: 29980 };

describe("isCartItemDto", () => {
  it("accepts a well-formed priced line", () => {
    expect(isCartItemDto(validItem)).toBe(true);
  });

  it("rejects a non-positive or non-integer productId / quantity", () => {
    expect(isCartItemDto({ ...validItem, productId: 0 })).toBe(false);
    expect(isCartItemDto({ ...validItem, quantity: 1.5 })).toBe(false);
    expect(isCartItemDto({ ...validItem, quantity: 0 })).toBe(false);
  });

  it("rejects null, primitives and missing fields", () => {
    expect(isCartItemDto(null)).toBe(false);
    expect(isCartItemDto("plush")).toBe(false);
    expect(isCartItemDto({ productId: 12, quantity: 2 })).toBe(false);
  });
});

describe("isCartDto", () => {
  it("accepts an empty cart and an all-valid cart", () => {
    expect(isCartDto({ items: [], itemCount: 0, total: 0 })).toBe(true);
    expect(isCartDto(validCart)).toBe(true);
  });

  it("rejects a cart with a bad line or non-numeric aggregates", () => {
    expect(isCartDto({ ...validCart, items: [{ ...validItem, productId: -1 }] })).toBe(false);
    expect(isCartDto({ ...validCart, total: "29980" })).toBe(false);
    expect(isCartDto({ items: "nope", itemCount: 0, total: 0 })).toBe(false);
    expect(isCartDto(null)).toBe(false);
  });
});

describe("toCartModel", () => {
  it("maps productId/quantity onto the legacy id/qty model shape", () => {
    expect(toCartModel(validCart)).toEqual({ items: [{ id: 12, qty: 2 }] });
  });

  it("maps an empty cart to an empty item list", () => {
    expect(toCartModel({ items: [], itemCount: 0, total: 0 })).toEqual({ items: [] });
  });
});

describe("toMergeItems", () => {
  it("turns local id/qty lines into productId/quantity merge lines", () => {
    expect(
      toMergeItems([
        { id: 12, qty: 1 },
        { id: 20, qty: 3 },
      ]),
    ).toEqual([
      { productId: 12, quantity: 1 },
      { productId: 20, quantity: 3 },
    ]);
  });

  it("maps an empty local cart to an empty list", () => {
    expect(toMergeItems([])).toEqual([]);
  });
});
