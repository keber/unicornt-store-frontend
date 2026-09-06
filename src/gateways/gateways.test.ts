import { describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  fetchProductsPayload: vi.fn(),
  createProductRequest: vi.fn(),
  updateProductRequest: vi.fn(),
  deleteProductRequest: vi.fn(),
  placeOrderRequest: vi.fn(),
}));
vi.mock("@/api/product.api", () => api);
vi.mock("@/api/order.api", () => ({ placeOrderRequest: api.placeOrderRequest }));

const { httpProductGateway } = await import("@/gateways/product.gateway");
const { httpCheckoutGateway } = await import("@/gateways/checkout.gateway");
const productService = await import("@/services/product.service");
const checkoutService = await import("@/services/checkout.service");

describe("httpProductGateway", () => {
  it("delegates each method to the api module", async () => {
    api.fetchProductsPayload.mockResolvedValue("L");
    api.createProductRequest.mockResolvedValue("C");
    api.updateProductRequest.mockResolvedValue("U");
    api.deleteProductRequest.mockResolvedValue(null);

    await expect(httpProductGateway.list({ q: "x" })).resolves.toBe("L");
    expect(api.fetchProductsPayload).toHaveBeenCalledWith({ q: "x" });
    await httpProductGateway.list();
    expect(api.fetchProductsPayload).toHaveBeenLastCalledWith({});

    const payload = {
      name: "n",
      description: "d",
      imageBase: "i",
      price: 1,
      categoryId: 1,
      productTypeId: 1,
      stock: 1,
      active: true,
    };
    await expect(httpProductGateway.create(payload)).resolves.toBe("C");
    await expect(httpProductGateway.update(5, payload)).resolves.toBe("U");
    expect(api.updateProductRequest).toHaveBeenCalledWith(5, payload);
    await httpProductGateway.remove(5);
    expect(api.deleteProductRequest).toHaveBeenCalledWith(5);
  });
});

describe("httpCheckoutGateway", () => {
  it("delegates placeOrder to the api module", async () => {
    api.placeOrderRequest.mockResolvedValue("O");
    await expect(
      httpCheckoutGateway.placeOrder({ street: "s", city: "c", region: "r" }),
    ).resolves.toBe("O");
  });
});

describe("services accept an injected fake gateway", () => {
  it("fetchProducts runs against a fake ProductGateway", async () => {
    const fake = {
      list: vi.fn().mockResolvedValue({
        content: [
          {
            id: 1,
            name: "Mug",
            description: "d",
            imageBase: "mug",
            price: 7990,
            categoryId: 2,
            categoryName: "Rainbows",
            productTypeId: 2,
            productTypeName: "Mug",
            stock: 3,
            active: true,
          },
        ],
        page: 0,
        size: 20,
        totalElements: 1,
        totalPages: 1,
      }),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    const products = await productService.fetchProducts({}, fake);

    expect(products).toHaveLength(1);
    expect(fake.list).toHaveBeenCalledTimes(1);
  });

  it("submitCheckout runs against a fake CheckoutGateway", async () => {
    const fake = {
      placeOrder: vi.fn().mockResolvedValue({ id: 9, status: "CONFIRMED", total: 100 }),
    };
    const order = checkoutService.buildCheckoutModel(
      { fullName: "A", email: "a@b.cl", street: "s", city: "c", region: "r", zipCode: "" },
      { items: [] },
      [],
    );

    const confirmation = await checkoutService.submitCheckout(order, fake);

    expect(confirmation).toEqual({ id: 9, status: "CONFIRMED", total: 100 });
    expect(fake.placeOrder).toHaveBeenCalledWith({ street: "s", city: "c", region: "r" });
  });
});
