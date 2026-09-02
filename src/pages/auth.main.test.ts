import { beforeEach, describe, expect, it, vi } from "vitest";

const { initLoginView, initRegisterView, renderGlobalFallback } = vi.hoisted(() => ({
  initLoginView: vi.fn(),
  initRegisterView: vi.fn(),
  renderGlobalFallback: vi.fn(),
}));

vi.mock("@/views/login.view", () => ({ initLoginView }));
vi.mock("@/views/register.view", () => ({ initRegisterView }));
vi.mock("@/components/GlobalFallback/GlobalFallback", () => ({ renderGlobalFallback }));
vi.mock("@/services/auth.service", () => ({ onAuthChange: vi.fn() }));

const { bootstrapAuthPage } = await import("@/pages/auth.main");

beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = "";
});

describe("bootstrapAuthPage", () => {
  it("wires the login form when it is present", () => {
    document.body.innerHTML = '<form id="login-form"></form>';

    bootstrapAuthPage();

    expect(initLoginView).toHaveBeenCalledTimes(1);
    expect(initRegisterView).not.toHaveBeenCalled();
  });

  it("wires the register form when it is present", () => {
    document.body.innerHTML = '<form id="register-form"></form>';

    bootstrapAuthPage();

    expect(initRegisterView).toHaveBeenCalledTimes(1);
    expect(initLoginView).not.toHaveBeenCalled();
  });

  it("falls back to the global error screen if wiring throws", () => {
    document.body.innerHTML = '<form id="login-form"></form>';
    initLoginView.mockImplementationOnce(() => {
      throw new Error("bad markup");
    });

    bootstrapAuthPage();

    expect(renderGlobalFallback).toHaveBeenCalledTimes(1);
  });
});
