import { beforeEach, describe, expect, it } from "vitest";
import { renderProductCard } from "@/components/ProductCard/ProductCard";
import { requireElementOfType } from "@/lib/dom";
import type { ProductModel } from "@/models/product.model";

const product: ProductModel = {
  id: 7,
  name: "Polera 'Breaking Prod'",
  category: "Polera",
  subcategory: "devops",
  price: 13990,
  description: "Basada en Breaking Bad.",
  image: "assets/img/devops/breaking-prod",
};

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("renderProductCard", () => {
  it("renderiza la imagen -card.webp, el nombre, el precio y el badge de categoria", () => {
    document.body.innerHTML = renderProductCard(product);

    const img = requireElementOfType("img", HTMLImageElement);
    expect(img.src).toContain("assets/img/devops/breaking-prod-card.webp");
    expect(img.alt).toBe(product.name);
    expect(document.body.textContent).toContain("Polera 'Breaking Prod'");
    expect(document.body.textContent).toContain("$13.990");
    expect(document.body.textContent).toContain("Polera");
  });

  it('el link "Ver mas" apunta a product.html?id={id}', () => {
    document.body.innerHTML = renderProductCard(product);
    const link = requireElementOfType("a", HTMLAnchorElement);
    expect(link.getAttribute("href")).toBe("product.html?id=7");
  });

  it('el boton "Agregar" tiene data-id y la clase de delegacion btn-add-cart', () => {
    document.body.innerHTML = renderProductCard(product);
    const button = requireElementOfType("button", HTMLButtonElement);
    expect(button.dataset.id).toBe("7");
    expect(button.classList.contains("btn-add-cart")).toBe(true);
  });

  it("usa badge-tazon para categoria Tazón", () => {
    document.body.innerHTML = renderProductCard({ ...product, category: "Tazón" });
    const badge = requireElementOfType(".badge", HTMLSpanElement);
    expect(badge.classList.contains("badge-tazon")).toBe(true);
  });
});
