import "bootstrap/dist/css/bootstrap.min.css";
import { initCatalogView } from "@/views/catalog.view";

// Entrypoint de index.html. Reemplaza assets/js/app.js + cart.js +
// products.js para esta pagina (Etapa 4).
document.addEventListener("DOMContentLoaded", () => {
  initCatalogView();
});
