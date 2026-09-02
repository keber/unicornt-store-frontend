import type { AuthUser } from "@/models/auth.model";

/** Body of `POST /api/v1/auth/login` on success (`TokenResponse`). */
export interface TokenDto {
  readonly token: string;
  readonly expiresIn: number;
}

/** Body of `GET /api/v1/auth/me` and of the `201` from `POST /api/v1/auth/register` (`MeResponse`). */
export interface AccountDto {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly roles: string[];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export function isTokenDto(value: unknown): value is TokenDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const t = value as Record<string, unknown>;
  return isNonEmptyString(t.token) && typeof t.expiresIn === "number" && Number.isFinite(t.expiresIn);
}

export function isAccountDto(value: unknown): value is AccountDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const a = value as Record<string, unknown>;
  return (
    typeof a.id === "number" &&
    Number.isInteger(a.id) &&
    isNonEmptyString(a.firstName) &&
    isNonEmptyString(a.lastName) &&
    isNonEmptyString(a.email) &&
    Array.isArray(a.roles) &&
    a.roles.every(isNonEmptyString)
  );
}

/** Bridges the wire DTO to the domain-facing {@link AuthUser} model. */
export function toAuthUser(dto: AccountDto): AuthUser {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    roles: [...dto.roles],
  };
}
