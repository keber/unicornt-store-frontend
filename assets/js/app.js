/**
 * app.js - Lógica principal de Unicorn't Store
 *
 * Índice de funciones:
 *   formatPrice(amount)              - Formatea un número como precio CLP
 *   buildCarouselSlot(product, pos)  - Genera el HTML de un slot del carrusel
 *   getFilteredProducts()            - Retorna productos según la categoría activa
 *   renderCategoryFilter()           - Renderiza botones de filtro de subcategoría
 *   renderCarousel()                 - Renderiza el carrusel de 3 items en #product-carousel
 *   initCarousel()                   - Inicializa carrusel, filtros y sus eventos
 *   renderProductDetail()            - Renderiza el detalle de un producto en #product-content
 *   initCartOffcanvas()              - Inicializa eventos del offcanvas del carrito
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

// ── Página Home: carrusel de productos ─────────────────────────────────────

let carouselCurrentIndex = 0;
let carouselCategory = "all";

const SUBCATEGORY_LABELS = {
  pm: "PM",
  cloud: "Cloud",
  devops: "DevOps",
  enigma: "Enigma",
  general: "General",
  "it-crowd": "IT Crowd",
  linux: "Linux",
  personajes: "Personajes",
  programador: "Programador",
  qa: "QA",
};

function getFilteredProducts() {
  if (carouselCategory === "all") return products;
  return products.filter((p) => p.subcategory === carouselCategory);
}

function buildCarouselSlot(product, position) {
  const categoryClass =
    product.category === "Polera" ? "badge-polera" : "badge-tazon";
  const isFocused = position === "center";
  return `
    <div class="carousel-slot carousel-slot--${position}" data-focus="${isFocused ? "active" : "side"}">
      <div class="carousel-card">
        <div class="carousel-card__img-wrapper">
          <img
            src="${product.image}-card.webp"
            alt="${product.name}"
            class="carousel-card__img"
            loading="lazy"
          />
        </div>
        <div class="card-body p-3 d-flex flex-column">
          <span class="badge ${categoryClass} mb-2 align-self-start">${product.category}</span>
          <h3 class="card-title fs-6 fw-bold mb-1 lh-sm">${product.name}</h3>
          <p class="fw-bold fs-5 text-accent mt-2 mb-3">${formatPrice(product.price)}</p>
          <div class="d-flex gap-2 mt-auto">
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
    </div>
  `;
}

function renderCategoryFilter() {
  const container = document.getElementById("category-filter");
  const selectEl = document.getElementById("category-filter-select");
  if (!container) return;
  const categories = [...new Set(products.map((p) => p.subcategory))];
  container.innerHTML = [
    `<button class="carousel-filter-btn${carouselCategory === "all" ? " active" : ""}" data-cat="all">Todos</button>`,
    ...categories.map(
      (cat) =>
        `<button class="carousel-filter-btn${carouselCategory === cat ? " active" : ""}" data-cat="${cat}">${SUBCATEGORY_LABELS[cat] || cat}</button>`
    ),
  ].join("");
  if (selectEl) {
    selectEl.innerHTML = [
      `<option value="all">Todos</option>`,
      ...categories.map(
        (cat) =>
          `<option value="${cat}"${carouselCategory === cat ? " selected" : ""}>${SUBCATEGORY_LABELS[cat] || cat}</option>`
      ),
    ].join("");
    selectEl.value = carouselCategory;
  }
}

function renderCarousel() {
  const container = document.getElementById("product-carousel");
  if (!container) return;
  const filtered = getFilteredProducts();
  const indicatorEl = document.getElementById("carousel-indicator");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");

  if (filtered.length === 0) {
    container.innerHTML =
      '<p class="text-center text-muted w-100 py-5"><i class="fa-solid fa-box-open fa-2x mb-2 d-block"></i>No hay productos en esta categoría.</p>';
    if (indicatorEl) indicatorEl.textContent = "";
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  carouselCurrentIndex = Math.max(
    0,
    Math.min(carouselCurrentIndex, filtered.length - 1)
  );

  const prevProduct =
    carouselCurrentIndex > 0 ? filtered[carouselCurrentIndex - 1] : null;
  const centerProduct = filtered[carouselCurrentIndex];
  const nextProduct =
    carouselCurrentIndex < filtered.length - 1
      ? filtered[carouselCurrentIndex + 1]
      : null;

  container.innerHTML = [
    prevProduct
      ? buildCarouselSlot(prevProduct, "left")
      : '<div class="carousel-slot carousel-slot--empty" aria-hidden="true"></div>',
    buildCarouselSlot(centerProduct, "center"),
    nextProduct
      ? buildCarouselSlot(nextProduct, "right")
      : '<div class="carousel-slot carousel-slot--empty" aria-hidden="true"></div>',
  ].join("");

  if (indicatorEl)
    indicatorEl.textContent = `${carouselCurrentIndex + 1} / ${filtered.length}`;
  if (prevBtn) prevBtn.disabled = carouselCurrentIndex === 0;
  if (nextBtn) nextBtn.disabled = carouselCurrentIndex === filtered.length - 1;

  // Hover: desplaza el foco visual al slot lateral sobre el que se pasa el cursor
  const leftSlot = container.querySelector(".carousel-slot--left");
  const centerSlot = container.querySelector(".carousel-slot--center");
  const rightSlot = container.querySelector(".carousel-slot--right");

  function setFocus(focused) {
    if (focused === "left") {
      leftSlot?.setAttribute("data-focus", "active");
      centerSlot?.setAttribute("data-focus", "passive");
      rightSlot?.setAttribute("data-focus", "passive");
    } else if (focused === "right") {
      leftSlot?.setAttribute("data-focus", "passive");
      centerSlot?.setAttribute("data-focus", "passive");
      rightSlot?.setAttribute("data-focus", "active");
    } else {
      leftSlot?.setAttribute("data-focus", "side");
      centerSlot?.setAttribute("data-focus", "active");
      rightSlot?.setAttribute("data-focus", "side");
    }
  }

  leftSlot?.addEventListener("mouseenter", () => setFocus("left"));
  leftSlot?.addEventListener("mouseleave", () => setFocus("center"));
  rightSlot?.addEventListener("mouseenter", () => setFocus("right"));
  rightSlot?.addEventListener("mouseleave", () => setFocus("center"));
}

function initCarousel() {
  const filterContainer = document.getElementById("category-filter");
  const carouselContainer = document.getElementById("product-carousel");
  if (!filterContainer || !carouselContainer) return;

  renderCategoryFilter();
  renderCarousel();

  // Filtros de categoría (delegado)
  filterContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".carousel-filter-btn");
    if (!btn) return;
    carouselCategory = btn.dataset.cat;
    carouselCurrentIndex = 0;
    renderCategoryFilter();
    renderCarousel();
  });

  // Filtro de categoría: select (móvil)
  document.getElementById("category-filter-select")?.addEventListener("change", (e) => {
    carouselCategory = e.target.value;
    carouselCurrentIndex = 0;
    renderCategoryFilter();
    renderCarousel();
  });

  // Navegación prev / next
  document.getElementById("carousel-prev")?.addEventListener("click", () => {
    if (carouselCurrentIndex > 0) {
      carouselCurrentIndex--;
      renderCarousel();
    }
  });
  document.getElementById("carousel-next")?.addEventListener("click", () => {
    const filtered = getFilteredProducts();
    if (carouselCurrentIndex < filtered.length - 1) {
      carouselCurrentIndex++;
      renderCarousel();
    }
  });

  // Agregar al carrito (delegado)
  carouselContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add-cart");
    if (!btn) return;
    const id = Number.parseInt(btn.dataset.id, 10);
    addToCart(id);
    showCartToast("¡Producto agregado al carrito!");
    btn.innerHTML = '<i class="fa-solid fa-check me-1"></i>Agregado';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-cart-plus me-1"></i>Agregar';
      btn.disabled = false;
    }, 1500);
  });

  // Swipe táctil (móvil)
  let touchStartX = 0;
  carouselContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  carouselContainer.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 50) return;
    const filtered = getFilteredProducts();
    if (dx < 0 && carouselCurrentIndex < filtered.length - 1) {
      carouselCurrentIndex++;
      renderCarousel();
    } else if (dx > 0 && carouselCurrentIndex > 0) {
      carouselCurrentIndex--;
      renderCarousel();
    }
  }, { passive: true });
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
  document.title = `${product.name} - Unicorn't Store`;

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
  if (document.querySelector("#product-carousel")) {
    initCarousel();
  }

  // Detalle
  if (document.querySelector("#product-content")) {
    renderProductDetail();
  }
});
