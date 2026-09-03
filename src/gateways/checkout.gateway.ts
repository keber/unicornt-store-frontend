import { placeOrderRequest, type ShippingAddressPayload } from "@/api/order.api";

/**
 * Port the checkout service depends on, instead of importing `api/order.api`
 * directly. Returns the raw body as `unknown`; the service validates the
 * confirmation.
 */
export interface CheckoutGateway {
  placeOrder(address: ShippingAddressPayload): Promise<unknown>;
}

export const httpCheckoutGateway: CheckoutGateway = {
  placeOrder: (address) => placeOrderRequest(address),
};
