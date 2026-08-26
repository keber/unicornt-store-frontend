import { Offcanvas } from "bootstrap";
import { showToast } from "@/components/Toast/Toast";

/**
 * Etapa 4: mismo comportamiento observable que el boton "Finalizar
 * compra" legado (simulado, sin red): cierra el offcanvas y muestra el
 * toast de agradecimiento. Vaciar el carrito y refrescar la UI lo hace
 * quien llama (cart.view.ts), porque ese es su estado.
 *
 * La Etapa 5 reemplaza este flujo por un formulario real con
 * preventDefault() + FormData, y la Etapa 6 lo vuelve asincrono de
 * verdad (submitOrder con latencia simulada, try/catch/finally).
 */
export function completeSimulatedCheckout(offcanvasEl: Element): void {
  Offcanvas.getInstance(offcanvasEl)?.hide();
  showToast("¡Gracias por tu compra! Tu pedido está en camino. 🦄");
}
