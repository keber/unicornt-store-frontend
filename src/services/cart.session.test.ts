import { beforeEach, describe, expect, it, vi } from "vitest";

const { onAuthChange, isAuthenticated, mergeLocalCart, readCart, writeCart } = vi.hoisted(() => ({
  onAuthChange: vi.fn(),
  isAuthenticated: vi.fn(),
  mergeLocalCart: vi.fn(),
  readCart: vi.fn(),
  writeCart: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({ onAuthChange, isAuthenticated }));
vi.mock("@/services/cart.sync", () => ({ mergeLocalCart }));
vi.mock("@/storage/cart.storage", () => ({ readCart, writeCart }));

interface Change {
  type: "login" | "logout";
}

async function loadFreshInitCartSession(): Promise<() => void> {
  vi.resetModules();
  const module = await import("@/services/cart.session");
  return module.initCartSession;
}

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

function registeredListener(): (change: Change) => void {
  const call = onAuthChange.mock.calls[0];
  if (call === undefined) {
    throw new Error("onAuthChange was never called");
  }
  return call[0] as (change: Change) => void;
}

beforeEach(() => {
  vi.clearAllMocks();
  isAuthenticated.mockReturnValue(false);
  readCart.mockReturnValue({ items: [] });
  mergeLocalCart.mockResolvedValue({ items: [] });
});

describe("initCartSession", () => {
  it("subscribes to auth changes exactly once even if called twice", async () => {
    const initCartSession = await loadFreshInitCartSession();

    initCartSession();
    initCartSession();

    expect(onAuthChange).toHaveBeenCalledTimes(1);
  });

  it("on a login event merges the local cart then clears local storage", async () => {
    readCart.mockReturnValue({ items: [{ id: 1, qty: 2 }] });
    const initCartSession = await loadFreshInitCartSession();
    initCartSession();
    const listener = registeredListener();

    listener({ type: "login" });
    await flush();

    expect(mergeLocalCart).toHaveBeenCalledWith([{ id: 1, qty: 2 }]);
    expect(writeCart).toHaveBeenCalledWith({ items: [] });
  });

  it("keeps the local cart when the merge fails", async () => {
    readCart.mockReturnValue({ items: [{ id: 1, qty: 2 }] });
    mergeLocalCart.mockRejectedValueOnce(new Error("network"));
    const initCartSession = await loadFreshInitCartSession();
    initCartSession();
    const listener = registeredListener();

    listener({ type: "login" });
    await flush();

    expect(writeCart).not.toHaveBeenCalled();
  });

  it("runs the merge once on load when a token is already stored", async () => {
    isAuthenticated.mockReturnValue(true);
    readCart.mockReturnValue({ items: [{ id: 9, qty: 1 }] });
    const initCartSession = await loadFreshInitCartSession();

    initCartSession();
    await flush();

    expect(mergeLocalCart).toHaveBeenCalledWith([{ id: 9, qty: 1 }]);
  });

  it("does nothing on a logout event or an empty local cart", async () => {
    const initCartSession = await loadFreshInitCartSession();
    initCartSession();
    const listener = registeredListener();

    listener({ type: "logout" });
    listener({ type: "login" });
    await flush();

    expect(mergeLocalCart).not.toHaveBeenCalled();
  });
});
