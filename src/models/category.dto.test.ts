import { describe, expect, it } from "vitest";
import { isCategoryDto, isCategoryDtoArray, toCategoryModel } from "@/models/category.dto";

const valid = { id: 1, name: "Unicorns", slug: "unicorns" };

describe("isCategoryDto", () => {
  it("accepts a well-formed category", () => {
    expect(isCategoryDto(valid)).toBe(true);
  });

  it("rejects null, primitives and missing fields", () => {
    expect(isCategoryDto(null)).toBe(false);
    expect(isCategoryDto("unicorns")).toBe(false);
    expect(isCategoryDto({ id: 1, name: "Unicorns" })).toBe(false);
  });

  it("rejects a non-positive id and empty strings", () => {
    expect(isCategoryDto({ ...valid, id: 0 })).toBe(false);
    expect(isCategoryDto({ ...valid, name: "  " })).toBe(false);
    expect(isCategoryDto({ ...valid, slug: "" })).toBe(false);
  });
});

describe("isCategoryDtoArray", () => {
  it("accepts an empty and an all-valid array, rejects a bad element or non-array", () => {
    expect(isCategoryDtoArray([])).toBe(true);
    expect(isCategoryDtoArray([valid, { ...valid, id: 2 }])).toBe(true);
    expect(isCategoryDtoArray([valid, { ...valid, id: -1 }])).toBe(false);
    expect(isCategoryDtoArray("x")).toBe(false);
  });
});

describe("toCategoryModel", () => {
  it("copies the three fields", () => {
    expect(toCategoryModel(valid)).toEqual({ id: 1, name: "Unicorns", slug: "unicorns" });
  });
});
