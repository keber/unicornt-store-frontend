import { ApiError } from "@/api/errors";
import { httpCheckoutGateway, type CheckoutGateway } from "@/gateways/checkout.gateway";
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
 * depends on the {@link CheckoutGateway} port, posts the shipping address (the
 * backend takes the items from the server cart) and validates the confirmation.
 */
export async function submitCheckout(
  order: CheckoutModel,
  gateway: CheckoutGateway = httpCheckoutGateway,
): Promise<OrderConfirmation> {
  const zip = order.buyer.zipCode.trim();
  const address = {
    street: order.buyer.street.trim(),
    city: order.buyer.city.trim(),
    region: order.buyer.region.trim(),
    ...(zip.length > 0 ? { zipCode: zip } : {}),
  };
  const payload = await gateway.placeOrder(address);

  if (!isOrderConfirmationDto(payload)) {
    throw new ApiError("invalid-payload", "The order response does not have the expected shape.");
  }
  return toOrderConfirmation(payload);
}
