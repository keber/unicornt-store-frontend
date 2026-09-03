import { beforeEach, describe, expect, it, vi } from "vitest";

const { initAdminProductsView, renderGlobalFallback } = vi.hoisted(() => ({
  initAdminProductsView: vi.fn(),
  renderGlobalFallback: vi.fn(),
}));

vi.mock("@/views/admin/adminProducts.view", () => ({ initAdminProductsView }));
vi.mock("@/components/GlobalFallback/GlobalFallback", () => ({ renderGlobalFallback }));
vi.mock("@/services/auth.service", () => ({}));

const { bootstrapAdminPage } = await import("@/pages/admin.main");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("bootstrapAdminPage", () => {
  it("initialises the admin products view", () => {
    initAdminProductsView.mockResolvedValue(undefined);

    bootstrapAdminPage();

    expect(initAdminProductsView).toHaveBeenCalledTimes(1);
  });

  it("falls back to the global error screen if wiring throws synchronously", () => {
    initAdminProductsView.mockImplementation(() => {
      throw new Error("bad markup");
    });

    bootstrapAdminPage();

    expect(renderGlobalFallback).toHaveBeenCalledTimes(1);
  });
});
