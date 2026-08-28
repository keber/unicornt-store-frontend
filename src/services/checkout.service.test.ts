import { describe, expect, it, vi } from "vitest";
import type { CartModel } from "@/models/cart.model";
import type { ProductModel } from "@/models/product.model";
import type { RawCheckoutInput } from "@/models/checkout.model";

const { submitOrder } = vi.hoisted(() => ({ submitOrder: vi.fn() }));
vi.mock("@/api/checkout.api", () => ({ submitOrder }));

const { buildCheckoutModel, submitCheckout } = await import("@/services/checkout.service");

const buyer: RawCheckoutInput = {
  fullName: "Ana Pérez",
  email: "ana@example.com",
  address: "Av. Siempre Viva 742",
};

const products: ProductModel[] = [
  {
    id: 1,
    name: "Polera A",
    category: "Polera",
    subcategory: "devops",
    price: 10000,
    description: "d",
    image: "assets/img/devops/a",
  },
];

describe("buildCheckoutModel", () => {
  it("arma el pedido con el total calculado y estado 'submitting'", () => {
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
  it("delega en submitOrder() de la capa API", async () => {
    submitOrder.mockResolvedValueOnce(undefined);
    const order = buildCheckoutModel(buyer, { items: [{ id: 1, qty: 1 }] }, products);

    await submitCheckout(order);

    expect(submitOrder).toHaveBeenCalledWith(order);
  });

  it("propaga el error si submitOrder() rechaza", async () => {
    submitOrder.mockRejectedValueOnce(new Error("fallo simulado"));
    const order = buildCheckoutModel(buyer, { items: [{ id: 1, qty: 1 }] }, products);

    await expect(submitCheckout(order)).rejects.toThrow("fallo simulado");
  });
});
