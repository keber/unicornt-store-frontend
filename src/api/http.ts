import { ApiError } from "@/api/errors";

/**
 * Shared HTTP client for every call to the Unicorn't Store backend.
 *
 * One place owns: the base URL (from `VITE_API_BASE_URL`), JSON headers, the
 * bearer token when one is stored, and the translation of a failed request into a
 * typed {@link ApiError}. Feature `*.api.ts` modules call `apiFetch` and return
 * `unknown`; they never touch `fetch`, headers or status codes directly.
 */

const DEFAULT_BASE_URL = "http://localhost:8080";

/** Absolute base URL of the REST API, without a trailing slash. */
export function apiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL;
  let base = typeof configured === "string" && configured.trim().length > 0 ? configured.trim() : DEFAULT_BASE_URL;
  while (base.endsWith("/")) {
    base = base.slice(0, -1);
  }
  return base;
}

/** Overridable hook so the auth slice can plug in its token storage. */
let tokenProvider: () => string | null = () => null;

export function setAuthTokenProvider(provider: () => string | null): void {
  tokenProvider = provider;
}

export interface ApiFetchOptions {
  readonly method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  readonly body?: unknown;
  readonly headers?: Record<string, string>;
  readonly signal?: AbortSignal;
}

/**
 * Perform a request against `path` (which must start with `/`) and return the
 * parsed JSON body as `unknown`. Throws {@link ApiError} on a network failure, a
 * non-2xx status or a body that is not valid JSON. A `204 No Content` resolves to
 * `null`.
 */
export async function apiFetch(path: string, options: ApiFetchOptions = {}): Promise<unknown> {
  const { method = "GET", body, headers = {}, signal } = options;

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };
  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }
  const token = tokenProvider();
  if (token !== null && token.length > 0) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const init: RequestInit = { method, headers: requestHeaders };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }
  if (signal !== undefined) {
    init.signal = signal;
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, init);
  } catch (cause) {
    throw new ApiError("network", "Could not reach the store backend.", { cause });
  }

  if (response.status === 401) {
    throw new ApiError("http", "The session is invalid or has expired (HTTP 401).");
  }
  if (!response.ok) {
    throw new ApiError("http", `The backend responded with an error (HTTP ${String(response.status)}).`);
  }
  if (response.status === 204) {
    return null;
  }

  try {
    return (await response.json()) as unknown;
  } catch (cause) {
    throw new ApiError("invalid-json", "The backend response is not valid JSON.", { cause });
  }
}
