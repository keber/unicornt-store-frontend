import { describe, expect, it } from "vitest";
import { CART_STORAGE_KEY, readCart, writeCart } from "@/storage/cart.storage";
import type { CartModel } from "@/models/cart.model";

/** Fake minimo de Storage, para no depender del localStorage global de jsdom entre tests. */
function createMemoryStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
    clear: () => {
      data.clear();
    },
    key: (index) => Array.from(data.keys())[index] ?? null,
    get length() {
      return data.size;
    },
  };
}

describe("readCart", () => {
  it("devuelve un carrito vacio si no hay nada guardado", () => {
    const storage = createMemoryStorage();
    expect(readCart(storage)).toEqual({ items: [] });
  });

  it("lee y valida un carrito guardado correctamente", () => {
    const storage = createMemoryStorage({
      [CART_STORAGE_KEY]: JSON.stringify([{ id: 1, qty: 2 }]),
    });

    expect(readCart(storage)).toEqual({ items: [{ id: 1, qty: 2 }] });
  });

  it("degrada a carrito vacio si el JSON esta corrupto", () => {
    const storage = createMemoryStorage({ [CART_STORAGE_KEY]: "{not valid json" });
    expect(readCart(storage)).toEqual({ items: [] });
  });

  it("degrada a carrito vacio si la forma no es CartItemModel[]", () => {
    const storage = createMemoryStorage({
      [CART_STORAGE_KEY]: JSON.stringify({ id: 1, qty: 2 }),
    });
    expect(readCart(storage)).toEqual({ items: [] });
  });

  it("degrada a carrito vacio si algun item tiene qty invalida", () => {
    const storage = createMemoryStorage({
      [CART_STORAGE_KEY]: JSON.stringify([{ id: 1, qty: -3 }]),
    });
    expect(readCart(storage)).toEqual({ items: [] });
  });
});

describe("writeCart", () => {
  it("persiste los items como array plano, compatible con el formato legado", () => {
    const storage = createMemoryStorage();
    const cart: CartModel = { items: [{ id: 5, qty: 3 }] };

    writeCart(cart, storage);

    expect(storage.getItem(CART_STORAGE_KEY)).toBe(JSON.stringify([{ id: 5, qty: 3 }]));
  });

  it("round-trip: lo que se escribe se puede volver a leer igual", () => {
    const storage = createMemoryStorage();
    const cart: CartModel = {
      items: [
        { id: 1, qty: 1 },
        { id: 2, qty: 4 },
      ],
    };

    writeCart(cart, storage);

    expect(readCart(storage)).toEqual(cart);
  });
});
