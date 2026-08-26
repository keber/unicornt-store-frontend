import "bootstrap/dist/css/bootstrap.min.css";
import { initProductView } from "@/views/product.view";

// Entrypoint de product.html. Reemplaza assets/js/app.js + cart.js +
// products.js para esta pagina (Etapa 4).
document.addEventListener("DOMContentLoaded", () => {
  initProductView();
});
