import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchProducts } = vi.hoisted(() => ({ fetchProducts: vi.fn() }));
vi.mock("@/services/product.service", () => ({ fetchProducts }));

const { bootstrapProductPage } = await import("@/pages/product.main");

beforeEach(() => {
  fetchProducts.mockReset();
  document.body.innerHTML = "";
});

describe("bootstrapProductPage", () => {
  it("arranca correctamente cuando #product-content existe: llega a fetchProducts()", async () => {
    // Se cuelga a proposito (nunca resuelve) solo para observar que la
    // llamada ocurrio sin que la promesa termine de resolverse.
    fetchProducts.mockReturnValueOnce(new Promise(() => undefined));
    document.body.innerHTML = `
      <span id="cart-badge"></span>
      <span id="breadcrumb-name"></span>
      <div id="product-content"></div>
    `;

    bootstrapProductPage();

    await vi.waitFor(() => {
      expect(fetchProducts).toHaveBeenCalledOnce();
    });
    expect(document.body.textContent).not.toContain("Ocurrió un error inesperado");
  });

  it("si fetchProducts() falla, muestra el fallback de la vista (no el global)", async () => {
    fetchProducts.mockRejectedValueOnce(new Error("network down"));
    document.body.innerHTML = `
      <span id="cart-badge"></span>
      <span id="breadcrumb-name"></span>
      <div id="product-content"></div>
    `;

    bootstrapProductPage();

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain("No se pudo cargar el producto");
    });
    expect(document.body.textContent).not.toContain("Ocurrió un error inesperado");
  });

  it("si #product-content no existe en el HTML, muestra el fallback global", () => {
    document.body.innerHTML = "<div>pagina sin el contenedor esperado</div>";

    bootstrapProductPage();

    expect(document.body.textContent).toContain("Ocurrió un error inesperado");
    expect(fetchProducts).not.toHaveBeenCalled();
  });
});
