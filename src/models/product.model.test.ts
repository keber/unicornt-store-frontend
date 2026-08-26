import { describe, expect, it } from "vitest";
import type { ProductDto } from "@/models/product.dto";
import {
  isProductCategory,
  isProductSubcategory,
  productImageSrc,
  toProductModel,
  type ProductModel,
} from "@/models/product.model";

const dto: ProductDto = {
  id: 7,
  name: "Polera 'Breaking Prod'",
  category: "Polera",
  subcategory: "devops",
  price: 13990,
  description: "Basada en Breaking Bad.",
  image: "assets/img/devops/breaking-prod",
};

describe("isProductCategory / isProductSubcategory", () => {
  it("aceptan valores del vocabulario cerrado", () => {
    expect(isProductCategory("Polera")).toBe(true);
    expect(isProductCategory("Tazón")).toBe(true);
    expect(isProductSubcategory("devops")).toBe(true);
  });

  it("rechazan cualquier otro string", () => {
    expect(isProductCategory("polera")).toBe(false); // sensible a mayusculas
    expect(isProductSubcategory("Devops")).toBe(false);
    expect(isProductSubcategory("")).toBe(false);
  });
});

describe("toProductModel", () => {
  it("mapea todos los campos del DTO al modelo", () => {
    const model: ProductModel = toProductModel(dto);
    expect(model).toEqual({
      id: 7,
      name: "Polera 'Breaking Prod'",
      category: "Polera",
      subcategory: "devops",
      price: 13990,
      description: "Basada en Breaking Bad.",
      image: "assets/img/devops/breaking-prod",
    });
  });
});

describe("productImageSrc", () => {
  const model = toProductModel(dto);

  it("construye la variante de detalle (800x800) sin sufijo", () => {
    expect(productImageSrc(model, "detail")).toBe("assets/img/devops/breaking-prod.webp");
  });

  it("construye la variante de card (480x480)", () => {
    expect(productImageSrc(model, "card")).toBe("assets/img/devops/breaking-prod-card.webp");
  });

  it("construye la variante de miniatura (150x150)", () => {
    expect(productImageSrc(model, "thumb")).toBe("assets/img/devops/breaking-prod-thumb.webp");
  });
});
