import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCartPayload, mergeCartPayload } from "@/api/cart.api";
import { ApiError } from "@/api/errors";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchCartPayload", () => {
  it("returns the parsed JSON body on a successful response", async () => {
    const body = { items: [], itemCount: 0, total: 0 };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(body) }),
    );

    await expect(fetchCartPayload()).resolves.toEqual(body);
  });

  it("raises ApiError('http') when the session is rejected (401)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 401, json: () => Promise.resolve(null) }),
    );

    const error = await fetchCartPayload().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("http");
  });
});

describe("mergeCartPayload", () => {
  it("POSTs the local items under an { items } envelope", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({ items: [] }) });
    vi.stubGlobal("fetch", fetchMock);

    await mergeCartPayload([{ productId: 12, quantity: 2 }]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toMatch(/\/api\/v1\/cart\/merge$/);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ items: [{ productId: 12, quantity: 2 }] });
  });

  it("raises ApiError('network') when the request cannot be sent", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    const error = await mergeCartPayload([{ productId: 1, quantity: 1 }]).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("network");
  });
});
