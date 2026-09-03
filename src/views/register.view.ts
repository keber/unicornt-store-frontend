import { requireElementOfType } from "@/lib/dom";
import { signIn, signUp } from "@/services/auth.service";
import { authErrorMessage, messageSlot, runSubmit } from "@/views/authForm";

/**
 * Wires the sign-up form. Expected markup inside `root`:
 *
 * ```html
 * <form id="register-form">
 *   <input id="register-firstName" name="firstName" />
 *   <input id="register-lastName" name="lastName" />
 *   <input id="register-email" name="email" type="email" />
 *   <input id="register-password" name="password" type="password" />
 *   <p id="register-error" hidden></p>
 *   <button id="register-submit" type="submit">Create account</button>
 * </form>
 * ```
 *
 * On success it signs the new account in straight away (the register endpoint
 * issues no token) and calls `onSuccess`. Every failure is shown in
 * `#register-error` via `textContent`.
 */
export interface RegisterViewOptions {
  readonly root?: ParentNode;
  readonly onSuccess?: () => void;
}

const IDLE_LABEL = "Create account";
const BUSY_LABEL = "Creating account...";
const MIN_PASSWORD_LENGTH = 6;

export function initRegisterView(options: RegisterViewOptions = {}): void {
  const root = options.root ?? document;
  const form = requireElementOfType("#register-form", HTMLFormElement, root);
  const firstName = requireElementOfType("#register-firstName", HTMLInputElement, form);
  const lastName = requireElementOfType("#register-lastName", HTMLInputElement, form);
  const email = requireElementOfType("#register-email", HTMLInputElement, form);
  const password = requireElementOfType("#register-password", HTMLInputElement, form);
  const submit = requireElementOfType("#register-submit", HTMLButtonElement, form);
  const error = messageSlot("#register-error", form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    error.clear();

    const input = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      password: password.value,
    };

    const localError = validate(input);
    if (localError !== null) {
      error.show(localError);
      return;
    }

    runSubmit(
      submit,
      { idle: IDLE_LABEL, busy: BUSY_LABEL },
      async () => {
        await signUp(input);
        await signIn({ email: input.email, password: input.password });
        options.onSuccess?.();
      },
      (cause) => {
        error.show(
          authErrorMessage(cause, "That email is already registered, or the data was rejected."),
        );
      },
    );
  });
}

function validate(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): string | null {
  if (input.firstName.length === 0 || input.lastName.length === 0) {
    return "Enter your first and last name.";
  }
  if (!input.email.includes("@")) {
    return "Enter a valid email address.";
  }
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    return `The password must be at least ${String(MIN_PASSWORD_LENGTH)} characters long.`;
  }
  return null;
}
