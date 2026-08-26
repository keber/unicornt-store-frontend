import { describe, expect, it } from "vitest";
import { MAX_QUANTITY, MIN_QUANTITY, clampQuantity, parseQuantityInput } from "@/lib/quantity";

describe("clampQuantity", () => {
  it("deja pasar un valor dentro de rango", () => {
    expect(clampQuantity(5)).toBe(5);
  });

  it("sube al minimo si el valor es menor", () => {
    expect(clampQuantity(0)).toBe(MIN_QUANTITY);
    expect(clampQuantity(-10)).toBe(MIN_QUANTITY);
  });

  it("baja al maximo si el valor es mayor", () => {
    expect(clampQuantity(1000)).toBe(MAX_QUANTITY);
  });

  it("trunca decimales", () => {
    expect(clampQuantity(5.9)).toBe(5);
  });

  it("cae al minimo si el valor es NaN", () => {
    expect(clampQuantity(Number.NaN)).toBe(MIN_QUANTITY);
  });

  it("respeta un rango [min, max] custom", () => {
    expect(clampQuantity(50, 10, 20)).toBe(20);
    expect(clampQuantity(5, 10, 20)).toBe(10);
  });
});

describe("parseQuantityInput", () => {
  it("parsea un string numerico valido", () => {
    expect(parseQuantityInput("7")).toBe(7);
  });

  it("cae al minimo si el string es vacio o no numerico", () => {
    expect(parseQuantityInput("")).toBe(MIN_QUANTITY);
    expect(parseQuantityInput("abc")).toBe(MIN_QUANTITY);
  });

  it("clampea un string fuera de rango", () => {
    expect(parseQuantityInput("999")).toBe(MAX_QUANTITY);
    expect(parseQuantityInput("-5")).toBe(MIN_QUANTITY);
  });
});
