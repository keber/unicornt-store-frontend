export const RETRY_BUTTON_SELECTOR = "[data-action='retry']";

/** Fallback visual con opcion de reintentar (Etapa 6 le agrega el resto del manejo de asincronia). */
export function renderErrorFallback(message: string): string {
  return `
    <div class="col-12 text-center py-5">
      <i class="fa-solid fa-triangle-exclamation fa-2x text-danger mb-3 d-block"></i>
      <p class="text-muted mb-3">${message}</p>
      <button type="button" class="btn btn-outline-brand" data-action="retry">
        <i class="fa-solid fa-rotate-right me-1"></i>Reintentar
      </button>
    </div>`;
}
