import { ApiError } from "@/api/errors";
import { placeOrderRequest } from "@/api/order.api";
import type { CartModel } from "@/models/cart.model";
import type { CheckoutModel, RawCheckoutInput } from "@/models/checkout.model";
import {
  isOrderConfirmationDto,
  toOrderConfirmation,
  type OrderConfirmation,
} from "@/models/order.dto";
import type { ProductModel } from "@/models/product.model";
import { calculateTotal } from "@/services/cart.service";

/** Builds the purchase payload from the validated form and the current cart. */
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
 * Decoupling point: the view only knows this function, never `order.api.ts`. It
 * posts the shipping address (the backend takes the items from the server cart)
 * and validates the confirmation before handing it back.
 */
export async function submitCheckout(order: CheckoutModel): Promise<OrderConfirmation> {
  const zip = order.buyer.zipCode.trim();
  const address = {
    street: order.buyer.street.trim(),
    city: order.buyer.city.trim(),
    region: order.buyer.region.trim(),
    ...(zip.length > 0 ? { zipCode: zip } : {}),
  };
  const payload = await placeOrderRequest(address);

  if (!isOrderConfirmationDto(payload)) {
    throw new ApiError("invalid-payload", "The order response does not have the expected shape.");
  }
  return toOrderConfirmation(payload);
}
