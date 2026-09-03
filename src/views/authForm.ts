import { ApiError } from "@/api/errors";
import { requireElement } from "@/lib/dom";

/**
 * Shared plumbing for the login and register forms: a message slot, the submit
 * button lifecycle and the {@link ApiError} -> user-message mapping. Both views
 * wire identical behaviour, so it lives here once.
 */

/** A hidden-toggling text slot for form-level messages. Writes via `textContent`, never `innerHTML`. */
export interface MessageSlot {
  show(message: string): void;
  clear(): void;
}

/** Resolves `selector` inside `root` and returns handlers that show / hide it as an error line. */
export function messageSlot(selector: string, root: ParentNode): MessageSlot {
  const el = requireElement(selector, root);
  return {
    show(message: string): void {
      el.textContent = message;
      el.removeAttribute("hidden");
    },
    clear(): void {
      el.textContent = "";
      el.setAttribute("hidden", "");
    },
  };
}

/** Button captions for the idle and in-flight states. */
export interface BusyLabels {
  readonly idle: string;
  readonly busy: string;
}

/**
 * Runs an async submit with the standard button lifecycle: `disabled` +
 * `aria-busy` + the busy caption while the request is in flight, all restored in
 * a `finally`. A rejection is handed to `onError`; it never escapes.
 */
export function runSubmit(
  button: HTMLButtonElement,
  labels: BusyLabels,
  task: () => Promise<void>,
  onError: (cause: unknown) => void,
): void {
  void (async () => {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = labels.busy;
    try {
      await task();
    } catch (cause) {
      onError(cause);
    } finally {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.textContent = labels.idle;
    }
  })();
}

/**
 * Maps a failure to a user-facing message. The HTTP-error text is caller-specific
 * (wrong credentials vs. taken email), so it is passed in; the network and
 * unknown cases are shared.
 */
export function authErrorMessage(cause: unknown, httpMessage: string): string {
  if (cause instanceof ApiError) {
    if (cause.reason === "http") {
      return httpMessage;
    }
    if (cause.reason === "network") {
      return "Could not reach the store. Check your connection and try again.";
    }
  }
  return "Something went wrong. Please try again.";
}
