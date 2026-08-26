import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitOrder } from "@/api/checkout.api";
import { ApiError } from "@/api/errors";
import type { CheckoutModel } from "@/models/checkout.model";

const order: CheckoutModel = {
  buyer: { fullName: "Ana Pérez", email: "ana@example.com", address: "Av. Siempre Viva 742" },
  items: [{ id: 1, qty: 1 }],
  total: 13990,
  status: "submitting",
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("submitOrder", () => {
  it("resuelve tras la latencia simulada cuando Math.random no cae en el rango de fallo", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);

    const promise = submitOrder(order);
    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBeUndefined();
  });

  it("aplica una latencia real, no resuelve instantaneamente", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);

    let resolved = false;
    const promise = submitOrder(order).then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(100);
    expect(resolved).toBe(false);

    await vi.runAllTimersAsync();
    await promise;
    expect(resolved).toBe(true);
  });

  it("lanza ApiError('network') cuando Math.random cae en el rango de fallo simulado", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    // .catch() se encadena en la misma sincronia en que se crea la
    // promesa (antes de avanzar los timers fake) para que Node no la
    // reporte como "unhandled rejection" en el instante en que rechaza.
    const result = submitOrder(order).catch((e: unknown) => e);
    await vi.runAllTimersAsync();

    const error = await result;
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("network");
  });
});
