import { fetchCartPayload, mergeCartPayload } from "@/api/cart.api";
import { ApiError } from "@/api/errors";
import { isCartDto, toCartModel, toMergeItems } from "@/models/cart.dto";
import type { CartItemModel, CartModel } from "@/models/cart.model";

/**
 * Anonymous -> authenticated cart transition.
 *
 * These functions call the api module and validate the response; they never touch
 * `fetch`, `window` or `localStorage`. The caller (the auth-success path, owned by
 * the identity slice) is responsible for reading the local cart, passing its items
 * here, and clearing local storage once the returned {@link CartModel} — the new
 * source of truth — is in hand.
 */

function parseCart(payload: unknown): CartModel {
  if (!isCartDto(payload)) {
    throw new ApiError("invalid-payload", "The cart response does not have the expected shape.");
  }
  return toCartModel(payload);
}

/** Reads the authenticated user's cart from the backend. */
export async function fetchRemoteCart(): Promise<CartModel> {
  return parseCart(await fetchCartPayload());
}

/**
 * Merges the local (anonymous) cart into the authenticated user's cart and returns
 * the merged, server-authoritative cart. With nothing stored locally there is
 * nothing to merge, so the current server cart is returned as-is.
 */
export async function mergeLocalCart(localItems: readonly CartItemModel[]): Promise<CartModel> {
  const items = toMergeItems(localItems);
  if (items.length === 0) {
    return fetchRemoteCart();
  }
  return parseCart(await mergeCartPayload(items));
}
