import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/errors";

const { fetchCategoriesPayload } = vi.hoisted(() => ({ fetchCategoriesPayload: vi.fn() }));
vi.mock("@/api/category.api", () => ({ fetchCategoriesPayload }));

const { fetchCategories } = await import("@/services/category.service");

describe("fetchCategories", () => {
  it("validates and maps the category array", async () => {
    fetchCategoriesPayload.mockResolvedValueOnce([
      { id: 2, name: "Rainbows", slug: "rainbows" },
      { id: 1, name: "Unicorns", slug: "unicorns" },
    ]);

    const categories = await fetchCategories();

    expect(categories).toEqual([
      { id: 2, name: "Rainbows", slug: "rainbows" },
      { id: 1, name: "Unicorns", slug: "unicorns" },
    ]);
  });

  it("raises ApiError('invalid-payload') on an unexpected shape", async () => {
    fetchCategoriesPayload.mockResolvedValueOnce({ nope: true });

    const error = await fetchCategories().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).reason).toBe("invalid-payload");
  });

  it("propagates a transport ApiError", async () => {
    fetchCategoriesPayload.mockRejectedValueOnce(new ApiError("http", "500"));

    const error = await fetchCategories().catch((e: unknown) => e);
    expect((error as ApiError).reason).toBe("http");
  });
});
