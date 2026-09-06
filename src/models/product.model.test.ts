import { describe, expect, it } from "vitest";
import { isPurchasable, productImageSrc, type ProductModel } from "@/models/product.model";

const model: ProductModel = {
  id: 7,
  name: "Rainbow Mug",
  category: "Rainbows",
  categoryId: 2,
  subcategory: "Mug",
  price: 7990,
  description: "Ceramic mug.",
  image: "rainbow-mug",
  stock: 3,
  active: true,
};

describe("productImageSrc", () => {
  it("builds the detail variant with no suffix", () => {
    expect(productImageSrc(model, "detail")).toBe("rainbow-mug.webp");
  });

  it("builds the card variant", () => {
    expect(productImageSrc(model, "card")).toBe("rainbow-mug-card.webp");
  });

  it("builds the thumbnail variant", () => {
    expect(productImageSrc(model, "thumb")).toBe("rainbow-mug-thumb.webp");
  });
});

describe("isPurchasable", () => {
  it("is true for an active product with stock", () => {
    expect(isPurchasable(model)).toBe(true);
  });

  it("is false when inactive or out of stock", () => {
    expect(isPurchasable({ ...model, active: false })).toBe(false);
    expect(isPurchasable({ ...model, stock: 0 })).toBe(false);
  });

  it("assumes availability when the optional fields are absent (legacy fixtures)", () => {
    const legacy: ProductModel = {
      id: 1,
      name: "Legacy",
      category: "x",
      subcategory: "y",
      price: 1,
      description: "d",
      image: "i",
    };
    expect(isPurchasable(legacy)).toBe(true);
  });
});
