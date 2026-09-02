import { describe, expect, it } from "vitest";
import {
  addItem,
  calculateTotal,
  clearCart,
  countItems,
  removeItem,
  setItemQty,
  toCartLines,
} from "@/services/cart.service";
import type { CartModel } from "@/models/cart.model";
import type { ProductModel } from "@/models/product.model";

const products: ProductModel[] = [
  {
    id: 1,
    name: "Polera A",
    category: "Polera",
    subcategory: "devops",
    price: 10000,
    description: "d",
    image: "assets/img/devops/a",
  },
  {
    id: 2,
    name: "Polera B",
    category: "Polera",
    subcategory: "qa",
    price: 5000,
    description: "d",
    image: "assets/img/qa/b",
  },
];

describe("addItem", () => {
  it("agrega un producto nuevo con qty por defecto 1", () => {
    const cart = addItem({ items: [] }, 1);
    expect(cart.items).toEqual([{ id: 1, qty: 1 }]);
  });

  it("incrementa la cantidad si el producto ya esta en el carrito", () => {
    const cart: CartModel = { items: [{ id: 1, qty: 2 }] };
    expect(addItem(cart, 1, 3).items).toEqual([{ id: 1, qty: 5 }]);
  });

  it("no muta el carrito original (inmutable)", () => {
    const cart: CartModel = { items: [{ id: 1, qty: 1 }] };
    addItem(cart, 1, 1);
    expect(cart.items).toEqual([{ id: 1, qty: 1 }]);
  });
});

describe("removeItem", () => {
  it("elimina el item por id", () => {
    const cart: CartModel = {
      items: [
        { id: 1, qty: 1 },
        { id: 2, qty: 1 },
      ],
    };
    expect(removeItem(cart, 1).items).toEqual([{ id: 2, qty: 1 }]);
  });
});

describe("setItemQty", () => {
  it("actualiza la cantidad de un item existente", () => {
    const cart: CartModel = { items: [{ id: 1, qty: 1 }] };
    expect(setItemQty(cart, 1, 7).items).toEqual([{ id: 1, qty: 7 }]);
  });

  it("elimina el item si qty es 0 o negativa", () => {
    const cart: CartModel = { items: [{ id: 1, qty: 3 }] };
    expect(setItemQty(cart, 1, 0).items).toEqual([]);
    expect(setItemQty(cart, 1, -5).items).toEqual([]);
  });
});

describe("clearCart", () => {
  it("devuelve un carrito vacio", () => {
    expect(clearCart()).toEqual({ items: [] });
  });
});

describe("countItems", () => {
  it("suma las cantidades de todos los items", () => {
    const cart: CartModel = {
      items: [
        { id: 1, qty: 2 },
        { id: 2, qty: 3 },
      ],
    };
    expect(countItems(cart)).toBe(5);
  });

  it("devuelve 0 para un carrito vacio", () => {
    expect(countItems({ items: [] })).toBe(0);
  });
});

describe("calculateTotal", () => {
  it("suma price * qty cruzando con el catalogo", () => {
    const cart: CartModel = {
      items: [
        { id: 1, qty: 2 },
        { id: 2, qty: 1 },
      ],
    };
    expect(calculateTotal(cart, products)).toBe(10000 * 2 + 5000);
  });

  it("ignora items huerfanos (id que ya no existe en el catalogo)", () => {
    const cart: CartModel = { items: [{ id: 999, qty: 5 }] };
    expect(calculateTotal(cart, products)).toBe(0);
  });
});

describe("toCartLines", () => {
  it("empareja cada item con su producto y calcula el subtotal", () => {
    const cart: CartModel = { items: [{ id: 2, qty: 3 }] };
    expect(toCartLines(cart, products)).toEqual([
      { item: { id: 2, qty: 3 }, product: products[1], subtotal: 15000 },
    ]);
  });

  it("descarta items huerfanos en vez de romper", () => {
    const cart: CartModel = { items: [{ id: 999, qty: 1 }] };
    expect(toCartLines(cart, products)).toEqual([]);
  });
});
