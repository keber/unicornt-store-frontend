/**
 * The one place that persists the access token. Every other module reads it
 * through `readAuthToken` / writes it through `writeAuthToken`; nothing else
 * touches `localStorage` for authentication.
 *
 * `localStorage` access is guarded so the module is safe to import in a
 * non-browser context (unit tests without jsdom, SSR): a failure degrades to an
 * in-memory value instead of throwing.
 */

export const AUTH_TOKEN_STORAGE_KEY = "unicornt.auth.token";

let memoryFallback: string | null = null;

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** The stored bearer token, or `null` when the visitor is not signed in. */
export function readAuthToken(): string | null {
  const store = storage();
  if (store === null) {
    return memoryFallback;
  }
  try {
    const value = store.getItem(AUTH_TOKEN_STORAGE_KEY);
    return value !== null && value.length > 0 ? value : null;
  } catch {
    return memoryFallback;
  }
}

/** Persists the bearer token issued by `POST /api/v1/auth/login`. */
export function writeAuthToken(token: string): void {
  memoryFallback = token;
  const store = storage();
  if (store === null) {
    return;
  }
  try {
    store.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } catch {
    // keep the in-memory fallback
  }
}

/** Drops the stored token (sign-out, or a `401` that invalidated the session). */
export function clearAuthToken(): void {
  memoryFallback = null;
  const store = storage();
  if (store === null) {
    return;
  }
  try {
    store.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    // nothing else to do
  }
}
