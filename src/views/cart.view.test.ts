import { beforeEach, describe, expect, it } from "vitest";
import { initCartView, updateCartBadge } from "@/views/cart.view";
import { CART_STORAGE_KEY } from "@/storage/cart.storage";
import { requireElement, requireElementOfType } from "@/lib/dom";
import type { ProductModel } from "@/models/product.model";

const products: ProductModel[] = [
  {
    id: 1,
    name: "Polera A",
    category: "Polera",
    subcategory: "devops",
    price: 10000,
    description: "d",
    image: "assets/img/devops/a",
  },
  {
    id: 2,
    name: "Polera B",
    category: "Polera",
    subcategory: "qa",
    price: 5000,
    description: "d",
    image: "assets/img/qa/b",
  },
];

const CART_FIXTURE = `
  <span id="cart-badge"></span>
  <div id="cartOffcanvas">
    <div id="cart-items"></div>
    <div id="cart-footer">
      <span id="cart-total"></span>
      <form id="checkout-form">
        <input id="checkout-fullName" name="fullName" />
        <div class="invalid-feedback" id="checkout-fullName-error"></div>
        <input id="checkout-email" name="email" />
        <div class="invalid-feedback" id="checkout-email-error"></div>
        <input id="checkout-street" name="street" /><div id="checkout-street-error"></div><input id="checkout-city" name="city" /><div id="checkout-city-error"></div><input id="checkout-region" name="region" /><div id="checkout-region-error"></div><input id="checkout-zipCode" name="zipCode" />
        <div class="invalid-feedback" id="checkout-street-error"></div>
        <div id="checkout-submit-error" class="d-none"></div>
        <button type="submit" id="btn-checkout">Finalizar compra</button>
      </form>
      <button type="button" id="btn-clear-cart">Vaciar carrito</button>
    </div>
  </div>
  <div id="cart-toast"><div class="toast-body"><span id="toast-message"></span></div></div>
`;

function readStoredCart(): { id: number; qty: number }[] {
  const raw = localStorage.getItem(CART_STORAGE_KEY);
  return raw === null ? [] : (JSON.parse(raw) as { id: number; qty: number }[]);
}

function openCartOffcanvas(): void {
  requireElement("#cartOffcanvas").dispatchEvent(new Event("show.bs.offcanvas"));
}

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = CART_FIXTURE;
});

describe("updateCartBadge", () => {
  it("muestra la suma de cantidades y oculta el badge si el carrito esta vacio", () => {
    updateCartBadge();
    const badge = requireElementOfType("#cart-badge", HTMLSpanElement);
    expect(badge.textContent).toBe("0");
    expect(badge.style.display).toBe("none");

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([{ id: 1, qty: 3 }]));
    updateCartBadge();
    expect(badge.textContent).toBe("3");
    expect(badge.style.display).toBe("inline-block");
  });
});

describe("initCartView -- render del panel", () => {
  it('con el carrito vacio, muestra "El carrito esta vacio" y oculta el footer', () => {
    initCartView(products);
    openCartOffcanvas();

    expect(requireElement("#cart-items").textContent).toContain("El carrito está vacío.");
    expect(requireElementOfType("#cart-footer", HTMLDivElement).style.display).toBe("none");
  });

  it("con productos en el carrito, renderiza las lineas y el total", () => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([
        { id: 1, qty: 2 },
        { id: 2, qty: 1 },
      ]),
    );

    initCartView(products);
    openCartOffcanvas();

    expect(document.querySelectorAll(".cart-item")).toHaveLength(2);
    expect(requireElement("#cart-total").textContent).toBe("$25.000"); // 10000*2 + 5000
    expect(requireElementOfType("#cart-footer", HTMLDivElement).style.display).toBe("block");
  });
});

describe("initCartView -- delegacion de eventos y cantidades", () => {
  beforeEach(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([{ id: 1, qty: 2 }]));
    initCartView(products);
    openCartOffcanvas();
  });

  it('el boton "+" incrementa la cantidad y persiste el cambio', () => {
    requireElementOfType('.btn-cart-plus[data-id="1"]', HTMLButtonElement).click();

    expect(readStoredCart()).toEqual([{ id: 1, qty: 3 }]);
    expect(requireElementOfType(".cart-qty-input", HTMLInputElement).value).toBe("3");
  });

  it('el boton "-" decrementa la cantidad, y en 0 elimina el item', () => {
    requireElementOfType('.btn-cart-minus[data-id="1"]', HTMLButtonElement).click();
    expect(readStoredCart()).toEqual([{ id: 1, qty: 1 }]);

    requireElementOfType('.btn-cart-minus[data-id="1"]', HTMLButtonElement).click();
    expect(readStoredCart()).toEqual([]);
    expect(requireElement("#cart-items").textContent).toContain("El carrito está vacío.");
  });

  it("editar el input de cantidad a mano actualiza y clampea el carrito", () => {
    const input = requireElementOfType(".cart-qty-input", HTMLInputElement);
    input.value = "500"; // fuera de rango, debe clampear a 99
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(readStoredCart()).toEqual([{ id: 1, qty: 99 }]);
  });

  it('el boton "Eliminar" saca el item del carrito', () => {
    requireElementOfType('.btn-cart-remove[data-id="1"]', HTMLButtonElement).click();
    expect(readStoredCart()).toEqual([]);
  });

  it('"Vaciar carrito" deja el carrito en un array vacio', () => {
    requireElementOfType("#btn-clear-cart", HTMLButtonElement).click();
    expect(readStoredCart()).toEqual([]);
  });
});

describe("initCartView -- formulario de checkout", () => {
  beforeEach(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([{ id: 1, qty: 1 }]));
    initCartView(products);
  });

  it("enviar el formulario vacio no navega (preventDefault) y muestra errores por campo", () => {
    const form = requireElementOfType("#checkout-form", HTMLFormElement);
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    const fullNameInput = requireElementOfType("#checkout-fullName", HTMLInputElement);
    expect(fullNameInput.classList.contains("is-invalid")).toBe(true);
    expect(requireElement("#checkout-fullName-error").textContent).not.toBe("");
    // El carrito no debe haberse tocado: el submit invalido no llega a onSuccess.
    expect(readStoredCart()).toEqual([{ id: 1, qty: 1 }]);
  });
});
