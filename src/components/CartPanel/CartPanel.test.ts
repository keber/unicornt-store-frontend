import { beforeEach, describe, expect, it } from "vitest";
import { createCartItems } from "@/components/CartPanel/CartPanel";
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

describe("createCartItems", () => {
  it('muestra el mensaje de "carrito vacio" cuando no hay lineas', () => {
    const items = createCartItems([]);
    document.body.replaceChildren(...items);

    expect(items).toHaveLength(1);
    expect(document.body.textContent).toContain("El carrito está vacío.");
  });

  it("renderiza nombre, precio unitario, cantidad y subtotal por linea", () => {
    const items = createCartItems([line]);
    document.body.replaceChildren(...items);

    const item = requireElementOfType(".cart-item", HTMLElement);
    expect(item.textContent).toContain("Polera 'I Can Explain It To You'");
    expect(item.textContent).toContain("$13.990 c/u");
    expect(item.textContent).toContain("$27.980");

    const qtyInput = requireElementOfType(".cart-qty-input", HTMLInputElement);
    expect(qtyInput.value).toBe("2");
    expect(qtyInput.dataset.id).toBe("1");
  });

  it("cada linea trae los botones de +/-/eliminar con el mismo data-id", () => {
    const items = createCartItems([line]);
    document.body.replaceChildren(...items);

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

    const items = createCartItems([line, secondLine]);
    document.body.replaceChildren(...items);

    expect(document.querySelectorAll(".cart-item")).toHaveLength(2);
    expect(document.body.textContent).toContain("Polera 'Cloud Architect'");
  });
});
