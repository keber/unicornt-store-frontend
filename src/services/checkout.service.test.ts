import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";
import type { CartModel } from "@/models/cart.model";
import type { RawCheckoutInput } from "@/models/checkout.model";
import type { ProductModel } from "@/models/product.model";

const { placeOrderRequest } = vi.hoisted(() => ({ placeOrderRequest: vi.fn() }));
vi.mock("@/api/order.api", () => ({ placeOrderRequest }));

const { buildCheckoutModel, submitCheckout } = await import("@/services/checkout.service");

const buyer: RawCheckoutInput = {
  fullName: "Ana Pérez",
  email: "ana@example.com",
  street: "Av. Siempre Viva 742",
  city: "Santiago",
  region: "RM",
  zipCode: "7500000",
};

const products: ProductModel[] = [
  {
    id: 1,
    name: "Polera A",
    category: "Unicorns",
    subcategory: "T-shirt",
    price: 10000,
    description: "d",
    image: "a",
  },
];

describe("buildCheckoutModel", () => {
  it("builds the order with the computed total and 'submitting' status", () => {
    const cart: CartModel = { items: [{ id: 1, qty: 2 }] };

    expect(buildCheckoutModel(buyer, cart, products)).toEqual({
      buyer,
      items: cart.items,
      total: 20000,
      status: "submitting",
    });
  });
});

describe("submitCheckout", () => {
  it("posts only the shipping address and maps a valid confirmation", async () => {
    placeOrderRequest.mockResolvedValueOnce({ id: 58, status: "CONFIRMED", total: 20000 });
    const order = buildCheckoutModel(buyer, { items: [{ id: 1, qty: 2 }] }, products);

    const confirmation = await submitCheckout(order);

    expect(placeOrderRequest).toHaveBeenCalledWith({
      street: "Av. Siempre Viva 742",
      city: "Santiago",
      region: "RM",
      zipCode: "7500000",
    });
    expect(confirmation).toEqual({ id: 58, status: "CONFIRMED", total: 20000 });
  });

  it("omits an empty zip code from the payload", async () => {
    placeOrderRequest.mockResolvedValueOnce({ id: 1, status: "CONFIRMED", total: 0 });
    const order = buildCheckoutModel(
      { ...buyer, zipCode: "  " },
      { items: [{ id: 1, qty: 1 }] },
      products,
    );

    await submitCheckout(order);

    expect(placeOrderRequest).toHaveBeenCalledWith({
      street: "Av. Siempre Viva 742",
      city: "Santiago",
      region: "RM",
    });
  });

  it("raises ApiError('invalid-payload') on an unexpected response shape", async () => {
    placeOrderRequest.mockResolvedValueOnce({ nope: true });
    const order = buildCheckoutModel(buyer, { items: [{ id: 1, qty: 1 }] }, products);

    const error = await submitCheckout(order).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("invalid-payload");
  });

  it("propagates a transport ApiError (e.g. out of stock -> HTTP 422)", async () => {
    placeOrderRequest.mockRejectedValueOnce(new ApiError("http", "backend error (HTTP 422)."));
    const order = buildCheckoutModel(buyer, { items: [{ id: 1, qty: 1 }] }, products);

    await expect(submitCheckout(order)).rejects.toBeInstanceOf(ApiError);
  });
});
