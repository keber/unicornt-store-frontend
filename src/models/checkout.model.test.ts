import { describe, expect, it } from "vitest";
import {
  hasCheckoutErrors,
  isCheckoutStatus,
  validateCheckoutInput,
  type RawCheckoutInput,
} from "@/models/checkout.model";

const validInput: RawCheckoutInput = {
  fullName: "Ana Pérez",
  email: "ana@example.com",
  street: "Av. Siempre Viva 742",
  city: "Santiago",
  region: "RM",
  zipCode: "",
};

describe("isCheckoutStatus", () => {
  it("accepts the 4 closed states and rejects anything else", () => {
    expect(isCheckoutStatus("idle")).toBe(true);
    expect(isCheckoutStatus("submitting")).toBe(true);
    expect(isCheckoutStatus("success")).toBe(true);
    expect(isCheckoutStatus("error")).toBe(true);
    expect(isCheckoutStatus("loading")).toBe(false);
    expect(isCheckoutStatus("")).toBe(false);
  });
});

describe("validateCheckoutInput", () => {
  it("returns no errors for valid input", () => {
    expect(validateCheckoutInput(validInput)).toEqual({});
  });

  it("rejects an empty or too-short name", () => {
    expect(validateCheckoutInput({ ...validInput, fullName: "" }).fullName).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, fullName: "Al" }).fullName).toBeDefined();
  });

  it("rejects emails with no @, no domain or spaces", () => {
    expect(validateCheckoutInput({ ...validInput, email: "no-at" }).email).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, email: "a@b" }).email).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, email: "a b@c.com" }).email).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, email: "a@b.cl" }).email).toBeUndefined();
  });

  it("requires street, city and region", () => {
    expect(validateCheckoutInput({ ...validInput, street: "" }).street).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, street: "Ac 1" }).street).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, city: "  " }).city).toBeDefined();
    expect(validateCheckoutInput({ ...validInput, region: "" }).region).toBeDefined();
  });

  it("reports several invalid fields at once", () => {
    const errors = validateCheckoutInput({
      fullName: "",
      email: "x",
      street: "",
      city: "",
      region: "",
      zipCode: "",
    });
    expect(Object.keys(errors).sort()).toEqual(["city", "email", "fullName", "region", "street"]);
  });
});

describe("hasCheckoutErrors", () => {
  it("is false for an empty error object and true otherwise", () => {
    expect(hasCheckoutErrors({})).toBe(false);
    expect(hasCheckoutErrors({ email: "bad" })).toBe(true);
  });
});
