import { describe, expect, it } from "vitest";
import {
  isProductDto,
  isProductDtoArray,
  isProductPageDto,
  toProductModel,
} from "@/models/product.dto";

const validDto = {
  id: 1,
  name: "Classic Unicorn T-shirt",
  description: "Cotton T-shirt with the classic Unicornt print.",
  imageBase: "classic-unicorn-tshirt",
  price: 14990,
  categoryId: 1,
  categoryName: "Unicorns",
  productTypeId: 1,
  productTypeName: "T-shirt",
  stock: 25,
  active: true,
};

const validPage = {
  content: [validDto],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
};

describe("isProductDto", () => {
  it("accepts a well-formed product", () => {
    expect(isProductDto(validDto)).toBe(true);
  });

  it("rejects null and primitives", () => {
    expect(isProductDto(null)).toBe(false);
    expect(isProductDto(undefined)).toBe(false);
    expect(isProductDto("product")).toBe(false);
    expect(isProductDto(42)).toBe(false);
  });

  it("rejects a non-integer, zero or negative id", () => {
    expect(isProductDto({ ...validDto, id: 1.5 })).toBe(false);
    expect(isProductDto({ ...validDto, id: 0 })).toBe(false);
    expect(isProductDto({ ...validDto, id: -1 })).toBe(false);
  });

  it("rejects a negative or non-numeric price", () => {
    expect(isProductDto({ ...validDto, price: -100 })).toBe(false);
    expect(isProductDto({ ...validDto, price: "14990" })).toBe(false);
  });

  it("rejects negative or non-integer stock", () => {
    expect(isProductDto({ ...validDto, stock: -1 })).toBe(false);
    expect(isProductDto({ ...validDto, stock: 2.5 })).toBe(false);
  });

  it("rejects an empty name or category name", () => {
    expect(isProductDto({ ...validDto, name: "" })).toBe(false);
    expect(isProductDto({ ...validDto, categoryName: "   " })).toBe(false);
  });

  it("rejects a non-boolean active flag and missing fields", () => {
    expect(isProductDto({ ...validDto, active: "true" })).toBe(false);
    const { imageBase: _omitted, ...withoutImage } = validDto;
    void _omitted;
    expect(isProductDto(withoutImage)).toBe(false);
  });

  it("allows an empty description and imageBase (nullable columns)", () => {
    expect(isProductDto({ ...validDto, description: "", imageBase: "" })).toBe(true);
  });
});

describe("isProductDtoArray", () => {
  it("accepts an empty array and an all-valid array", () => {
    expect(isProductDtoArray([])).toBe(true);
    expect(isProductDtoArray([validDto, { ...validDto, id: 2 }])).toBe(true);
  });

  it("rejects the whole array when a single element is invalid", () => {
    expect(isProductDtoArray([validDto, { ...validDto, id: -2 }])).toBe(false);
  });

  it("rejects a non-array", () => {
    expect(isProductDtoArray({ length: 0 })).toBe(false);
  });
});

describe("isProductPageDto", () => {
  it("accepts the documented envelope", () => {
    expect(isProductPageDto(validPage)).toBe(true);
  });

  it("rejects a bare array (no envelope)", () => {
    expect(isProductPageDto([validDto])).toBe(false);
  });

  it("rejects an envelope whose content has an invalid product", () => {
    expect(isProductPageDto({ ...validPage, content: [{ ...validDto, id: 0 }] })).toBe(false);
  });

  it("rejects an envelope missing a numeric field", () => {
    const { totalPages: _omitted, ...withoutTotalPages } = validPage;
    void _omitted;
    expect(isProductPageDto(withoutTotalPages)).toBe(false);
  });
});

describe("toProductModel", () => {
  it("bridges the backend fields to the model shape", () => {
    expect(toProductModel(validDto)).toEqual({
      id: 1,
      name: "Classic Unicorn T-shirt",
      category: "Unicorns",
      categoryId: 1,
      subcategory: "T-shirt",
      price: 14990,
      description: "Cotton T-shirt with the classic Unicornt print.",
      image: "classic-unicorn-tshirt",
      stock: 25,
      active: true,
    });
  });
});
