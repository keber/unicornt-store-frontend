import { describe, expect, it } from "vitest";
import { extractCheckoutForm } from "@/adapters/checkoutForm";

function formWith(entries: Record<string, string>): HTMLFormElement {
  const form = document.createElement("form");
  for (const [name, value] of Object.entries(entries)) {
    const input = document.createElement("input");
    input.name = name;
    input.value = value;
    form.append(input);
  }
  return form;
}

describe("extractCheckoutForm", () => {
  it("reads every buyer + shipping field from the form", () => {
    const form = formWith({
      fullName: "Ana Pérez",
      email: "ana@example.com",
      street: "Av. Siempre Viva 742",
      city: "Santiago",
      region: "RM",
      zipCode: " 7500000 ",
    });

    expect(extractCheckoutForm(form)).toEqual({
      fullName: "Ana Pérez",
      email: "ana@example.com",
      street: "Av. Siempre Viva 742",
      city: "Santiago",
      region: "RM",
      zipCode: "7500000",
    });
  });

  it("treats a missing zip code as an empty string", () => {
    const form = formWith({
      fullName: "Ana",
      email: "a@b.cl",
      street: "Calle 1",
      city: "Santiago",
      region: "RM",
    });

    expect(extractCheckoutForm(form).zipCode).toBe("");
  });

  it("throws when a required field is absent", () => {
    const form = formWith({ email: "a@b.cl", street: "Calle 1", city: "Santiago", region: "RM" });

    expect(() => extractCheckoutForm(form)).toThrow(TypeError);
  });
});
