/**
 * app.js — Lógica principal de Unicorn't Store
 *
 * Índice de funciones:
 *   formatPrice(amount)          — Formatea un número como precio CLP
 *   buildProductCard(product)    — Genera el HTML de una card de producto
 *   renderProductList()          — Renderiza la grilla de cards en #product-list (Home)
 *   renderProductDetail()        — Renderiza el detalle de un producto en #product-content
 *   initCartOffcanvas()          — Inicializa eventos del offcanvas del carrito
 *
 * Punto de entrada: DOMContentLoaded al final del archivo.
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

// ── Página Home: renderizado de cards ────────────────────────────────────────

function buildProductCard(product) {
  const categoryClass =
    product.category === "Polera" ? "badge-polera" : "badge-tazon";

  return `
    <article class="col">
      <div class="card product-card h-100 shadow-sm">
        <div class="product-card__img-wrapper">
          <img
            src="${product.image + '-card.webp'}"
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

function renderProductList() {
  const container = document.querySelector("#product-list");
  if (!container) return;
  container.innerHTML = products.map(buildProductCard).join("");

  // Evento delegado: botones "Agregar" en las cards
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add-cart");
    if (!btn) return;
    const id = parseInt(btn.dataset.id, 10);
    addToCart(id);
    showCartToast("¡Producto agregado al carrito!");
    // Feedback visual breve en el botón
    btn.innerHTML = '<i class="fa-solid fa-check me-1"></i>Agregado';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-cart-plus me-1"></i>Agregar';
      btn.disabled = false;
    }, 1500);
  });
}

// ── Página Detalle: renderizado del producto ──────────────────────────────────

function renderProductDetail() {
  const container = document.querySelector("#product-content");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);
  const product = products.find((p) => p.id === id);

  if (!product) {
    window.location.href = "index.html";
    return;
  }

  // Actualizar breadcrumb
  const breadcrumb = document.getElementById("breadcrumb-name");
  if (breadcrumb) breadcrumb.textContent = product.name;

  // Actualizar título de la página
  document.title = `${product.name} — Unicorn't Store`;

  const categoryClass =
    product.category === "Polera" ? "badge-polera" : "badge-tazon";

  container.innerHTML = `
    <!-- Imagen -->
    <div class="col-12 col-md-6">
      <div class="detail-img-wrapper rounded-4 overflow-hidden shadow">
        <img
          src="${product.image + '.webp'}"
          alt="${product.name}"
          class="img-fluid w-100"
        />
      </div>
    </div>

    <!-- Info -->
    <div class="col-12 col-md-6">
      <span class="badge ${categoryClass} mb-2">${product.category}</span>
      <h1 class="fw-bold fs-3 mb-1">${product.name}</h1>
      <p class="fs-2 fw-bold text-accent mb-3">${formatPrice(product.price)}</p>
      <p class="text-muted mb-4">${product.description}</p>

      <!-- Selector de cantidad -->
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
            min="1"
            max="99"
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

      <!-- Botones de acción -->
      <div class="d-flex flex-wrap gap-3">
        <button
          class="btn btn-brand btn-lg flex-grow-1"
          id="btn-add-detail"
        >
          <i class="fa-solid fa-cart-plus me-2"></i>Agregar al carrito
        </button>
        <a href="index.html" class="btn btn-outline-brand btn-lg">
          <i class="fa-solid fa-arrow-left me-1"></i>Volver
        </a>
      </div>
    </div>
  `;

  // Controles de cantidad
  const qtyInput = document.getElementById("qty-input");
  document.getElementById("qty-minus").addEventListener("click", () => {
    if (qtyInput.value > 1) qtyInput.value = parseInt(qtyInput.value, 10) - 1;
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    if (qtyInput.value < 99) qtyInput.value = parseInt(qtyInput.value, 10) + 1;
  });

  // Botón Agregar al carrito
  document.getElementById("btn-add-detail").addEventListener("click", (e) => {
    const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    addToCart(product.id, qty);
    showCartToast(`¡${product.name} agregado al carrito!`);
    const btn = e.currentTarget;
    btn.innerHTML = '<i class="fa-solid fa-check me-2"></i>¡Agregado!';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-cart-plus me-2"></i>Agregar al carrito';
      btn.disabled = false;
    }, 1800);
  });
}

// ── Offcanvas carrito: eventos delegados ──────────────────────────────────────

/**
 * Inicializa el offcanvas del carrito:
 * - Renderiza al abrirse
 * - Delegación de eventos para +/−, cambio de qty, eliminar, vaciar, checkout
 */
function initCartOffcanvas() {
  const offcanvasEl = document.getElementById("cartOffcanvas");
  if (!offcanvasEl) return;

  // Re-renderizar cada vez que se abre el offcanvas
  offcanvasEl.addEventListener("show.bs.offcanvas", () => {
    renderCart(products);
  });

  // Delegación de eventos sobre #cart-items
  const cartItemsEl = document.getElementById("cart-items");
  if (cartItemsEl) {
    cartItemsEl.addEventListener("click", (e) => {
      const id = parseInt(e.target.closest("[data-id]")?.dataset.id, 10);
      if (!id) return;

      if (e.target.closest(".btn-cart-remove")) {
        removeFromCart(id);
        renderCart(products);
        return;
      }
      if (e.target.closest(".btn-cart-minus")) {
        const input = cartItemsEl.querySelector(`.cart-qty-input[data-id="${id}"]`);
        const newQty = parseInt(input.value, 10) - 1;
        setCartItemQty(id, newQty);
        renderCart(products);
        return;
      }
      if (e.target.closest(".btn-cart-plus")) {
        const input = cartItemsEl.querySelector(`.cart-qty-input[data-id="${id}"]`);
        const newQty = Math.min(99, parseInt(input.value, 10) + 1);
        setCartItemQty(id, newQty);
        renderCart(products);
        return;
      }
    });

    // Cambio manual del input de cantidad
    cartItemsEl.addEventListener("change", (e) => {
      if (!e.target.classList.contains("cart-qty-input")) return;
      const id = parseInt(e.target.dataset.id, 10);
      const qty = Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1));
      setCartItemQty(id, qty);
      renderCart(products);
    });
  }

  // Vaciar carrito
  const btnClear = document.getElementById("btn-clear-cart");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      clearCart();
      renderCart(products);
    });
  }

  // Finalizar compra (simulado)
  const btnCheckout = document.getElementById("btn-checkout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      clearCart();
      renderCart(products);
      // Cerrar el offcanvas
      bootstrap.Offcanvas.getInstance(offcanvasEl)?.hide();
      showCartToast("¡Gracias por tu compra! Tu pedido está en camino. 🦄");
    });
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Sincronizar badge en todas las páginas
  updateCartBadge();

  // Offcanvas del carrito (presente en todas las páginas)
  initCartOffcanvas();

  // Home
  if (document.querySelector("#product-list")) {
    renderProductList();
  }

  // Detalle
  if (document.querySelector("#product-content")) {
    renderProductDetail();
  }
});
