import { requireElement, requireElementOfType } from "@/lib/dom";
import { formatPrice } from "@/lib/currency";
import { productImageSrc, type ProductModel } from "@/models/product.model";

import templateHtml from "./ProductCard_template.html?raw";

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = templateHtml;

function categoryBadgeClass(product: ProductModel): "badge-polera" | "badge-tazon" {
  return product.category === "Polera" ? "badge-polera" : "badge-tazon";
}

function cloneProductCardTemplate(): HTMLElement {
  const templateRoot = TEMPLATE.content.firstElementChild;
  const clone = templateRoot?.cloneNode(true);

  if (!(clone instanceof HTMLElement)) {
    throw new TypeError("ProductCard_template.html debe contener un elemento HTML raíz.");
  }

  return clone;
}

/**
 * Crea una tarjeta mediante nodos DOM.
 *
 * El template contiene solamente markup constante. Los datos del producto
 * se asignan con textContent, propiedades y dataset, por lo que nunca se
 * interpretan como HTML.
 */
export function createProductCardElement(product: ProductModel): HTMLElement {
  const card = cloneProductCardTemplate();

  const image = requireElementOfType(".product-card__img", HTMLImageElement, card);
  image.src = productImageSrc(product, "card");
  image.alt = product.name;

  const category = requireElement(".product-card__category", card);
  category.classList.add(categoryBadgeClass(product));
  category.textContent = product.category;

  requireElement(".product-card__name", card).textContent = product.name;

  requireElement(".product-card__description", card).textContent = product.description;

  requireElement(".product-card__price", card).textContent = formatPrice(product.price);

  const detailLink = requireElementOfType(".product-card__detail-link", HTMLAnchorElement, card);
  detailLink.href = `product.html?id=${encodeURIComponent(String(product.id))}`;

  const addButton = requireElementOfType(".btn-add-cart", HTMLButtonElement, card);
  addButton.dataset.id = String(product.id);

  return card;
}
