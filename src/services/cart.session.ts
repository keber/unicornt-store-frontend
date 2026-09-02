import { EMPTY_CART } from "@/models/cart.model";
import { isAuthenticated, onAuthChange } from "@/services/auth.service";
import { mergeLocalCart } from "@/services/cart.sync";
import { readCart, writeCart } from "@/storage/cart.storage";

/**
 * Glue between the identity slice (auth events) and the cart slice (anonymous ->
 * authenticated sync). On a login the local `localStorage` cart is merged into the
 * server cart and then cleared, so the backend cart becomes the single source of
 * truth. On failure the local cart is left untouched.
 *
 * It also runs once on page load when a token is already stored: the login may
 * have happened on a different page (login.html), so the in-memory `onAuthChange`
 * event would have been missed.
 */
async function absorbLocalCart(): Promise<void> {
  const localItems = readCart().items;
  if (localItems.length === 0) {
    return;
  }
  try {
    await mergeLocalCart(localItems);
    writeCart(EMPTY_CART);
  } catch {
    // Keep the anonymous cart; the merge can be retried on the next load.
  }
}

let wired = false;

export function initCartSession(): void {
  if (wired) {
    return;
  }
  wired = true;

  onAuthChange((change) => {
    if (change.type === "login") {
      void absorbLocalCart();
    }
  });

  if (isAuthenticated()) {
    void absorbLocalCart();
  }
}
