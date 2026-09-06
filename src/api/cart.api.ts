import { apiFetch } from "@/api/http";
import type { CartMergeItem } from "@/models/cart.dto";

/**
 * Cart transport. The authenticated cart lives on the Spring Boot backend; this
 * layer only performs the HTTP call through the shared {@link apiFetch} and
 * returns the body as `unknown`. It knows nothing about `CartDto` or `CartModel`.
 *
 * While logged out the cart stays in `localStorage` (see `storage/cart.storage.ts`)
 * and none of these functions is called.
 */

/** `GET /api/v1/cart` — the current user's cart. */
export async function fetchCartPayload(): Promise<unknown> {
  return apiFetch("/api/v1/cart");
}

/** `POST /api/v1/cart/merge` — fold the local cart into the user's cart on login. */
export async function mergeCartPayload(items: readonly CartMergeItem[]): Promise<unknown> {
  return apiFetch("/api/v1/cart/merge", { method: "POST", body: { items } });
}
