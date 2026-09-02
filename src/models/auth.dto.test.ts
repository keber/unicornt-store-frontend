import { describe, expect, it } from "vitest";
import { isAccountDto, isTokenDto, toAuthUser } from "@/models/auth.dto";

describe("isTokenDto", () => {
  it("accepts a well-formed token payload", () => {
    expect(isTokenDto({ token: "jwt", expiresIn: 3_600_000 })).toBe(true);
  });

  it("rejects a missing or empty token and a non-numeric lifetime", () => {
    expect(isTokenDto({ token: "", expiresIn: 1 })).toBe(false);
    expect(isTokenDto({ token: "jwt" })).toBe(false);
    expect(isTokenDto({ token: "jwt", expiresIn: "soon" })).toBe(false);
    expect(isTokenDto(null)).toBe(false);
  });
});

describe("isAccountDto", () => {
  const account = {
    id: 7,
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    roles: ["ROLE_USER"],
  };

  it("accepts a well-formed account payload", () => {
    expect(isAccountDto(account)).toBe(true);
  });

  it("rejects a bad id, blank fields or a non-string role", () => {
    expect(isAccountDto({ ...account, id: 1.5 })).toBe(false);
    expect(isAccountDto({ ...account, email: "" })).toBe(false);
    expect(isAccountDto({ ...account, roles: [1] })).toBe(false);
    expect(isAccountDto({ ...account, roles: "ROLE_USER" })).toBe(false);
    expect(isAccountDto("nope")).toBe(false);
  });
});

describe("toAuthUser", () => {
  it("maps the DTO to a model with a copied roles array", () => {
    const roles = ["ROLE_USER", "ROLE_ADMIN"];
    const user = toAuthUser({
      id: 7,
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      roles,
    });

    expect(user).toEqual({
      id: 7,
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      roles: ["ROLE_USER", "ROLE_ADMIN"],
    });
    expect(user.roles).not.toBe(roles);
  });
});
