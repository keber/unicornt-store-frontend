import { formatPrice } from "@/lib/currency";
import { MAX_QUANTITY, MIN_QUANTITY } from "@/lib/quantity";
import { productImageSrc, type ProductModel } from "@/models/product.model";

function categoryBadgeClass(product: ProductModel): "badge-polera" | "badge-tazon" {
  return product.category === "Polera" ? "badge-polera" : "badge-tazon";
}

/** Detalle de producto. Misma estructura/ids que el renderProductDetail() legado. */
export function renderProductDetail(product: ProductModel): string {
  return `
    <div class="col-12 col-md-6">
      <div class="detail-img-wrapper rounded-4 overflow-hidden shadow">
        <img
          src="${productImageSrc(product, "detail")}"
          alt="${product.name}"
          class="img-fluid w-100"
        />
      </div>
    </div>

    <div class="col-12 col-md-6">
      <span class="badge ${categoryBadgeClass(product)} mb-2">${product.category}</span>
      <h1 class="fw-bold fs-3 mb-1">${product.name}</h1>
      <p class="fs-2 fw-bold text-accent mb-3">${formatPrice(product.price)}</p>
      <p class="text-muted mb-4">${product.description}</p>

      <div class="d-flex align-items-center gap-3 mb-4">
        <label class="fw-semibold" for="qty-input">Cantidad:</label>
        <div class="input-group qty-selector">
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="qty-minus"
            aria-label="Reducir cantidad"
          >−</button>
          <input
            type="number"
            id="qty-input"
            class="form-control text-center"
            value="1"
            min="${String(MIN_QUANTITY)}"
            max="${String(MAX_QUANTITY)}"
            aria-label="Cantidad"
            style="max-width: 60px;"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="qty-plus"
            aria-label="Aumentar cantidad"
          >+</button>
        </div>
      </div>

      <div class="d-flex flex-wrap gap-3">
        <button class="btn btn-brand btn-lg flex-grow-1" type="button" id="btn-add-detail">
          <i class="fa-solid fa-cart-plus me-2"></i>Agregar al carrito
        </button>
        <a href="index.html" class="btn btn-outline-brand btn-lg">
          <i class="fa-solid fa-arrow-left me-1"></i>Volver
        </a>
      </div>
    </div>
  `;
}
