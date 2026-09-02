import { apiFetch } from "@/api/http";
import type { LoginInput, RegisterInput } from "@/models/auth.model";

/**
 * Authentication transport. Every call goes through the shared {@link apiFetch}
 * (base URL, JSON headers, bearer token, `401` handling) and returns the body as
 * `unknown`; this layer knows nothing about `TokenDto` / `AccountDto`.
 */

export function loginRequest(input: LoginInput): Promise<unknown> {
  return apiFetch("/api/v1/auth/login", {
    method: "POST",
    body: { email: input.email, password: input.password },
  });
}

export function registerRequest(input: RegisterInput): Promise<unknown> {
  return apiFetch("/api/v1/auth/register", {
    method: "POST",
    body: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
    },
  });
}

export function meRequest(): Promise<unknown> {
  return apiFetch("/api/v1/auth/me");
}
