/**
 * cart.js - Lógica del carrito de Unicorn't Store
 * Persiste en localStorage bajo la clave "unicornt_cart"
 * Estructura: Array de { id: number, qty: number }
 *
 * Índice de funciones:
 *   getCart()                    - Lee el carrito desde localStorage
 *   saveCart(cart)               - Guarda el carrito en localStorage
 *   addToCart(productId, qty)    - Agrega o incrementa un ítem
 *   removeFromCart(productId)    - Elimina un ítem del carrito
 *   clearCart()                  - Vacía el carrito
 *   getCartCount()               - Retorna la suma total de unidades
 *   updateCartBadge()            - Actualiza el badge del navbar
 *   showCartToast(message)       - Muestra el toast de confirmación
 *   getCartTotal(productsArr)    - Calcula el total en pesos
 *   setCartItemQty(id, qty)      - Cambia la cantidad de un ítem
 *   renderCart(productsArr)      - Renderiza el offcanvas del carrito
 */

const CART_KEY = "unicornt_cart";

// ── Persistencia ─────────────────────────────────────────────────────────────

/**
 * Lee el carrito desde localStorage.
 * @returns {Array<{id: number, qty: number}>}
 */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Guarda el carrito en localStorage.
 * @param {Array<{id: number, qty: number}>} cart
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ── Operaciones ───────────────────────────────────────────────────────────────

/**
 * Agrega un producto al carrito (o incrementa su cantidad).
 * @param {number} productId
 * @param {number} [qty=1]
 */
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  updateCartBadge();
}

/**
 * Elimina completamente un producto del carrito.
 * @param {number} productId
 */
function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

/**
 * Vacía el carrito.
 */
function clearCart() {
  saveCart([]);
  updateCartBadge();
}

/**
 * Devuelve la cantidad total de ítems (suma de qty).
 * @returns {number}
 */
function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// ── UI ────────────────────────────────────────────────────────────────────────

/**
 * Actualiza el badge del navbar con el total de ítems.
 */
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-block" : "none";
}

/**
 * Muestra el Bootstrap Toast de feedback.
 * @param {string} [message]
 */
function showCartToast(message = "Producto agregado al carrito.") {
  const toastEl = document.getElementById("cart-toast");
  if (!toastEl) return;
  const msgEl = document.getElementById("toast-message");
  if (msgEl) msgEl.textContent = message;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 });
  toast.show();
}

/**
 * Calcula el total del carrito en pesos.
 * @param {Array} productsArr  - array global de productos
 * @returns {number}
 */
function getCartTotal(productsArr) {
  return getCart().reduce((sum, item) => {
    const product = productsArr.find((p) => p.id === item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

/**
 * Cambia la cantidad de un ítem. Si qty <= 0, elimina el ítem.
 * @param {number} productId
 * @param {number} qty
 */
function setCartItemQty(productId, qty) {
  if (qty <= 0) {
    removeFromCart(productId);
    return;
  }
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) item.qty = qty;
  saveCart(cart);
  updateCartBadge();
}

/**
 * Renderiza el contenido del offcanvas del carrito.
 * @param {Array} productsArr  - array global de productos
 */
function renderCart(productsArr) {
  const container = document.getElementById("cart-items");
  const footerEl = document.getElementById("cart-footer");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <p class="text-muted text-center py-5">
        <i class="fa-solid fa-box-open fa-2x mb-2 d-block"></i>
        El carrito está vacío.
      </p>`;
    if (footerEl) footerEl.style.display = "none";
    return;
  }

  if (footerEl) footerEl.style.display = "block";

  container.innerHTML = cart
    .map((item) => {
      const product = productsArr.find((p) => p.id === item.id);
      if (!product) return "";
      const subtotal = product.price * item.qty;
      return `
      <div class="cart-item d-flex gap-3 align-items-start py-3 border-bottom" data-id="${product.id}">
        <img
          src="${product.image}-thumb.webp"
          alt="${product.name}"
          class="cart-item__img rounded-2 flex-shrink-0"
          width="72" height="72"
        />
        <div class="flex-grow-1 min-w-0">
          <p class="mb-1 fw-semibold small lh-sm">${product.name}</p>
          <p class="mb-2 text-muted small">${formatPrice(product.price)} c/u</p>
          <div class="d-flex align-items-center gap-2">
            <div class="input-group input-group-sm qty-selector" style="width:96px">
              <button class="btn btn-outline-secondary btn-cart-minus" type="button" data-id="${product.id}" aria-label="Reducir">−</button>
              <input
                type="number"
                class="form-control text-center cart-qty-input"
                value="${item.qty}"
                min="1" max="99"
                data-id="${product.id}"
                aria-label="Cantidad"
              />
              <button class="btn btn-outline-secondary btn-cart-plus" type="button" data-id="${product.id}" aria-label="Aumentar">+</button>
            </div>
            <button class="btn btn-sm btn-outline-danger btn-cart-remove ms-auto" data-id="${product.id}" aria-label="Eliminar">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
        <p class="mb-0 fw-bold text-accent small flex-shrink-0">${formatPrice(subtotal)}</p>
      </div>`;
    })
    .join("");

  // Actualizar total en el footer
  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.textContent = formatPrice(getCartTotal(productsArr));
}
