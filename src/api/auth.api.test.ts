import { afterEach, describe, expect, it, vi } from "vitest";
import { setAuthTokenProvider } from "@/api/http";
import { loginRequest, meRequest, registerRequest } from "@/api/auth.api";

afterEach(() => {
  vi.unstubAllGlobals();
  setAuthTokenProvider(() => null);
});

function stubFetch(): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ ok: 1 }),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("auth.api", () => {
  it("POSTs the credentials to /api/v1/auth/login", async () => {
    const fetchMock = stubFetch();

    await loginRequest({ email: "ada@example.com", password: "s3cret!" });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://localhost:8080/api/v1/auth/login");
    expect(init.method).toBe("POST");
    expect(init.body).toBe('{"email":"ada@example.com","password":"s3cret!"}');
  });

  it("POSTs the profile to /api/v1/auth/register", async () => {
    const fetchMock = stubFetch();

    await registerRequest({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      password: "s3cret!",
    });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://localhost:8080/api/v1/auth/register");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      password: "s3cret!",
    });
  });

  it("GETs /api/v1/auth/me", async () => {
    const fetchMock = stubFetch();

    await meRequest();

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://localhost:8080/api/v1/auth/me");
    expect(init.method).toBe("GET");
  });
});
