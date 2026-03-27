/**
 * app.js — Lógica principal de Unicorn't Store
 * Iteración 1: renderizado de cards en Home
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Formatea un número como precio en CLP.
 * @param {number} amount
 * @returns {string}  e.g. "$12.990"
 */
function formatPrice(amount) {
  return "$" + amount.toLocaleString("es-CL");
}

// ── Renderizado de cards ──────────────────────────────────────────────────────

/**
 * Genera el HTML de una card de producto.
 * @param {Object} product
 * @returns {string}
 */
function buildProductCard(product) {
  const categoryClass =
    product.category === "Polera" ? "badge-polera" : "badge-tazon";

  return `
    <article class="col">
      <div class="card product-card h-100 shadow-sm">
        <div class="product-card__img-wrapper">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="card-img-top product-card__img"
            loading="lazy"
          />
        </div>
        <div class="card-body d-flex flex-column">
          <span class="badge ${categoryClass} mb-2 align-self-start">
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
              href="product.html?id=${product.id}"
              class="btn btn-outline-brand btn-sm flex-grow-1"
            >
              <i class="fa-solid fa-eye me-1"></i>Ver más
            </a>
            <button
              class="btn btn-brand btn-sm flex-grow-1 btn-add-cart"
              data-id="${product.id}"
            >
              <i class="fa-solid fa-cart-plus me-1"></i>Agregar
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * Renderiza el catálogo completo en #product-list.
 */
function renderProductList() {
  const container = document.querySelector("#product-list");
  if (!container) return;

  container.innerHTML = products.map(buildProductCard).join("");
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Página Home
  if (document.querySelector("#product-list")) {
    renderProductList();
  }
});
