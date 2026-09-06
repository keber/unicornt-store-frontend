import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  AUTH_TOKEN_STORAGE_KEY,
  clearAuthToken,
  readAuthToken,
  writeAuthToken,
} from "@/storage/auth.storage";

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  localStorage.clear();
});

describe("auth.storage", () => {
  it("returns null when no token is stored", () => {
    expect(readAuthToken()).toBeNull();
  });

  it("round-trips a token through localStorage under the documented key", () => {
    writeAuthToken("jwt-abc");

    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe("jwt-abc");
    expect(readAuthToken()).toBe("jwt-abc");
  });

  it("treats an empty stored value as no token", () => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, "");
    expect(readAuthToken()).toBeNull();
  });

  it("clears the stored token", () => {
    writeAuthToken("jwt-abc");
    clearAuthToken();

    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBeNull();
    expect(readAuthToken()).toBeNull();
  });
});
