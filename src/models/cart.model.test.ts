import { describe, expect, it } from "vitest";
import { isCartItemModel, isCartItemModelArray } from "@/models/cart.model";

describe("isCartItemModel", () => {
  it("acepta un item valido", () => {
    expect(isCartItemModel({ id: 1, qty: 2 })).toBe(true);
  });

  it("rechaza qty o id en cero, negativos o no enteros", () => {
    expect(isCartItemModel({ id: 1, qty: 0 })).toBe(false);
    expect(isCartItemModel({ id: 1, qty: -1 })).toBe(false);
    expect(isCartItemModel({ id: 1, qty: 1.5 })).toBe(false);
    expect(isCartItemModel({ id: 0, qty: 1 })).toBe(false);
  });

  it("rechaza tipos incorrectos y valores no objeto", () => {
    expect(isCartItemModel({ id: "1", qty: 2 })).toBe(false);
    expect(isCartItemModel(null)).toBe(false);
    expect(isCartItemModel([1, 2])).toBe(false);
    expect(isCartItemModel("not-an-item")).toBe(false);
  });
});

describe("isCartItemModelArray", () => {
  it("acepta un array vacio (carrito vacio)", () => {
    expect(isCartItemModelArray([])).toBe(true);
  });

  it("rechaza el array completo si un item es invalido", () => {
    expect(
      isCartItemModelArray([
        { id: 1, qty: 1 },
        { id: 2, qty: -1 },
      ]),
    ).toBe(false);
  });

  it("rechaza valores que no son array", () => {
    expect(isCartItemModelArray({ id: 1, qty: 1 })).toBe(false);
  });
});
