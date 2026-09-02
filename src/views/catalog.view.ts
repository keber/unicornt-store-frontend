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
import { fetchCategories } from "@/services/category.service";
import { fetchProducts } from "@/services/product.service";
import { readCart, writeCart } from "@/storage/cart.storage";
import { initCartView, updateCartBadge } from "@/views/cart.view";

const PRODUCT_LIST_SELECTOR = "#product-list";
const CATEGORY_FILTER_ID = "category-filter";

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
 * Loads and renders the catalog: aria-busy while fetchProducts() is in flight,
 * skeleton -> catalog or a retry fallback, aria-busy removed in the finally
 * regardless of the outcome. `categorySlug` restricts the list to one category.
 */
async function renderCatalog(container: Element, categorySlug?: string): Promise<void> {
  container.setAttribute("aria-busy", "true");
  container.replaceChildren(createLoadingState("Cargando catálogo..."));

  try {
    const products = await fetchProducts(
      categorySlug !== undefined && categorySlug.length > 0 ? { category: categorySlug } : {},
    );
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
        void renderCatalog(container, categorySlug);
      },
      { once: true },
    );
  } finally {
    container.removeAttribute("aria-busy");
  }
}

/**
 * Best-effort category filter: fetches `GET /api/v1/categories` and inserts a
 * <select> above the product list. If the request fails the filter is simply
 * omitted; the catalog itself still renders.
 */
async function renderCategoryFilter(list: Element): Promise<void> {
  if (document.getElementById(CATEGORY_FILTER_ID) !== null) {
    return;
  }
  let categories;
  try {
    categories = await fetchCategories();
  } catch {
    return;
  }

  const select = document.createElement("select");
  select.id = CATEGORY_FILTER_ID;
  select.className = "form-select mb-4";
  select.setAttribute("aria-label", "Filtrar por categoría");

  const all = document.createElement("option");
  all.value = "";
  all.textContent = "Todas las categorías";
  select.append(all);

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category.slug;
    option.textContent = category.name;
    select.append(option);
  }

  select.addEventListener("change", () => {
    void renderCatalog(list, select.value);
  });

  list.parentElement?.insertBefore(select, list);
}

export function initCatalogView(): void {
  const list = requireElement(PRODUCT_LIST_SELECTOR);
  void renderCatalog(list);
  void renderCategoryFilter(list);
}
