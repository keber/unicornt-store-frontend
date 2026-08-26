import { renderProductCard } from "@/components/ProductCard/ProductCard";
import {
  RETRY_BUTTON_SELECTOR,
  renderErrorFallback,
} from "@/components/ErrorFallback/ErrorFallback";
import { renderLoadingState } from "@/components/LoadingSkeleton/LoadingSkeleton";
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
 * Carga y renderiza el catalogo (Etapa 4, paso 1). El manejo de
 * loading/error aqui es minimo a proposito -- la Etapa 6 lo formaliza
 * con aria-busy y un skeleton completo -- pero ya es funcional: no deja
 * la pagina en blanco ni sin forma de reintentar si falla la carga.
 */
async function renderCatalog(container: Element): Promise<void> {
  container.innerHTML = renderLoadingState("Cargando catálogo...");

  try {
    const products = await fetchProducts();
    container.innerHTML = products.map(renderProductCard).join("");
    wireAddToCartDelegation(container);
    initCartView(products);
  } catch {
    container.innerHTML = renderErrorFallback("No se pudo cargar el catálogo. Intenta de nuevo.");
    updateCartBadge();
    requireElement(RETRY_BUTTON_SELECTOR, container).addEventListener(
      "click",
      () => {
        void renderCatalog(container);
      },
      { once: true },
    );
  }
}

export function initCatalogView(): void {
  void renderCatalog(requireElement(PRODUCT_LIST_SELECTOR));
}
