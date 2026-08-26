/**
 * Helper minimo para verificar, en la Etapa 2, que el pipeline de Vite +
 * TypeScript estricto compila, se bundlea y corre en el navegador junto
 * al JavaScript legado (assets/js/*.js) sin interferir con el.
 *
 * No forma parte de la logica de negocio: se retira cuando la migracion
 * real del catalogo (Etapa 4) reemplace este entrypoint.
 */
export function markViteReady(root: HTMLElement = document.documentElement): void {
  root.dataset.viteReady = "true";
}
