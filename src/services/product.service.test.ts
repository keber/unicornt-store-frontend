import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";

const { fetchProductsPayload } = vi.hoisted(() => ({
  fetchProductsPayload: vi.fn(),
}));

vi.mock("@/api/product.api", () => ({ fetchProductsPayload }));

const { fetchProducts } = await import("@/services/product.service");

const validDto = {
  id: 1,
  name: "Polera 'I Can Explain It To You'",
  category: "Polera",
  subcategory: "pm",
  price: 13990,
  description: "Descripcion valida.",
  image: "assets/img/pm/i-can-explain-it-to-you",
};

describe("fetchProducts", () => {
  it("valida y mapea un payload correcto a ProductModel[]", async () => {
    fetchProductsPayload.mockResolvedValueOnce([validDto]);

    const products = await fetchProducts();

    expect(products).toEqual([validDto]);
  });

  it("lanza ApiError('invalid-payload') si el payload no es un array de productos", async () => {
    fetchProductsPayload.mockResolvedValueOnce({ not: "an array" });

    const error = await fetchProducts().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("invalid-payload");
  });

  it("lanza ApiError('invalid-payload') si un solo elemento del array es invalido", async () => {
    fetchProductsPayload.mockResolvedValueOnce([validDto, { ...validDto, id: -1 }]);

    const error = await fetchProducts().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("invalid-payload");
  });

  it("propaga los ApiError que ya vienen de la capa API (network/http/json)", async () => {
    fetchProductsPayload.mockRejectedValueOnce(new ApiError("network", "sin conexion"));

    const error = await fetchProducts().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("network");
  });
});
