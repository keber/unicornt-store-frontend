import { apiFetch } from "@/api/http";

/**
 * Category transport. `GET /api/v1/categories` on the real backend, through the
 * shared {@link apiFetch}. Returns the body as `unknown`; validation and mapping
 * live in `category.service.ts`.
 */
export async function fetchCategoriesPayload(): Promise<unknown> {
  return apiFetch("/api/v1/categories");
}
