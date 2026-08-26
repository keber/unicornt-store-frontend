import { beforeEach, describe, expect, it } from "vitest";
import { renderProductDetail } from "@/components/ProductDetail/ProductDetail";
import { requireElementOfType } from "@/lib/dom";
import type { ProductModel } from "@/models/product.model";

const product: ProductModel = {
  id: 9,
  name: "Polera 'Enigma Blueprint'",
  category: "Polera",
  subcategory: "enigma",
  price: 15990,
  description: "Plano tecnico de la maquina Enigma.",
  image: "assets/img/enigma/enigma-blue-print",
};

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("renderProductDetail", () => {
  it("renderiza la imagen de detalle (.webp sin sufijo), nombre, precio y descripcion", () => {
    document.body.innerHTML = renderProductDetail(product);

    const img = requireElementOfType("img", HTMLImageElement);
    expect(img.src).toContain("assets/img/enigma/enigma-blue-print.webp");
    expect(img.src).not.toContain("-card.webp");
    expect(img.src).not.toContain("-thumb.webp");
    expect(document.body.textContent).toContain("Polera 'Enigma Blueprint'");
    expect(document.body.textContent).toContain("$15.990");
    expect(document.body.textContent).toContain("Plano tecnico de la maquina Enigma.");
  });

  it("incluye el selector de cantidad con min/max y valor inicial 1", () => {
    document.body.innerHTML = renderProductDetail(product);

    const qtyInput = requireElementOfType("#qty-input", HTMLInputElement);
    expect(qtyInput.value).toBe("1");
    expect(qtyInput.min).toBe("1");
    expect(qtyInput.max).toBe("99");
    expect(() => requireElementOfType("#qty-minus", HTMLButtonElement)).not.toThrow();
    expect(() => requireElementOfType("#qty-plus", HTMLButtonElement)).not.toThrow();
  });

  it('incluye el boton "Agregar al carrito" con el id que espera product.view.ts', () => {
    document.body.innerHTML = renderProductDetail(product);
    expect(() => requireElementOfType("#btn-add-detail", HTMLButtonElement)).not.toThrow();
  });
});
