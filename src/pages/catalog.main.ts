import "bootstrap/dist/css/bootstrap.min.css";
import { renderGlobalFallback } from "@/components/GlobalFallback/GlobalFallback";
import { initCatalogView } from "@/views/catalog.view";

/**
 * Extraida a una funcion con nombre (Etapa 7) para poder probar el
 * arranque de la pagina y el fallback global sin depender del timing
 * real de "DOMContentLoaded" en el test.
 */
export function bootstrapCatalogPage(): void {
  try {
    initCatalogView();
  } catch {
    // Fallback global: initCatalogView() solo puede lanzar de forma
    // sincrona si #product-list no existe en el HTML -- un error de
    // markup, no de red. fetchProducts() ya maneja sus propios errores
    // dentro de catalog.view.ts.
    renderGlobalFallback();
  }
}

// Entrypoint de index.html. Reemplaza assets/js/app.js + cart.js +
// products.js para esta pagina (Etapa 4).
document.addEventListener("DOMContentLoaded", bootstrapCatalogPage);
