import { formatPrice } from "@/lib/currency";
import { requireElementOfType } from "@/lib/dom";
import { MAX_QUANTITY, MIN_QUANTITY } from "@/lib/quantity";
import { productImageSrc } from "@/models/product.model";
import type { CartLine } from "@/services/cart.service";
import templateHtml from "./CartPanel_template.html?raw";

function createEmptyCart(): HTMLElement[] {
  const message = document.createElement("p");
  message.className = "text-muted text-center py-5";

  const icon = document.createElement("i");
  icon.className = "fa-solid fa-box-open fa-2x mb-2 d-block";

  message.append(icon, "El carrito está vacío.");
  return [message];
}

const CART_LINE_TEMPLATE = document.createElement("template");
CART_LINE_TEMPLATE.innerHTML = templateHtml;

function cloneCartPanelTemplate(): HTMLElement {
  const templateRoot = CART_LINE_TEMPLATE.content.firstElementChild;
  const clone = templateRoot?.cloneNode(true);

  if (!(clone instanceof HTMLElement)) {
    throw new TypeError("CartPanel_template.html debe contener un elemento HTML raíz.");
  }

  return clone;
}

function createCartLine(line: CartLine): HTMLElement {
  const { item, product, subtotal } = line;
  const id = String(product.id);

  const cartLine = cloneCartPanelTemplate();
  cartLine.dataset.id = id;

  const img = requireElementOfType(".cart-item__img", HTMLImageElement, cartLine);
  img.src = productImageSrc(product, "thumb");
  img.alt = product.name;

  requireElementOfType(".cart-item__name", HTMLElement, cartLine).textContent = product.name;
  requireElementOfType(".cart-item__price", HTMLElement, cartLine).textContent =
    `${formatPrice(product.price)} c/u`;
  requireElementOfType(".cart-item__subtotal", HTMLElement, cartLine).textContent =
    formatPrice(subtotal);

  requireElementOfType(".btn-cart-minus", HTMLButtonElement, cartLine).dataset.id = id;
  requireElementOfType(".btn-cart-plus", HTMLButtonElement, cartLine).dataset.id = id;
  requireElementOfType(".btn-cart-remove", HTMLButtonElement, cartLine).dataset.id = id;

  const qtyInput = requireElementOfType(".cart-qty-input", HTMLInputElement, cartLine);
  qtyInput.value = String(item.qty);
  qtyInput.min = String(MIN_QUANTITY);
  qtyInput.max = String(MAX_QUANTITY);
  qtyInput.dataset.id = id;

  return cartLine;
}

/** Nodos de #cart-items. Misma estructura que el renderCart() legado. */
export function createCartItems(lines: readonly CartLine[]): HTMLElement[] {
  if (lines.length === 0) {
    return createEmptyCart();
  }
  return lines.map(createCartLine);
}
