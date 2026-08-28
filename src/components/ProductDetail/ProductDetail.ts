import { formatPrice } from "@/lib/currency";
import { requireElement, requireElementOfType } from "@/lib/dom";
import { MAX_QUANTITY, MIN_QUANTITY } from "@/lib/quantity";
import { productImageSrc, type ProductModel } from "@/models/product.model";
import templateHtml from "./ProductDetail_template.html?raw";

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = templateHtml;

function categoryBadgeClass(product: ProductModel): "badge-polera" | "badge-tazon" {
  return product.category === "Polera" ? "badge-polera" : "badge-tazon";
}

function cloneProductDetailTemplate(): DocumentFragment {
  const templateRoot = TEMPLATE.content.cloneNode(true);

  if (!(templateRoot instanceof DocumentFragment)) {
    throw new TypeError("ProductDetail_template.html debe contener un fragmento HTML.");
  }

  return templateRoot;
}

/**
 * Crea un detalle de producto mediante nodos DOM.
 *
 * El template contiene solamente markup constante. Los detalles del producto
 * se asignan con textContent, propiedades y dataset, por lo que nunca se
 * interpretan como HTML.
 */

/** Detalle de producto. Misma estructura/ids que el renderProductDetail() legado. */
export function createProductDetail(product: ProductModel): DocumentFragment {
  const detail = cloneProductDetailTemplate();

  const image = requireElementOfType(".product-detail__img", HTMLImageElement, detail);
  image.src = productImageSrc(product, "detail");
  image.alt = product.name;

  const category = requireElement(".product-detail__category", detail);
  category.classList.add(categoryBadgeClass(product));
  category.textContent = product.category;

  requireElement(".product-detail__name", detail).textContent = product.name;

  requireElement(".product-detail__price", detail).textContent = formatPrice(product.price);

  requireElement(".product-detail__description", detail).textContent = product.description;

  const qtyInput = requireElementOfType("#qty-input", HTMLInputElement, detail);
  qtyInput.min = String(MIN_QUANTITY);
  qtyInput.max = String(MAX_QUANTITY);
  qtyInput.value = String(MIN_QUANTITY);

  return detail;
}
