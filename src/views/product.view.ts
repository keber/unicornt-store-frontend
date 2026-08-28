import { createProductDetail } from "@/components/ProductDetail/ProductDetail";
import {
  RETRY_BUTTON_SELECTOR,
  renderErrorFallback,
} from "@/components/ErrorFallback/ErrorFallback";
import { renderLoadingState } from "@/components/LoadingSkeleton/LoadingSkeleton";
import { showToast } from "@/components/Toast/Toast";
import { flashButtonFeedback } from "@/lib/button-feedback";
import { requireElement, requireElementOfType } from "@/lib/dom";
import { clampQuantity, parseQuantityInput } from "@/lib/quantity";
import type { ProductModel } from "@/models/product.model";
import { addItem } from "@/services/cart.service";
import { fetchProducts } from "@/services/product.service";
import { readCart, writeCart } from "@/storage/cart.storage";
import { initCartView, updateCartBadge } from "@/views/cart.view";

const PRODUCT_CONTENT_SELECTOR = "#product-content";
const BREADCRUMB_NAME_SELECTOR = "#breadcrumb-name";

function getRequestedProductId(): number | null {
  const raw = new URLSearchParams(window.location.search).get("id");
  if (raw === null) {
    return null;
  }
  const id = Number.parseInt(raw, 10);
  return Number.isInteger(id) ? id : null;
}

function wireQuantitySelector(container: Element): HTMLInputElement {
  const qtyInput = requireElementOfType("#qty-input", HTMLInputElement, container);
  const qtyMinus = requireElementOfType("#qty-minus", HTMLButtonElement, container);
  const qtyPlus = requireElementOfType("#qty-plus", HTMLButtonElement, container);

  qtyMinus.addEventListener("click", () => {
    qtyInput.value = String(clampQuantity(parseQuantityInput(qtyInput.value) - 1));
  });
  qtyPlus.addEventListener("click", () => {
    qtyInput.value = String(clampQuantity(parseQuantityInput(qtyInput.value) + 1));
  });

  return qtyInput;
}

function wireAddToCart(
  container: Element,
  product: ProductModel,
  qtyInput: HTMLInputElement,
): void {
  const addButton = requireElementOfType("#btn-add-detail", HTMLButtonElement, container);
  addButton.addEventListener("click", () => {
    const qty = parseQuantityInput(qtyInput.value);
    writeCart(addItem(readCart(), product.id, qty));
    updateCartBadge();
    showToast(`¡${product.name} agregado al carrito!`);
    flashButtonFeedback(addButton, '<i class="fa-solid fa-check me-2"></i>¡Agregado!', 1800);
  });
}

/**
 * Carga y renderiza el detalle (Etapas 4 y 6): aria-busy mientras
 * fetchProducts() esta en vuelo, skeleton -> detalle o fallback con
 * reintentar, y aria-busy se retira en el finally sin importar si
 * termino en exito, error o el redirect por id invalido.
 */
async function renderProduct(container: Element): Promise<void> {
  container.setAttribute("aria-busy", "true");
  container.innerHTML = renderLoadingState("Cargando producto...");

  try {
    let products: ProductModel[];
    try {
      products = await fetchProducts();
    } catch {
      container.innerHTML = renderErrorFallback("No se pudo cargar el producto. Intenta de nuevo.");
      updateCartBadge();
      requireElement(RETRY_BUTTON_SELECTOR, container).addEventListener(
        "click",
        () => {
          void renderProduct(container);
        },
        { once: true },
      );
      return;
    }

    const id = getRequestedProductId();
    const product = id === null ? undefined : products.find((p) => p.id === id);

    if (!product) {
      window.location.href = "index.html";
      return;
    }

    requireElement(BREADCRUMB_NAME_SELECTOR).textContent = product.name;
    document.title = `${product.name} - Unicorn't Store`;

    container.appendChild(createProductDetail(product));
    const qtyInput = wireQuantitySelector(container);
    wireAddToCart(container, product, qtyInput);
    initCartView(products);
  } finally {
    container.removeAttribute("aria-busy");
  }
}

export function initProductView(): void {
  void renderProduct(requireElement(PRODUCT_CONTENT_SELECTOR));
}
