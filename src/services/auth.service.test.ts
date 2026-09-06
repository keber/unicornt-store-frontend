import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";

const { loginRequest, registerRequest, meRequest } = vi.hoisted(() => ({
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
  meRequest: vi.fn(),
}));

vi.mock("@/api/auth.api", () => ({ loginRequest, registerRequest, meRequest }));

const { apiFetch, setAuthTokenProvider } = await import("@/api/http");
const { signIn, signUp, signOut, isAuthenticated, fetchCurrentUser, onAuthChange } =
  await import("@/services/auth.service");
const { readAuthToken } = await import("@/storage/auth.storage");

// The service registers this provider on import; re-assert it per test so a
// reset in another suite cannot leak in.
beforeEach(() => {
  setAuthTokenProvider(() => readAuthToken());
});

const account = {
  id: 7,
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  roles: ["ROLE_USER"],
};

beforeEach(() => {
  localStorage.clear();
  loginRequest.mockReset();
  registerRequest.mockReset();
  meRequest.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  setAuthTokenProvider(() => null);
});

describe("signIn", () => {
  it("stores the token, reports it as authenticated and notifies subscribers", async () => {
    loginRequest.mockResolvedValueOnce({ token: "jwt-123", expiresIn: 3_600_000 });
    const changes: string[] = [];
    onAuthChange((c) => changes.push(c.type));

    const result = await signIn({ email: account.email, password: "s3cret!" });

    expect(result).toEqual({ token: "jwt-123", expiresIn: 3_600_000 });
    expect(readAuthToken()).toBe("jwt-123");
    expect(isAuthenticated()).toBe(true);
    expect(changes).toEqual(["login"]);
  });

  it("makes the stored token travel on the next protected request", async () => {
    loginRequest.mockResolvedValueOnce({ token: "jwt-xyz", expiresIn: 1 });
    await signIn({ email: account.email, password: "s3cret!" });

    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({}) });
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/api/v1/auth/me");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer jwt-xyz");
  });

  it("rejects a malformed login response and stores nothing", async () => {
    loginRequest.mockResolvedValueOnce({ token: "" });

    const error = await signIn({ email: account.email, password: "s3cret!" }).catch(
      (e: unknown) => e,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("invalid-payload");
    expect(readAuthToken()).toBeNull();
  });

  it("propagates the HTTP error raised for invalid credentials", async () => {
    loginRequest.mockRejectedValueOnce(new ApiError("http", "HTTP 401"));

    const error = await signIn({ email: account.email, password: "bad" }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("http");
    expect(isAuthenticated()).toBe(false);
  });
});

describe("signUp", () => {
  it("returns the mapped account and does not open a session", async () => {
    registerRequest.mockResolvedValueOnce(account);

    const user = await signUp({
      firstName: "Ada",
      lastName: "Lovelace",
      email: account.email,
      password: "s3cret!",
    });

    expect(user).toEqual(account);
    expect(readAuthToken()).toBeNull();
  });

  it("rejects a malformed register response", async () => {
    registerRequest.mockResolvedValueOnce({ id: "x" });

    const error = await signUp({
      firstName: "Ada",
      lastName: "Lovelace",
      email: account.email,
      password: "s3cret!",
    }).catch((e: unknown) => e);

    expect((error as ApiError).reason).toBe("invalid-payload");
  });
});

describe("signOut", () => {
  it("drops the token and notifies subscribers", async () => {
    loginRequest.mockResolvedValueOnce({ token: "jwt-123", expiresIn: 1 });
    await signIn({ email: account.email, password: "s3cret!" });

    const changes: string[] = [];
    const unsubscribe = onAuthChange((c) => changes.push(c.type));
    signOut();
    unsubscribe();
    signOut();

    expect(readAuthToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
    expect(changes).toEqual(["logout"]);
  });
});

describe("fetchCurrentUser", () => {
  it("maps the /me payload to an AuthUser", async () => {
    meRequest.mockResolvedValueOnce(account);

    await expect(fetchCurrentUser()).resolves.toEqual(account);
  });

  it("rejects a malformed /me payload", async () => {
    meRequest.mockResolvedValueOnce({});

    const error = await fetchCurrentUser().catch((e: unknown) => e);
    expect((error as ApiError).reason).toBe("invalid-payload");
  });
});
