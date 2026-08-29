import { requireElement } from "@/lib/dom";
import templateHtml from "./ErrorFallback_template.html?raw";

export const RETRY_BUTTON_SELECTOR = "[data-action='retry']";

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = templateHtml;

function cloneErrorFallbackTemplate(): HTMLElement {
  const templateRoot = TEMPLATE.content.firstElementChild;
  const clone = templateRoot?.cloneNode(true);

  if (!(clone instanceof HTMLElement)) {
    throw new TypeError("ErrorFallback_template.html debe contener un elemento HTML raíz.");
  }

  return clone;
}

/**
 * Crea el fallback de error mediante nodos DOM.
 *
 * El template contiene solamente markup constante. El mensaje se asigna con
 * textContent, por lo que nunca se interpreta como HTML.
 *
 * Quien monta esto le agrega el listener de retry (ver catalog.view.ts /
 * product.view.ts).
 */
export function createErrorFallback(message: string): HTMLElement {
  const fallback = cloneErrorFallbackTemplate();

  requireElement(".error-fallback__message", fallback).textContent = message;

  return fallback;
}
