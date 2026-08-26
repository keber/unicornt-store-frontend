import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireElement, requireElementOfType } from "@/lib/dom";
import { CART_STORAGE_KEY } from "@/storage/cart.storage";
import type { ProductModel } from "@/models/product.model";

const { fetchProducts } = vi.hoisted(() => ({ fetchProducts: vi.fn() }));
vi.mock("@/services/product.service", () => ({ fetchProducts }));

const { initCatalogView } = await import("@/views/catalog.view");

const product: ProductModel = {
  id: 1,
  name: "Polera A",
  category: "Polera",
  subcategory: "devops",
  price: 10000,
  description: "d",
  image: "assets/img/devops/a",
};

const PAGE_FIXTURE = `
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
        <button type="submit" id="btn-checkout">Finalizar compra</button>
      </form>
      <button type="button" id="btn-clear-cart">Vaciar carrito</button>
    </div>
  </div>
  <div id="cart-toast"><div class="toast-body"><span id="toast-message"></span></div></div>
  <div id="product-list"></div>
`;

beforeEach(() => {
  fetchProducts.mockReset();
  localStorage.clear();
  document.body.innerHTML = PAGE_FIXTURE;
});

describe("initCatalogView -- skeleton y aria-busy", () => {
  it('pone aria-busy="true" y el skeleton mientras fetchProducts esta en vuelo, y lo retira al terminar', async () => {
    let resolveFetch: (products: ProductModel[]) => void = () => undefined;
    fetchProducts.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );

    initCatalogView();

    const container = requireElement("#product-list");
    expect(container.getAttribute("aria-busy")).toBe("true");
    expect(container.textContent).toContain("Cargando");

    resolveFetch([product]);
    await vi.waitFor(() => {
      expect(container.getAttribute("aria-busy")).toBeNull();
    });
  });
});

describe("initCatalogView -- render y delegacion de agregar al carrito", () => {
  it("renderiza la card del producto y agregarlo actualiza carrito, badge y toast", async () => {
    fetchProducts.mockResolvedValueOnce([product]);

    initCatalogView();

    await vi.waitFor(() => {
      expect(document.querySelector(".btn-add-cart")).not.toBeNull();
    });

    requireElementOfType(".btn-add-cart", HTMLButtonElement).click();

    expect(localStorage.getItem(CART_STORAGE_KEY)).toBe(JSON.stringify([{ id: 1, qty: 1 }]));
    expect(requireElementOfType("#cart-badge", HTMLSpanElement).textContent).toBe("1");
    expect(requireElement("#toast-message").textContent).toContain("agregado al carrito");
  });

  it('el boton muestra feedback temporal ("Agregado") y luego vuelve a su estado original', async () => {
    fetchProducts.mockResolvedValueOnce([product]);

    initCatalogView();
    await vi.waitFor(() => {
      expect(document.querySelector(".btn-add-cart")).not.toBeNull();
    });

    // Fake timers recien despues del waitFor: el click y el timeout de
    // flashButtonFeedback son sincronos desde aqui, no necesitan mas
    // polling con temporizadores reales.
    vi.useFakeTimers();
    const button = requireElementOfType(".btn-add-cart", HTMLButtonElement);
    const originalHtml = button.innerHTML;
    button.click();

    expect(button.disabled).toBe(true);
    expect(button.innerHTML).toContain("Agregado");

    vi.advanceTimersByTime(1500);
    expect(button.disabled).toBe(false);
    expect(button.innerHTML).toBe(originalHtml);

    vi.useRealTimers();
  });
});

describe("initCatalogView -- fallback y reintentar", () => {
  it("si fetchProducts falla, muestra el fallback y Reintentar vuelve a llamarlo", async () => {
    fetchProducts.mockRejectedValueOnce(new Error("network down"));

    initCatalogView();

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain("No se pudo cargar el catálogo");
    });
    // aria-busy se retira igual en el camino de error.
    expect(requireElement("#product-list").getAttribute("aria-busy")).toBeNull();

    fetchProducts.mockResolvedValueOnce([product]);
    requireElementOfType("[data-action='retry']", HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(document.querySelector(".btn-add-cart")).not.toBeNull();
    });
    expect(fetchProducts).toHaveBeenCalledTimes(2);
  });
});
