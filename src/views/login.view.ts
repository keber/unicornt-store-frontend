import { requireElementOfType } from "@/lib/dom";
import { signIn } from "@/services/auth.service";
import { authErrorMessage, messageSlot, runSubmit } from "@/views/authForm";

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
  const error = messageSlot("#login-error", form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.clear();

    const credentials = { email: email.value.trim(), password: password.value };
    if (credentials.email.length === 0 || credentials.password.length === 0) {
      error.show("Enter your email and password.");
      return;
    }

    runSubmit(
      submit,
      { idle: IDLE_LABEL, busy: BUSY_LABEL },
      async () => {
        await signIn(credentials);
        options.onSuccess?.();
      },
      (cause) => {
        error.show(authErrorMessage(cause, "Email or password is incorrect."));
      },
    );
  });
}
