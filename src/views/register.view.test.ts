import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";
import { requireElementOfType } from "@/lib/dom";

const { signUp, signIn } = vi.hoisted(() => ({ signUp: vi.fn(), signIn: vi.fn() }));
vi.mock("@/services/auth.service", () => ({ signUp, signIn }));

const { initRegisterView } = await import("@/views/register.view");

const MARKUP = `
  <form id="register-form">
    <input id="register-firstName" name="firstName" />
    <input id="register-lastName" name="lastName" />
    <input id="register-email" name="email" type="email" />
    <input id="register-password" name="password" type="password" />
    <p id="register-error" hidden></p>
    <button id="register-submit" type="submit">Create account</button>
  </form>
`;

interface FormValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

function fill(values: FormValues): void {
  requireElementOfType("#register-firstName", HTMLInputElement).value = values.firstName ?? "";
  requireElementOfType("#register-lastName", HTMLInputElement).value = values.lastName ?? "";
  requireElementOfType("#register-email", HTMLInputElement).value = values.email ?? "";
  requireElementOfType("#register-password", HTMLInputElement).value = values.password ?? "";
}

function submitForm(): void {
  requireElementOfType("#register-form", HTMLFormElement).dispatchEvent(
    new Event("submit", { cancelable: true, bubbles: true }),
  );
}

function errorText(): string {
  return requireElementOfType("#register-error", HTMLParagraphElement).textContent;
}

function submitButton(): HTMLButtonElement {
  return requireElementOfType("#register-submit", HTMLButtonElement);
}

beforeEach(() => {
  signUp.mockReset();
  signIn.mockReset();
  document.body.innerHTML = MARKUP;
});

describe("initRegisterView", () => {
  it("creates the account, signs it in and calls onSuccess", async () => {
    signUp.mockResolvedValueOnce({
      id: 1,
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      roles: ["ROLE_USER"],
    });
    signIn.mockResolvedValueOnce({ token: "jwt", expiresIn: 1 });
    const onSuccess = vi.fn();
    initRegisterView({ onSuccess });

    fill({
      firstName: " Ada ",
      lastName: " Lovelace ",
      email: "ada@example.com",
      password: "s3cret!",
    });
    submitForm();

    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
    expect(signUp).toHaveBeenCalledWith({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      password: "s3cret!",
    });
    expect(signIn).toHaveBeenCalledWith({ email: "ada@example.com", password: "s3cret!" });
  });

  it("rejects a short password before any request", () => {
    initRegisterView();

    fill({ firstName: "Ada", lastName: "Lovelace", email: "ada@example.com", password: "abc" });
    submitForm();

    expect(signUp).not.toHaveBeenCalled();
    expect(errorText()).toContain("at least 6 characters");
  });

  it("rejects an email without an @ before any request", () => {
    initRegisterView();

    fill({ firstName: "Ada", lastName: "Lovelace", email: "ada.example.com", password: "s3cret!" });
    submitForm();

    expect(signUp).not.toHaveBeenCalled();
    expect(errorText()).toContain("valid email");
  });

  it("shows a conflict message when the backend rejects the email", async () => {
    signUp.mockRejectedValueOnce(new ApiError("http", "HTTP 409"));
    initRegisterView();

    fill({ firstName: "Ada", lastName: "Lovelace", email: "ada@example.com", password: "s3cret!" });
    submitForm();

    await vi.waitFor(() => {
      expect(errorText()).toContain("already registered");
    });
    expect(submitButton().disabled).toBe(false);
    expect(signIn).not.toHaveBeenCalled();
  });
});
