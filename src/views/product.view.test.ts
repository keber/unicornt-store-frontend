import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requireElement, requireElementOfType } from "@/lib/dom";
import { CART_STORAGE_KEY } from "@/storage/cart.storage";
import type { ProductModel } from "@/models/product.model";

const { fetchProducts } = vi.hoisted(() => ({ fetchProducts: vi.fn() }));
vi.mock("@/services/product.service", () => ({ fetchProducts }));

const { initProductView } = await import("@/views/product.view");

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
  <span id="breadcrumb-name"></span>
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
  <div id="product-content"></div>
`;

beforeEach(() => {
  fetchProducts.mockReset();
  localStorage.clear();
  document.body.innerHTML = PAGE_FIXTURE;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("initProductView -- render y cantidad", () => {
  it("con un id valido, renderiza el detalle, el breadcrumb y el titulo", async () => {
    vi.stubGlobal("location", { href: "", search: "?id=1" });
    fetchProducts.mockResolvedValueOnce([product]);

    initProductView();

    await vi.waitFor(() => {
      expect(document.getElementById("qty-input")).not.toBeNull();
    });
    expect(requireElement("#breadcrumb-name").textContent).toBe(product.name);
    expect(document.title).toContain(product.name);
  });

  it("los botones +/- respetan el rango [1, 99] del selector de cantidad", async () => {
    vi.stubGlobal("location", { href: "", search: "?id=1" });
    fetchProducts.mockResolvedValueOnce([product]);
    initProductView();
    await vi.waitFor(() => {
      expect(document.getElementById("qty-input")).not.toBeNull();
    });

    const qtyInput = requireElementOfType("#qty-input", HTMLInputElement);
    const qtyMinus = requireElementOfType("#qty-minus", HTMLButtonElement);
    const qtyPlus = requireElementOfType("#qty-plus", HTMLButtonElement);

    qtyMinus.click(); // ya esta en 1, no debe bajar de MIN_QUANTITY
    expect(qtyInput.value).toBe("1");

    for (let i = 0; i < 100; i += 1) {
      qtyPlus.click();
    }
    expect(qtyInput.value).toBe("99");
  });

  it('"Agregar al carrito" usa la cantidad seleccionada', async () => {
    vi.stubGlobal("location", { href: "", search: "?id=1" });
    fetchProducts.mockResolvedValueOnce([product]);
    initProductView();
    await vi.waitFor(() => {
      expect(document.getElementById("qty-input")).not.toBeNull();
    });

    requireElementOfType("#qty-plus", HTMLButtonElement).click();
    requireElementOfType("#qty-plus", HTMLButtonElement).click();
    requireElementOfType("#btn-add-detail", HTMLButtonElement).click();

    expect(localStorage.getItem(CART_STORAGE_KEY)).toBe(JSON.stringify([{ id: 1, qty: 3 }]));
    expect(requireElementOfType("#cart-badge", HTMLSpanElement).textContent).toBe("3");
  });
});

describe("initProductView -- id invalido", () => {
  it("redirige a index.html si el id no existe en el catalogo", async () => {
    vi.stubGlobal("location", { href: "", search: "?id=9999" });
    fetchProducts.mockResolvedValueOnce([product]);

    initProductView();

    await vi.waitFor(() => {
      expect(window.location.href).toBe("index.html");
    });
  });

  it("redirige a index.html si no viene id en la URL", async () => {
    vi.stubGlobal("location", { href: "", search: "" });
    fetchProducts.mockResolvedValueOnce([product]);

    initProductView();

    await vi.waitFor(() => {
      expect(window.location.href).toBe("index.html");
    });
  });
});

describe("initProductView -- skeleton, aria-busy y fallback", () => {
  it('pone aria-busy="true" mientras carga y lo retira al terminar', async () => {
    vi.stubGlobal("location", { href: "", search: "?id=1" });
    let resolveFetch: (products: ProductModel[]) => void = () => undefined;
    fetchProducts.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );

    initProductView();
    const container = requireElement("#product-content");
    expect(container.getAttribute("aria-busy")).toBe("true");

    resolveFetch([product]);
    await vi.waitFor(() => {
      expect(container.getAttribute("aria-busy")).toBeNull();
    });
  });

  it("si fetchProducts falla, muestra el fallback y Reintentar vuelve a llamarlo", async () => {
    vi.stubGlobal("location", { href: "", search: "?id=1" });
    fetchProducts.mockRejectedValueOnce(new Error("network down"));

    initProductView();

    await vi.waitFor(() => {
      expect(document.body.textContent).toContain("No se pudo cargar el producto");
    });

    fetchProducts.mockResolvedValueOnce([product]);
    requireElementOfType("[data-action='retry']", HTMLButtonElement).click();

    await vi.waitFor(() => {
      expect(document.getElementById("qty-input")).not.toBeNull();
    });
    expect(fetchProducts).toHaveBeenCalledTimes(2);
  });
});
