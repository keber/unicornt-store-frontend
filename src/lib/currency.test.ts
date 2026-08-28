import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/currency";

describe("formatPrice", () => {
  it("antepone $ y usa separador de miles es-CL", () => {
    expect(formatPrice(13990)).toBe("$13.990");
  });

  it("funciona con montos de un digito", () => {
    expect(formatPrice(0)).toBe("$0");
  });

  it("funciona con montos de millones", () => {
    expect(formatPrice(1250000)).toBe("$1.250.000");
  });
});
