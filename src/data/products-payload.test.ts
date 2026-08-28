import { describe, expect, it } from "vitest";
import productsPayload from "../../public/data/products.json";
import { isProductDtoArray } from "@/models/product.dto";

/**
 * Prueba de integridad de datos: public/data/products.json se genero
 * programaticamente desde assets/js/products.js (Etapa 3, sin
 * transcripcion manual). Este test asegura que, si alguien lo edita a
 * mano despues, el archivo real siga siendo un ProductDto[] valido y
 * conserve las cifras verificadas en docs/etapa-1-baseline.md.
 */
describe("public/data/products.json", () => {
  it("es un ProductDto[] completo y valido", () => {
    expect(isProductDtoArray(productsPayload)).toBe(true);
  });

  it("contiene los 49 productos, con ids 1..49 sin gaps ni duplicados", () => {
    const ids = [...productsPayload.map((p) => p.id)].sort((a, b) => a - b);
    expect(ids).toHaveLength(49);
    expect(new Set(ids).size).toBe(49);
    expect(ids[0]).toBe(1);
    expect(ids[ids.length - 1]).toBe(49);
  });

  it("respeta el rango de precios verificado ($11.990 - $15.990)", () => {
    const prices = productsPayload.map((p) => p.price);
    expect(Math.min(...prices)).toBe(11990);
    expect(Math.max(...prices)).toBe(15990);
  });
});
