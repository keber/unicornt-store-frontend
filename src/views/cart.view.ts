import { formatPrice } from "@/lib/currency";
import {
  assertElementType,
  closestFromEventTarget,
  requireDataId,
  requireElement,
  requireElementOfType,
} from "@/lib/dom";
import { MAX_QUANTITY, parseQuantityInput } from "@/lib/quantity";
import { renderCartItemsHtml } from "@/components/CartPanel/CartPanel";
import type { CartModel } from "@/models/cart.model";
import type { ProductModel } from "@/models/product.model";
import {
  calculateTotal,
  clearCart,
  countItems,
  removeItem,
  setItemQty,
  toCartLines,
} from "@/services/cart.service";
import { readCart, writeCart } from "@/storage/cart.storage";
import { completeSimulatedCheckout, initCheckoutForm } from "@/views/checkout.view";

/**
 * Wiring del offcanvas del carrito (Etapa 4, pasos 3 y 4 del
 * REFACTOR-GUIDE.md). Presente en ambas paginas -- catalog.main.ts y
 * product.main.ts llaman a initCartView() una vez que tienen el
 * catalogo cargado, porque el panel necesita precio/nombre/imagen de
 * cada producto para renderizar sus lineas.
 */

const CART_BADGE_SELECTOR = "#cart-badge";
const CART_OFFCANVAS_SELECTOR = "#cartOffcanvas";
const CART_ITEMS_SELECTOR = "#cart-items";
const CART_FOOTER_SELECTOR = "#cart-footer";
const CART_TOTAL_SELECTOR = "#cart-total";
const BTN_CLEAR_SELECTOR = "#btn-clear-cart";
const CHECKOUT_FORM_SELECTOR = "#checkout-form";

/** No depende del catalogo: el badge solo necesita la cantidad total de unidades. */
export function updateCartBadge(): void {
  const badge = requireElementOfType(CART_BADGE_SELECTOR, HTMLSpanElement);
  const count = countItems(readCart());
  badge.textContent = String(count);
  badge.style.display = count > 0 ? "inline-block" : "none";
}

function renderCartPanel(products: readonly ProductModel[]): void {
  const cart = readCart();
  const lines = toCartLines(cart, products);

  const itemsEl = requireElement(CART_ITEMS_SELECTOR);
  const footerEl = requireElementOfType(CART_FOOTER_SELECTOR, HTMLDivElement);
  const totalEl = requireElement(CART_TOTAL_SELECTOR);

  itemsEl.innerHTML = renderCartItemsHtml(lines);
  footerEl.style.display = lines.length === 0 ? "none" : "block";
  totalEl.textContent = formatPrice(calculateTotal(cart, products));
}

function persistAndRerender(next: CartModel, products: readonly ProductModel[]): void {
  writeCart(next);
  updateCartBadge();
  renderCartPanel(products);
}

function readQtyInput(id: number, root: Element): number {
  const input = requireElementOfType(
    `.cart-qty-input[data-id="${String(id)}"]`,
    HTMLInputElement,
    root,
  );
  return parseQuantityInput(input.value);
}

function wireItemsDelegatedClicks(itemsEl: Element, products: readonly ProductModel[]): void {
  itemsEl.addEventListener("click", (event) => {
    const removeBtn = closestFromEventTarget(event.target, ".btn-cart-remove");
    if (removeBtn) {
      persistAndRerender(removeItem(readCart(), requireDataId(removeBtn)), products);
      return;
    }

    const minusBtn = closestFromEventTarget(event.target, ".btn-cart-minus");
    if (minusBtn) {
      const id = requireDataId(minusBtn);
      // Sin piso: si llega a 0, setItemQty() elimina el item (igual que el legado).
      persistAndRerender(setItemQty(readCart(), id, readQtyInput(id, itemsEl) - 1), products);
      return;
    }

    const plusBtn = closestFromEventTarget(event.target, ".btn-cart-plus");
    if (plusBtn) {
      const id = requireDataId(plusBtn);
      const nextQty = Math.min(MAX_QUANTITY, readQtyInput(id, itemsEl) + 1);
      persistAndRerender(setItemQty(readCart(), id, nextQty), products);
    }
  });

  itemsEl.addEventListener("change", (event) => {
    const input = closestFromEventTarget(event.target, ".cart-qty-input");
    if (!input) {
      return;
    }
    assertElementType(input, HTMLInputElement, ".cart-qty-input");
    const id = requireDataId(input);
    persistAndRerender(setItemQty(readCart(), id, parseQuantityInput(input.value)), products);
  });
}

export function initCartView(products: readonly ProductModel[]): void {
  updateCartBadge();

  const offcanvasEl = requireElement(CART_OFFCANVAS_SELECTOR);
  offcanvasEl.addEventListener("show.bs.offcanvas", () => {
    renderCartPanel(products);
  });

  wireItemsDelegatedClicks(requireElement(CART_ITEMS_SELECTOR), products);

  requireElementOfType(BTN_CLEAR_SELECTOR, HTMLButtonElement).addEventListener("click", () => {
    persistAndRerender(clearCart(), products);
  });

  initCheckoutForm(requireElementOfType(CHECKOUT_FORM_SELECTOR, HTMLFormElement), {
    getCart: readCart,
    getProducts: () => products,
    onSuccess: () => {
      persistAndRerender(clearCart(), products);
      completeSimulatedCheckout(offcanvasEl);
    },
  });
}
