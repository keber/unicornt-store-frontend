import { EMPTY_CART, isCartItemModelArray, type CartModel } from "@/models/cart.model";

export const CART_STORAGE_KEY = "unicornt_cart";

/**
 * Lee el carrito desde localStorage sin confiar en JSON.parse a ciegas:
 * ausente, corrupto, o con una forma distinta a CartItemModel[] degrada
 * a un carrito vacio. Mismo comportamiento observable que getCart() en
 * assets/js/cart.js (ver docs/etapa-1-baseline.md), ahora tipado y
 * cubierto por pruebas.
 */
export function readCart(storage: Storage = window.localStorage): CartModel {
  const raw = storage.getItem(CART_STORAGE_KEY);
  if (raw === null) {
    return EMPTY_CART;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return EMPTY_CART;
  }

  if (!isCartItemModelArray(parsed)) {
    return EMPTY_CART;
  }

  return { items: parsed };
}

/**
 * Persiste el carrito en la misma forma de array plano que ya usan los
 * usuarios actuales, para no invalidar carritos existentes al desplegar
 * este cambio.
 */
export function writeCart(cart: CartModel, storage: Storage = window.localStorage): void {
  storage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items));
}
