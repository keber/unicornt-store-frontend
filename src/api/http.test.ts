import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";
import { apiBaseUrl, apiFetch, setAuthTokenProvider } from "@/api/http";

afterEach(() => {
  vi.unstubAllGlobals();
  setAuthTokenProvider(() => null);
});

describe("apiBaseUrl", () => {
  it("falls back to localhost:8080 and trims trailing slashes", () => {
    expect(apiBaseUrl()).toBe("http://localhost:8080");
  });
});

describe("apiFetch", () => {
  it("prefixes the base URL, sets JSON headers and parses the body", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ ok: 1 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const body = await apiFetch("/api/v1/products");

    expect(body).toEqual({ ok: 1 });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://localhost:8080/api/v1/products");
    expect((init.headers as Record<string, string>).Accept).toBe("application/json");
    expect(init.body).toBeUndefined();
  });

  it("serialises a body and attaches the bearer token when one is provided", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(null) });
    vi.stubGlobal("fetch", fetchMock);
    setAuthTokenProvider(() => "tok123");

    await apiFetch("/api/v1/cart/items", { method: "POST", body: { productId: 1, quantity: 2 } });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(init.body).toBe('{"productId":1,"quantity":2}');
    const headers = init.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers.Authorization).toBe("Bearer tok123");
  });

  it("resolves to null on 204 No Content", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 204 }));
    await expect(apiFetch("/api/v1/cart/items/1", { method: "DELETE" })).resolves.toBeNull();
  });

  it("throws ApiError('network') when fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const error = await apiFetch("/x").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("network");
  });

  it("throws ApiError('http') on 401 and on other non-2xx statuses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));
    const unauthorized = await apiFetch("/x").catch((e: unknown) => e);
    expect((unauthorized as ApiError).reason).toBe("http");

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    const serverError = await apiFetch("/x").catch((e: unknown) => e);
    expect((serverError as ApiError).reason).toBe("http");
  });

  it("throws ApiError('invalid-json') when the body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new SyntaxError("bad")),
      }),
    );
    const error = await apiFetch("/x").catch((e: unknown) => e);
    expect((error as ApiError).reason).toBe("invalid-json");
  });
});
