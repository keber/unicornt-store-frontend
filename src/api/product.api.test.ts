import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchProductsPayload } from "@/api/product.api";
import { ApiError } from "@/api/errors";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchProductsPayload", () => {
  it("devuelve el JSON parseado cuando la respuesta es exitosa", async () => {
    const body = [{ id: 1 }];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(body),
      }),
    );

    await expect(fetchProductsPayload()).resolves.toEqual(body);
  });

  it("lanza ApiError('network') si fetch rechaza (sin conexion)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    const error = await fetchProductsPayload().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("network");
  });

  it("lanza ApiError('http') si la respuesta no es ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve(null),
      }),
    );

    const error = await fetchProductsPayload().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("http");
  });

  it("lanza ApiError('invalid-json') si el body no es JSON valido", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new SyntaxError("Unexpected token")),
      }),
    );

    const error = await fetchProductsPayload().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("invalid-json");
  });
});
