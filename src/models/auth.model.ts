/** The authenticated account as the views consume it. Never imports the DTO type. */
export interface AuthUser {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly roles: readonly string[];
}

/** Credentials collected by the sign-in form. */
export interface LoginInput {
  readonly email: string;
  readonly password: string;
}

/** Data collected by the sign-up form. */
export interface RegisterInput {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}

export const ROLE_ADMIN = "ROLE_ADMIN";

export function isAdmin(user: AuthUser): boolean {
  return user.roles.includes(ROLE_ADMIN);
}

export function fullName(user: AuthUser): string {
  return `${user.firstName} ${user.lastName}`.trim();
}
