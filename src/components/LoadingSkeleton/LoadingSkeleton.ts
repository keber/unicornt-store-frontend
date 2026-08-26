/**
 * Version minima (Etapa 4): un spinner centrado, igual al placeholder
 * que ya traia product.html a mano. La Etapa 6 la reemplaza por un
 * skeleton real con aria-busy sobre el contenedor.
 */
export function renderLoadingState(message = "Cargando..."): string {
  return `
    <div class="col-12 text-center py-5 text-muted">
      <i class="fa-solid fa-spinner fa-spin fa-2x mb-2 d-block"></i>
      ${message}
    </div>`;
}
