import "bootstrap/dist/css/bootstrap.min.css";
import { renderGlobalFallback } from "@/components/GlobalFallback/GlobalFallback";
import { initProductView } from "@/views/product.view";

/**
 * Extraida a una funcion con nombre (Etapa 7) para poder probar el
 * arranque de la pagina y el fallback global sin depender del timing
 * real de "DOMContentLoaded" en el test.
 */
export function bootstrapProductPage(): void {
  try {
    initProductView();
  } catch {
    // Fallback global: initProductView() solo puede lanzar de forma
    // sincrona si #product-content no existe en el HTML -- un error de
    // markup, no de red. fetchProducts() ya maneja sus propios errores
    // dentro de product.view.ts.
    renderGlobalFallback();
  }
}

// Entrypoint de product.html. Reemplaza assets/js/app.js + cart.js +
// products.js para esta pagina (Etapa 4).
document.addEventListener("DOMContentLoaded", bootstrapProductPage);
