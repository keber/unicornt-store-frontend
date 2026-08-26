/**
 * Spinner centrado, igual al placeholder que ya traia product.html a
 * mano. El aria-busy="true" no vive aqui: lo pone el contenedor padre
 * (ver catalog.view.ts / product.view.ts, Etapa 6), tanto en el HTML
 * inicial como mientras esta funcion esta montada.
 */
export function renderLoadingState(message = "Cargando..."): string {
  return `
    <div class="col-12 text-center py-5 text-muted">
      <i class="fa-solid fa-spinner fa-spin fa-2x mb-2 d-block"></i>
      ${message}
    </div>`;
}
