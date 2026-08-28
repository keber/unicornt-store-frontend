import { describe, expect, it } from "vitest";
import { isProductDto, isProductDtoArray } from "@/models/product.dto";

const validDto = {
  id: 1,
  name: "Polera 'I Can Explain It To You'",
  category: "Polera",
  subcategory: "pm",
  price: 13990,
  description: "Descripcion valida.",
  image: "assets/img/pm/i-can-explain-it-to-you",
};

describe("isProductDto", () => {
  it("acepta un producto valido", () => {
    expect(isProductDto(validDto)).toBe(true);
  });

  it("rechaza null y tipos primitivos", () => {
    expect(isProductDto(null)).toBe(false);
    expect(isProductDto(undefined)).toBe(false);
    expect(isProductDto("producto")).toBe(false);
    expect(isProductDto(42)).toBe(false);
  });

  it("rechaza un id no entero, cero o negativo", () => {
    expect(isProductDto({ ...validDto, id: 1.5 })).toBe(false);
    expect(isProductDto({ ...validDto, id: 0 })).toBe(false);
    expect(isProductDto({ ...validDto, id: -1 })).toBe(false);
  });

  it("rechaza category fuera del vocabulario cerrado", () => {
    expect(isProductDto({ ...validDto, category: "Gorro" })).toBe(false);
  });

  it("rechaza subcategory fuera del vocabulario cerrado", () => {
    expect(isProductDto({ ...validDto, subcategory: "inexistente" })).toBe(false);
  });

  it("rechaza price negativo o no numerico", () => {
    expect(isProductDto({ ...validDto, price: -100 })).toBe(false);
    expect(isProductDto({ ...validDto, price: "13990" })).toBe(false);
  });

  it("rechaza name/description/image vacios", () => {
    expect(isProductDto({ ...validDto, name: "" })).toBe(false);
    expect(isProductDto({ ...validDto, description: "   " })).toBe(false);
    expect(isProductDto({ ...validDto, image: "" })).toBe(false);
  });

  it("rechaza campos faltantes", () => {
    const withoutImage: Record<string, unknown> = {
      id: validDto.id,
      name: validDto.name,
      category: validDto.category,
      subcategory: validDto.subcategory,
      price: validDto.price,
      description: validDto.description,
    };
    expect(isProductDto(withoutImage)).toBe(false);
  });
});

describe("isProductDtoArray", () => {
  it("acepta un array vacio", () => {
    expect(isProductDtoArray([])).toBe(true);
  });

  it("acepta un array donde todos los elementos son validos", () => {
    expect(isProductDtoArray([validDto, { ...validDto, id: 2 }])).toBe(true);
  });

  it("rechaza el array completo si un solo elemento es invalido", () => {
    expect(isProductDtoArray([validDto, { ...validDto, id: -2 }])).toBe(false);
  });

  it("rechaza valores que no son array", () => {
    expect(isProductDtoArray({ length: 0 })).toBe(false);
  });
});
