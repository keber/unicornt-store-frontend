import { apiFetch } from "@/api/http";

export interface ProductQueryParams {
  readonly category?: string;
  readonly q?: string;
}

/**
 * Catalog transport. The product list comes from the real backend
 * (`GET /api/v1/products` on Spring Boot + PostgreSQL) through the shared
 * {@link apiFetch}; the former `public/data/products.json` mock is no longer a
 * source.
 *
 * This layer only performs the HTTP call and returns the body as `unknown`. It
 * knows nothing about `ProductDto` or `ProductModel`.
 */
export async function fetchProductsPayload(query: ProductQueryParams = {}): Promise<unknown> {
  const params = new URLSearchParams();
  if (query.category !== undefined && query.category.trim().length > 0) {
    params.set("category", query.category.trim());
  }
  if (query.q !== undefined && query.q.trim().length > 0) {
    params.set("q", query.q.trim());
  }
  const suffix = params.toString();
  return apiFetch(suffix.length > 0 ? `/api/v1/products?${suffix}` : "/api/v1/products");
}
