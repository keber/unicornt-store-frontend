import { describe, expect, it } from "vitest";
import {
  extractRawCheckoutInput,
  hasCheckoutErrors,
  isCheckoutStatus,
  validateCheckoutInput,
  type RawCheckoutInput,
} from "@/models/checkout.model";

const validInput: RawCheckoutInput = {
  fullName: "Ana Pérez",
  email: "ana@example.com",
  address: "Av. Siempre Viva 742",
};

describe("isCheckoutStatus", () => {
  it("acepta los 4 estados del vocabulario cerrado", () => {
    expect(isCheckoutStatus("idle")).toBe(true);
    expect(isCheckoutStatus("submitting")).toBe(true);
    expect(isCheckoutStatus("success")).toBe(true);
    expect(isCheckoutStatus("error")).toBe(true);
  });

  it("rechaza cualquier otro string", () => {
    expect(isCheckoutStatus("loading")).toBe(false);
    expect(isCheckoutStatus("")).toBe(false);
  });
});

describe("validateCheckoutInput", () => {
  it("no devuelve errores para datos validos", () => {
    expect(validateCheckoutInput(validInput)).toEqual({});
  });

  it("rechaza un nombre vacio o muy corto", () => {
    expect(validateCheckoutInput({ ...validInput, fullName: "" }).fullName).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, fullName: "Al" }).fullName).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, fullName: "   " }).fullName).toBeDefined();
  });

  it("rechaza emails sin @, sin dominio o con espacios", () => {
    expect(validateCheckoutInput({ ...validInput, email: "sin-arroba" }).email).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, email: "a@b" }).email).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, email: "a b@c.com" }).email).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, email: "@sindominio.com" }).email).toBeDefined();
  });

  it("acepta un email con formato razonable", () => {
    expect(validateCheckoutInput({ ...validInput, email: "a@b.cl" }).email).toBeUndefined();
  });

  it("rechaza una direccion vacia o muy corta", () => {
    expect(validateCheckoutInput({ ...validInput, address: "" }).address).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, address: "Ac 1" }).address).toBeDefined();
  });

  it("reporta varios campos invalidos a la vez", () => {
    const errors = validateCheckoutInput({ fullName: "", email: "x", address: "" });
    expect(Object.keys(errors).sort()).toEqual(["address", "email", "fullName"]);
  });
});

describe("hasCheckoutErrors", () => {
  it("es false para un objeto de errores vacio", () => {
    expect(hasCheckoutErrors({})).toBe(false);
  });

  it("es true si hay al menos un campo con error", () => {
    expect(hasCheckoutErrors({ email: "invalido" })).toBe(true);
  });
});

describe("extractRawCheckoutInput", () => {
  it("lee fullName/email/address desde un FormData", () => {
    const formData = new FormData();
    formData.set("fullName", "Ana Pérez");
    formData.set("email", "ana@example.com");
    formData.set("address", "Av. Siempre Viva 742");

    expect(extractRawCheckoutInput(formData)).toEqual(validInput);
  });

  it("lanza si un campo esperado no llega como texto", () => {
    const formData = new FormData();
    formData.set("email", "ana@example.com");
    formData.set("address", "Av. Siempre Viva 742");
    // fullName ausente

    expect(() => extractRawCheckoutInput(formData)).toThrow(TypeError);
  });
});
