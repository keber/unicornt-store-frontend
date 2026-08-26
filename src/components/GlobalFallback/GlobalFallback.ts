import { queryElement } from "@/lib/dom";

const RELOAD_BUTTON_SELECTOR = "#btn-global-reload";

/**
 * Ultima red de seguridad (Etapa 7): si initCatalogView()/initProductView()
 * lanzan de forma sincrona -- p.ej. porque #product-list o #product-content
 * no existen en el HTML, algo que ningun otro fallback de la app cubre
 * porque justamente ellos dependen de que esos contenedores existan --
 * esto reemplaza toda la pagina por un mensaje legible en vez de dejar
 * una pantalla en blanco o un error solo visible en la consola.
 */
export function renderGlobalFallback(
  message = "Ocurrió un error inesperado. Por favor recarga la página.",
): void {
  document.body.innerHTML = `
    <div
      class="d-flex flex-column align-items-center justify-content-center text-center p-5"
      style="min-height: 100vh;"
      role="alert"
    >
      <i class="fa-solid fa-triangle-exclamation fa-3x text-danger mb-3" aria-hidden="true"></i>
      <p class="text-muted mb-3">${message}</p>
      <button type="button" class="btn btn-brand" id="btn-global-reload">Recargar</button>
    </div>
  `;
  queryElement(RELOAD_BUTTON_SELECTOR)?.addEventListener("click", () => {
    window.location.reload();
  });
}
