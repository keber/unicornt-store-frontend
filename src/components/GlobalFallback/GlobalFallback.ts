import { requireElement, requireElementOfType } from "@/lib/dom";
import templateHtml from "./GlobalFallback_template.html?raw";

const RELOAD_BUTTON_SELECTOR = "#btn-global-reload";

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = templateHtml;

function cloneGlobalFallbackTemplate(): HTMLElement {
  const templateRoot = TEMPLATE.content.firstElementChild;
  const clone = templateRoot?.cloneNode(true);

  if (!(clone instanceof HTMLElement)) {
    throw new TypeError("GlobalFallback_template.html debe contener un elemento HTML raíz.");
  }

  return clone;
}

/**
 * Ultima red de seguridad (Etapa 7): si initCatalogView()/initProductView()
 * lanzan de forma sincrona -- p.ej. porque #product-list o #product-content
 * no existen en el HTML, algo que ningun otro fallback de la app cubre
 * porque justamente ellos dependen de que esos contenedores existan --
 * esto reemplaza toda la pagina por un mensaje legible en vez de dejar
 * una pantalla en blanco o un error solo visible en la consola.
 *
 * El template contiene solo markup constante. El mensaje se asigna con
 * textContent, por lo que nunca se interpreta como HTML.
 */
export function renderGlobalFallback(
  message = "Ocurrió un error inesperado. Por favor recarga la página.",
): void {
  const fallback = cloneGlobalFallbackTemplate();

  requireElement(".global-fallback__message", fallback).textContent = message;
  requireElementOfType(RELOAD_BUTTON_SELECTOR, HTMLButtonElement, fallback).addEventListener(
    "click",
    () => {
      window.location.reload();
    },
  );

  document.body.replaceChildren(fallback);
}
