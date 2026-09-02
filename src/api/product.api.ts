import { apiFetch } from "@/api/http";

/**
 * Catalog transport. The product list now comes from the real backend
 * (`GET /api/v1/products` on Spring Boot + PostgreSQL) through the shared
 * {@link apiFetch}; the former `public/data/products.json` mock is kept only as a
 * Vitest fixture, no longer a primary source.
 *
 * This layer only performs the HTTP call and returns the body as `unknown`. It
 * knows nothing about `ProductDto` or `ProductModel` — that belongs to
 * `product.service.ts`.
 */
export async function fetchProductsPayload(): Promise<unknown> {
  return apiFetch("/api/v1/products");
}
