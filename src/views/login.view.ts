import { ApiError } from "@/api/errors";
import { requireElement, requireElementOfType } from "@/lib/dom";
import { signIn } from "@/services/auth.service";

/**
 * Wires the sign-in form. Expected markup inside `root`:
 *
 * ```html
 * <form id="login-form">
 *   <input id="login-email" name="email" type="email" />
 *   <input id="login-password" name="password" type="password" />
 *   <p id="login-error" hidden></p>
 *   <button id="login-submit" type="submit">Sign in</button>
 * </form>
 * ```
 *
 * The submit handler calls `preventDefault`, disables the button while the
 * request is in flight, and always writes any failure into `#login-error` with
 * `textContent` (never `innerHTML`), so an invalid login is visible in the UI.
 */
export interface LoginViewOptions {
  readonly root?: ParentNode;
  readonly onSuccess?: () => void;
}

const IDLE_LABEL = "Sign in";
const BUSY_LABEL = "Signing in...";

export function initLoginView(options: LoginViewOptions = {}): void {
  const root = options.root ?? document;
  const form = requireElementOfType("#login-form", HTMLFormElement, root);
  const email = requireElementOfType("#login-email", HTMLInputElement, form);
  const password = requireElementOfType("#login-password", HTMLInputElement, form);
  const submit = requireElementOfType("#login-submit", HTMLButtonElement, form);
  const error = requireElement("#login-error", form);

  const showError = (message: string): void => {
    error.textContent = message;
    error.removeAttribute("hidden");
  };
  const clearError = (): void => {
    error.textContent = "";
    error.setAttribute("hidden", "");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    const credentials = { email: email.value.trim(), password: password.value };
    if (credentials.email.length === 0 || credentials.password.length === 0) {
      showError("Enter your email and password.");
      return;
    }

    void (async () => {
      submit.disabled = true;
      submit.setAttribute("aria-busy", "true");
      submit.textContent = BUSY_LABEL;
      try {
        await signIn(credentials);
        options.onSuccess?.();
      } catch (cause) {
        showError(messageFor(cause));
      } finally {
        submit.disabled = false;
        submit.removeAttribute("aria-busy");
        submit.textContent = IDLE_LABEL;
      }
    })();
  });
}

function messageFor(cause: unknown): string {
  if (cause instanceof ApiError) {
    if (cause.reason === "http") {
      return "Email or password is incorrect.";
    }
    if (cause.reason === "network") {
      return "Could not reach the store. Check your connection and try again.";
    }
  }
  return "Something went wrong. Please try again.";
}
