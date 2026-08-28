import { submitOrder } from "@/api/checkout.api";
import type { CartModel } from "@/models/cart.model";
import type { CheckoutModel, RawCheckoutInput } from "@/models/checkout.model";
import type { ProductModel } from "@/models/product.model";
import { calculateTotal } from "@/services/cart.service";

/** Construye el payload de la compra a partir del formulario ya validado y el carrito actual. */
export function buildCheckoutModel(
  buyer: RawCheckoutInput,
  cart: CartModel,
  products: readonly ProductModel[],
): CheckoutModel {
  return {
    buyer,
    items: cart.items,
    total: calculateTotal(cart, products),
    status: "submitting",
  };
}

/**
 * Punto de desacople: la vista solo conoce esta funcion, nunca
 * api/checkout.api.ts directamente. Cuando el Hito 4 tenga un backend
 * real, el cambio queda contenido en submitOrder().
 */
export async function submitCheckout(order: CheckoutModel): Promise<void> {
  await submitOrder(order);
}
