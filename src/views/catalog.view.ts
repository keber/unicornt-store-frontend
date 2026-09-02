import { createProductCardElement } from "@/components/ProductCard/ProductCard";
import {
  RETRY_BUTTON_SELECTOR,
  createErrorFallback,
} from "@/components/ErrorFallback/ErrorFallback";
import { createLoadingState } from "@/components/LoadingSkeleton/LoadingSkeleton";
import { showToast } from "@/components/Toast/Toast";
import { flashButtonFeedback } from "@/lib/button-feedback";
import {
  assertElementType,
  closestFromEventTarget,
  requireDataId,
  requireElement,
} from "@/lib/dom";
import { addItem } from "@/services/cart.service";
import { fetchProducts } from "@/services/product.service";
import { readCart, writeCart } from "@/storage/cart.storage";
import { initCartView, updateCartBadge } from "@/views/cart.view";

const PRODUCT_LIST_SELECTOR = "#product-list";

function wireAddToCartDelegation(container: Element): void {
  container.addEventListener("click", (event) => {
    const button = closestFromEventTarget(event.target, ".btn-add-cart");
    if (!button) {
      return;
    }
    assertElementType(button, HTMLButtonElement, ".btn-add-cart");

    const id = requireDataId(button);
    writeCart(addItem(readCart(), id));
    updateCartBadge();
    showToast("¡Producto agregado al carrito!");
    flashButtonFeedback(button, '<i class="fa-solid fa-check me-1"></i>Agregado', 1500);
  });
}

/**
 * Carga y renderiza el catalogo (Etapas 4 y 6): aria-busy mientras
 * fetchProducts() esta en vuelo, skeleton -> catalogo o fallback con
 * reintentar, y aria-busy se retira en el finally sin importar el
 * resultado (Hito 2, criterio de asincronia).
 */
async function renderCatalog(container: Element): Promise<void> {
  container.setAttribute("aria-busy", "true");
  container.replaceChildren(createLoadingState("Cargando catálogo..."));

  try {
    const products = await fetchProducts();
    container.replaceChildren(...products.map(createProductCardElement));
    wireAddToCartDelegation(container);
    initCartView(products);
  } catch {
    container.replaceChildren(
      createErrorFallback("No se pudo cargar el catálogo. Intenta de nuevo."),
    );
    updateCartBadge();
    requireElement(RETRY_BUTTON_SELECTOR, container).addEventListener(
      "click",
      () => {
        void renderCatalog(container);
      },
      { once: true },
    );
  } finally {
    container.removeAttribute("aria-busy");
  }
}

export function initCatalogView(): void {
  void renderCatalog(requireElement(PRODUCT_LIST_SELECTOR));
}
