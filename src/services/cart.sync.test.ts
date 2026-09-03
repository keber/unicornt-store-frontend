import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";

const { fetchCartPayload, mergeCartPayload } = vi.hoisted(() => ({
  fetchCartPayload: vi.fn(),
  mergeCartPayload: vi.fn(),
}));
vi.mock("@/api/cart.api", () => ({ fetchCartPayload, mergeCartPayload }));

const { fetchRemoteCart, mergeLocalCart } = await import("@/services/cart.sync");

beforeEach(() => {
  vi.clearAllMocks();
});

const remoteCart = {
  items: [
    {
      productId: 12,
      productName: "Unicorn plush",
      imageBase: "unicorn-plush",
      unitPrice: 14990,
      quantity: 5,
      subtotal: 74950,
    },
  ],
  itemCount: 5,
  total: 74950,
};

describe("fetchRemoteCart", () => {
  it("validates the payload and maps it to the cart model", async () => {
    fetchCartPayload.mockResolvedValueOnce(remoteCart);

    await expect(fetchRemoteCart()).resolves.toEqual({ items: [{ id: 12, qty: 5 }] });
  });

  it("raises ApiError('invalid-payload') on an unexpected shape", async () => {
    fetchCartPayload.mockResolvedValueOnce({ nope: true });

    const error = await fetchRemoteCart().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("invalid-payload");
  });
});

describe("mergeLocalCart", () => {
  it("builds the merge request from the local items and returns the merged cart", async () => {
    mergeCartPayload.mockResolvedValueOnce(remoteCart);

    const merged = await mergeLocalCart([
      { id: 12, qty: 2 },
      { id: 20, qty: 1 },
    ]);

    expect(mergeCartPayload).toHaveBeenCalledWith([
      { productId: 12, quantity: 2 },
      { productId: 20, quantity: 1 },
    ]);
    expect(merged).toEqual({ items: [{ id: 12, qty: 5 }] });
  });

  it("skips the merge call and reads the server cart when there is nothing local", async () => {
    fetchCartPayload.mockResolvedValueOnce({ items: [], itemCount: 0, total: 0 });

    const merged = await mergeLocalCart([]);

    expect(mergeCartPayload).not.toHaveBeenCalled();
    expect(merged).toEqual({ items: [] });
  });

  it("propagates a transport ApiError from the merge call", async () => {
    mergeCartPayload.mockRejectedValueOnce(new ApiError("http", "500"));

    const error = await mergeLocalCart([{ id: 1, qty: 1 }]).catch((e: unknown) => e);
    expect((error as ApiError).reason).toBe("http");
  });

  it("raises ApiError('invalid-payload') when the merge response is malformed", async () => {
    mergeCartPayload.mockResolvedValueOnce({
      items: [{ productId: 0, quantity: 1 }],
      itemCount: 1,
      total: 0,
    });

    const error = await mergeLocalCart([{ id: 1, qty: 1 }]).catch((e: unknown) => e);
    expect((error as ApiError).reason).toBe("invalid-payload");
  });
});
