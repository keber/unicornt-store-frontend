import { formatPrice } from "@/lib/currency";
import { productImageSrc, type ProductModel } from "@/models/product.model";

function categoryBadgeClass(product: ProductModel): "badge-polera" | "badge-tazon" {
  return product.category === "Polera" ? "badge-polera" : "badge-tazon";
}

/** Card de catalogo. Misma estructura/clases que el buildProductCard() legado. */
export function renderProductCard(product: ProductModel): string {
  return `
    <article class="col">
      <div class="card product-card h-100 shadow-sm">
        <div class="product-card__img-wrapper">
          <img
            src="${productImageSrc(product, "card")}"
            alt="${product.name}"
            class="card-img-top product-card__img"
            loading="lazy"
          />
        </div>
        <div class="card-body d-flex flex-column">
          <span class="badge ${categoryBadgeClass(product)} mb-2 align-self-start">
            ${product.category}
          </span>
          <h3 class="card-title fs-6 fw-bold">${product.name}</h3>
          <p class="card-text text-muted small flex-grow-1 product-card__desc">
            ${product.description}
          </p>
          <p class="card-text fw-bold fs-5 text-accent mt-2">
            ${formatPrice(product.price)}
          </p>
          <div class="d-flex gap-2 mt-3">
            <a
              href="product.html?id=${String(product.id)}"
              class="btn btn-outline-brand btn-sm flex-grow-1"
            >
              <i class="fa-solid fa-eye me-1"></i>Ver más
            </a>
            <button
              class="btn btn-brand btn-sm flex-grow-1 btn-add-cart"
              type="button"
              data-id="${String(product.id)}"
            >
              <i class="fa-solid fa-cart-plus me-1"></i>Agregar
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}
