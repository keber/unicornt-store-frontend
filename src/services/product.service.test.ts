import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";

const { fetchProductsPayload } = vi.hoisted(() => ({
  fetchProductsPayload: vi.fn(),
}));

vi.mock("@/api/product.api", () => ({ fetchProductsPayload }));

const { fetchProducts } = await import("@/services/product.service");

const dto = {
  id: 1,
  name: "Classic Unicorn T-shirt",
  description: "Cotton T-shirt.",
  imageBase: "classic-unicorn-tshirt",
  price: 14990,
  categoryId: 1,
  categoryName: "Unicorns",
  productTypeId: 1,
  productTypeName: "T-shirt",
  stock: 25,
  active: true,
};

const page = { content: [dto], page: 0, size: 20, totalElements: 1, totalPages: 1 };

describe("fetchProducts", () => {
  it("validates the page envelope and maps content to ProductModel[]", async () => {
    fetchProductsPayload.mockResolvedValueOnce(page);

    const products = await fetchProducts();

    expect(products).toEqual([
      {
        id: 1,
        name: "Classic Unicorn T-shirt",
        category: "Unicorns",
        categoryId: 1,
        subcategory: "T-shirt",
        price: 14990,
        description: "Cotton T-shirt.",
        image: "classic-unicorn-tshirt",
        stock: 25,
        active: true,
      },
    ]);
  });

  it("forwards the category and text filters to the transport layer", async () => {
    fetchProductsPayload.mockResolvedValueOnce({ ...page, content: [] });

    await fetchProducts({ category: "unicorns", q: "shirt" });

    expect(fetchProductsPayload).toHaveBeenCalledWith({ category: "unicorns", q: "shirt" });
  });

  it("raises ApiError('invalid-payload') when the response is not a page envelope", async () => {
    fetchProductsPayload.mockResolvedValueOnce([dto]);

    const error = await fetchProducts().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("invalid-payload");
  });

  it("raises ApiError('invalid-payload') when a single product in content is invalid", async () => {
    fetchProductsPayload.mockResolvedValueOnce({ ...page, content: [dto, { ...dto, id: -1 }] });

    const error = await fetchProducts().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("invalid-payload");
  });

  it("propagates ApiError from the transport layer (network/http/json)", async () => {
    fetchProductsPayload.mockRejectedValueOnce(new ApiError("network", "offline"));

    const error = await fetchProducts().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("network");
  });
});
