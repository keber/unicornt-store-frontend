import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchProducts } = vi.hoisted(() => ({ fetchProducts: vi.fn() }));
vi.mock("@/services/product.service", () => ({ fetchProducts }));

const { bootstrapCatalogPage } = await import("@/pages/catalog.main");

const CART_FIXTURE = `
  <span id="cart-badge"></span>
  <div id="cartOffcanvas">
    <div id="cart-items"></div>
    <div id="cart-footer">
      <span id="cart-total"></span>
      <form id="checkout-form">
        <input id="checkout-fullName" name="fullName" />
        <div id="checkout-fullName-error"></div>
        <input id="checkout-email" name="email" />
        <div id="checkout-email-error"></div>
        <input id="checkout-address" name="address" />
        <div id="checkout-address-error"></div>
        <div id="checkout-submit-error" class="d-none"></div>
        <button type="submit" id="btn-checkout"></button>
      </form>
      <button type="button" id="btn-clear-cart"></button>
    </div>
  </div>
  <div id="cart-toast"><div class="toast-body"><span id="toast-message"></span></div></div>
`;

beforeEach(() => {
  fetchProducts.mockReset();
  document.body.innerHTML = "";
});

describe("bootstrapCatalogPage", () => {
  it("arranca correctamente cuando #product-list existe: llega a fetchProducts()", async () => {
    fetchProducts.mockResolvedValueOnce([]);
    document.body.innerHTML = `${CART_FIXTURE}<div id="product-list"></div>`;

    bootstrapCatalogPage();

    await vi.waitFor(() => {
      expect(fetchProducts).toHaveBeenCalledOnce();
    });
    // No debe haber caido en el fallback global.
    expect(document.body.textContent).not.toContain("Ocurrió un error inesperado");
  });

  it("si fetchProducts() falla, muestra el fallback de la vista (no el global)", async () => {
    fetchProducts.mockRejectedValueOnce(new Error("network down"));
    document.body.innerHTML = `<span id="cart-badge"></span><div id="product-list"></div>`;

    bootstrapCatalogPage();

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain("No se pudo cargar el catálogo");
    });
    expect(document.body.textContent).not.toContain("Ocurrió un error inesperado");
  });

  it("si #product-list no existe en el HTML, muestra el fallback global", () => {
    document.body.innerHTML = "<div>pagina sin el contenedor esperado</div>";

    bootstrapCatalogPage();

    expect(document.body.textContent).toContain("Ocurrió un error inesperado");
    expect(fetchProducts).not.toHaveBeenCalled();
  });
});
