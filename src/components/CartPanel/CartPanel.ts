import { formatPrice } from "@/lib/currency";
import { MAX_QUANTITY, MIN_QUANTITY } from "@/lib/quantity";
import { productImageSrc } from "@/models/product.model";
import type { CartLine } from "@/services/cart.service";

const EMPTY_CART_HTML = `
  <p class="text-muted text-center py-5">
    <i class="fa-solid fa-box-open fa-2x mb-2 d-block"></i>
    El carrito está vacío.
  </p>`;

function renderCartLine(line: CartLine): string {
  const { item, product, subtotal } = line;
  return `
    <div class="cart-item d-flex gap-3 align-items-start py-3 border-bottom" data-id="${String(product.id)}">
      <img
        src="${productImageSrc(product, "thumb")}"
        alt="${product.name}"
        class="cart-item__img rounded-2 flex-shrink-0"
        width="72" height="72"
      />
      <div class="flex-grow-1 min-w-0">
        <p class="mb-1 fw-semibold small lh-sm">${product.name}</p>
        <p class="mb-2 text-muted small">${formatPrice(product.price)} c/u</p>
        <div class="d-flex align-items-center gap-2">
          <div class="input-group input-group-sm qty-selector" style="width:96px">
            <button class="btn btn-outline-secondary btn-cart-minus" type="button" data-id="${String(product.id)}" aria-label="Reducir">−</button>
            <input
              type="number"
              class="form-control text-center cart-qty-input"
              value="${String(item.qty)}"
              min="${String(MIN_QUANTITY)}" max="${String(MAX_QUANTITY)}"
              data-id="${String(product.id)}"
              aria-label="Cantidad"
            />
            <button class="btn btn-outline-secondary btn-cart-plus" type="button" data-id="${String(product.id)}" aria-label="Aumentar">+</button>
          </div>
          <button class="btn btn-sm btn-outline-danger btn-cart-remove ms-auto" type="button" data-id="${String(product.id)}" aria-label="Eliminar">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
      <p class="mb-0 fw-bold text-accent small flex-shrink-0">${formatPrice(subtotal)}</p>
    </div>`;
}

/** HTML de #cart-items. Misma estructura que el renderCart() legado. */
export function renderCartItemsHtml(lines: readonly CartLine[]): string {
  if (lines.length === 0) {
    return EMPTY_CART_HTML;
  }
  return lines.map(renderCartLine).join("");
}
