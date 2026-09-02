import { ApiError } from "@/api/errors";
import { setAuthTokenProvider } from "@/api/http";
import { loginRequest, meRequest, registerRequest } from "@/api/auth.api";
import { isAccountDto, isTokenDto, toAuthUser, type TokenDto } from "@/models/auth.dto";
import type { AuthUser, LoginInput, RegisterInput } from "@/models/auth.model";
import { clearAuthToken, readAuthToken, writeAuthToken } from "@/storage/auth.storage";

/**
 * Auth orchestration: API call, runtime validation and DTO -> model mapping.
 * It is the only module that binds the token storage to the shared HTTP client
 * (through {@link setAuthTokenProvider}), so every authenticated request across
 * the app carries the bearer header without any per-call code.
 */
setAuthTokenProvider(() => readAuthToken());

export interface AuthChange {
  readonly type: "login" | "logout";
}
type AuthChangeListener = (change: AuthChange) => void;

const listeners = new Set<AuthChangeListener>();

/**
 * Subscribe to sign-in / sign-out. Other slices use it to react to a fresh
 * session (e.g. the cart merge after a login). Returns an unsubscribe function.
 */
export function onAuthChange(listener: AuthChangeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit(change: AuthChange): void {
  for (const listener of [...listeners]) {
    listener(change);
  }
}

/** Whether a token is currently stored. Not a claim that the token is still valid server-side. */
export function isAuthenticated(): boolean {
  return readAuthToken() !== null;
}

/** Exchanges credentials for a token, stores it and notifies subscribers. */
export async function signIn(input: LoginInput): Promise<TokenDto> {
  const payload = await loginRequest(input);
  if (!isTokenDto(payload)) {
    throw new ApiError("invalid-payload", "The login response does not have the expected shape.");
  }
  writeAuthToken(payload.token);
  emit({ type: "login" });
  return payload;
}

/**
 * Creates an account. The backend returns the account (no token), so the caller
 * still has to {@link signIn} afterwards.
 */
export async function signUp(input: RegisterInput): Promise<AuthUser> {
  const payload = await registerRequest(input);
  if (!isAccountDto(payload)) {
    throw new ApiError("invalid-payload", "The register response does not have the expected shape.");
  }
  return toAuthUser(payload);
}

/** Drops the session locally and notifies subscribers. */
export function signOut(): void {
  clearAuthToken();
  emit({ type: "logout" });
}

/** Resolves the current account from `GET /api/v1/auth/me`. */
export async function fetchCurrentUser(): Promise<AuthUser> {
  const payload = await meRequest();
  if (!isAccountDto(payload)) {
    throw new ApiError("invalid-payload", "The account response does not have the expected shape.");
  }
  return toAuthUser(payload);
}
