import { apiFetch } from "@/api/http";

export interface ShippingAddressPayload {
  readonly street: string;
  readonly city: string;
  readonly region: string;
  readonly zipCode?: string;
}

/**
 * Order transport. `POST /api/v1/orders` on the real backend through the shared
 * {@link apiFetch}; items come from the server cart, only the address is sent.
 * Returns the body as `unknown`; validation lives in `checkout.service.ts`.
 */
export async function placeOrderRequest(address: ShippingAddressPayload): Promise<unknown> {
  return apiFetch("/api/v1/orders", { method: "POST", body: { shippingAddress: address } });
}
