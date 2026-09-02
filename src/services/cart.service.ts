import { EMPTY_CART, type CartItemModel, type CartModel } from "@/models/cart.model";
import type { ProductModel } from "@/models/product.model";

/**
 * Operaciones puras del carrito (Etapa 4, paso 3 del REFACTOR-GUIDE.md):
 * ninguna toca localStorage ni el DOM, todas devuelven un CartModel
 * nuevo. La lectura/escritura vive en storage/cart.storage.ts; el
 * render y los eventos, en views/cart.view.ts.
 */

export function addItem(cart: CartModel, productId: number, qty = 1): CartModel {
  const existing = cart.items.find((item) => item.id === productId);

  if (existing) {
    return {
      items: cart.items.map((item) =>
        item.id === productId ? { ...item, qty: item.qty + qty } : item,
      ),
    };
  }

  return { items: [...cart.items, { id: productId, qty }] };
}

export function removeItem(cart: CartModel, productId: number): CartModel {
  return { items: cart.items.filter((item) => item.id !== productId) };
}

/** qty <= 0 elimina el item, igual que el setCartItemQty() legado. */
export function setItemQty(cart: CartModel, productId: number, qty: number): CartModel {
  if (qty <= 0) {
    return removeItem(cart, productId);
  }
  return {
    items: cart.items.map((item) => (item.id === productId ? { ...item, qty } : item)),
  };
}

export function clearCart(): CartModel {
  return EMPTY_CART;
}

export function countItems(cart: CartModel): number {
  return cart.items.reduce((sum, item) => sum + item.qty, 0);
}

/** Items huerfanos (id que ya no existe en el catalogo) se ignoran, igual que el getCartTotal() legado. */
export function calculateTotal(cart: CartModel, products: readonly ProductModel[]): number {
  return cart.items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

/** Empareja cada item del carrito con su producto; descarta items huerfanos. */
export interface CartLine {
  readonly item: CartItemModel;
  readonly product: ProductModel;
  readonly subtotal: number;
}

export function toCartLines(cart: CartModel, products: readonly ProductModel[]): CartLine[] {
  const lines: CartLine[] = [];
  for (const item of cart.items) {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      lines.push({ item, product, subtotal: product.price * item.qty });
    }
  }
  return lines;
}
