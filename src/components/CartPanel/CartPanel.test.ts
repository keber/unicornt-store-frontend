import { beforeEach, describe, expect, it } from "vitest";
import { renderCartItemsHtml } from "@/components/CartPanel/CartPanel";
import { requireElementOfType } from "@/lib/dom";
import type { CartLine } from "@/services/cart.service";

const line: CartLine = {
  item: { id: 1, qty: 2 },
  product: {
    id: 1,
    name: "Polera 'I Can Explain It To You'",
    category: "Polera",
    subcategory: "pm",
    price: 13990,
    description: "d",
    image: "assets/img/pm/i-can-explain-it-to-you",
  },
  subtotal: 27980,
};

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("renderCartItemsHtml", () => {
  it('muestra el mensaje de "carrito vacio" cuando no hay lineas', () => {
    document.body.innerHTML = renderCartItemsHtml([]);
    expect(document.body.textContent).toContain("El carrito está vacío.");
  });

  it("renderiza nombre, precio unitario, cantidad y subtotal por linea", () => {
    document.body.innerHTML = renderCartItemsHtml([line]);

    expect(document.body.textContent).toContain("Polera 'I Can Explain It To You'");
    expect(document.body.textContent).toContain("$13.990 c/u");
    expect(document.body.textContent).toContain("$27.980");

    const qtyInput = requireElementOfType(".cart-qty-input", HTMLInputElement);
    expect(qtyInput.value).toBe("2");
    expect(qtyInput.dataset.id).toBe("1");
  });

  it("cada linea trae los botones de +/-/eliminar con el mismo data-id", () => {
    document.body.innerHTML = renderCartItemsHtml([line]);

    const minus = requireElementOfType(".btn-cart-minus", HTMLButtonElement);
    const plus = requireElementOfType(".btn-cart-plus", HTMLButtonElement);
    const remove = requireElementOfType(".btn-cart-remove", HTMLButtonElement);

    expect(minus.dataset.id).toBe("1");
    expect(plus.dataset.id).toBe("1");
    expect(remove.dataset.id).toBe("1");
  });

  it("renderiza varias lineas cuando hay mas de un producto en el carrito", () => {
    const secondLine: CartLine = {
      item: { id: 2, qty: 1 },
      product: { ...line.product, id: 2, name: "Polera 'Cloud Architect'" },
      subtotal: 14990,
    };

    document.body.innerHTML = renderCartItemsHtml([line, secondLine]);

    expect(document.querySelectorAll(".cart-item")).toHaveLength(2);
    expect(document.body.textContent).toContain("Polera 'Cloud Architect'");
  });
});
