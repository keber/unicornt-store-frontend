/**
 * cart.js — Lógica del carrito de Unicorn't Store
 * Persiste en localStorage bajo la clave "unicornt_cart"
 * Estructura: Array de { id: number, qty: number }
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
