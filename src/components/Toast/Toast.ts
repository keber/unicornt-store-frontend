import { Toast } from "bootstrap";
import { requireElement, requireElementOfType } from "@/lib/dom";

const TOAST_SELECTOR = "#cart-toast";
const TOAST_MESSAGE_SELECTOR = "#toast-message";

/** Muestra el toast de feedback (presente en ambas paginas). Reemplaza showCartToast() legado. */
export function showToast(message = "Producto agregado al carrito."): void {
  const toastEl = requireElementOfType(TOAST_SELECTOR, HTMLDivElement);
  const messageEl = requireElement(TOAST_MESSAGE_SELECTOR);

  messageEl.textContent = message;
  Toast.getOrCreateInstance(toastEl, { delay: 2500 }).show();
}
