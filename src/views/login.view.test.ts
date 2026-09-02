import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";
import { requireElementOfType } from "@/lib/dom";

const { signIn } = vi.hoisted(() => ({ signIn: vi.fn() }));
vi.mock("@/services/auth.service", () => ({ signIn }));

const { initLoginView } = await import("@/views/login.view");

const MARKUP = `
  <form id="login-form">
    <input id="login-email" name="email" type="email" />
    <input id="login-password" name="password" type="password" />
    <p id="login-error" hidden></p>
    <button id="login-submit" type="submit">Sign in</button>
  </form>
`;

function fill(email: string, password: string): void {
  requireElementOfType("#login-email", HTMLInputElement).value = email;
  requireElementOfType("#login-password", HTMLInputElement).value = password;
}

function submitForm(): void {
  requireElementOfType("#login-form", HTMLFormElement).dispatchEvent(
    new Event("submit", { cancelable: true, bubbles: true }),
  );
}

function errorEl(): HTMLElement {
  return requireElementOfType("#login-error", HTMLParagraphElement);
}

function submitButton(): HTMLButtonElement {
  return requireElementOfType("#login-submit", HTMLButtonElement);
}

beforeEach(() => {
  signIn.mockReset();
  document.body.innerHTML = MARKUP;
});

describe("initLoginView", () => {
  it("signs in with the trimmed credentials and calls onSuccess", async () => {
    signIn.mockResolvedValueOnce({ token: "jwt", expiresIn: 1 });
    const onSuccess = vi.fn();
    initLoginView({ onSuccess });

    fill("  ada@example.com  ", "s3cret!");
    submitForm();

    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
    expect(signIn).toHaveBeenCalledWith({ email: "ada@example.com", password: "s3cret!" });
    expect(submitButton().disabled).toBe(false);
  });

  it("does not call the service and shows a message when a field is empty", () => {
    initLoginView();

    fill("", "");
    submitForm();

    expect(signIn).not.toHaveBeenCalled();
    expect(errorEl().hidden).toBe(false);
    expect(errorEl().textContent).toContain("email and password");
  });

  it("shows an invalid-credentials message on an HTTP error", async () => {
    signIn.mockRejectedValueOnce(new ApiError("http", "HTTP 401"));
    initLoginView();

    fill("ada@example.com", "wrong");
    submitForm();

    await vi.waitFor(() => {
      expect(errorEl().textContent).toBe("Email or password is incorrect.");
    });
    expect(submitButton().disabled).toBe(false);
  });

  it("re-enables the button and shows a connection message on a network error", async () => {
    signIn.mockRejectedValueOnce(new ApiError("network", "offline"));
    initLoginView();

    fill("ada@example.com", "s3cret!");
    submitForm();

    await vi.waitFor(() => {
      expect(errorEl().textContent).toContain("Could not reach the store");
    });
  });

  it("throws when the required markup is missing", () => {
    document.body.innerHTML = "<div></div>";
    expect(() => {
      initLoginView();
    }).toThrow();
  });
});
