import { markViteReady } from "@/lib/dom-ready-marker";

// Entrypoint Vite para index.html.
// Etapa 2: solo demuestra que el toolchain (TS estricto, alias @/, build)
// funciona en el navegador junto a assets/js/app.js y assets/js/cart.js.
// La migracion real del catalogo llega en la Etapa 4.
markViteReady();
