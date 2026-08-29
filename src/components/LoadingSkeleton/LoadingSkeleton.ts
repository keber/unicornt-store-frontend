import { requireElement } from "@/lib/dom";
import templateHtml from "./LoadingSkeleton_template.html?raw";

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = templateHtml;

function cloneLoadingSkeletonTemplate(): HTMLElement {
  const templateRoot = TEMPLATE.content.firstElementChild;
  const clone = templateRoot?.cloneNode(true);

  if (!(clone instanceof HTMLElement)) {
    throw new TypeError("LoadingSkeleton_template.html debe contener un elemento HTML raíz.");
  }

  return clone;
}

/**
 * Spinner centrado, igual al placeholder que ya traia product.html a
 * mano. El aria-busy="true" no vive aqui: lo pone el contenedor padre
 * (ver catalog.view.ts / product.view.ts, Etapa 6), tanto en el HTML
 * inicial como mientras esta funcion esta montada.
 *
 * El template contiene solo markup constante. El mensaje se asigna con
 * textContent, por lo que nunca se interpreta como HTML.
 */
export function createLoadingState(message = "Cargando..."): HTMLElement {
  const skeleton = cloneLoadingSkeletonTemplate();

  requireElement(".loading-skeleton__message", skeleton).textContent = message;

  return skeleton;
}
