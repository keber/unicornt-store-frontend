import { apiFetch } from "@/api/http";

export interface ProductQueryParams {
  readonly category?: string;
  readonly q?: string;
}

/**
 * Catalog transport. The product list comes from the real backend
 * (`GET /api/v1/products` on Spring Boot + PostgreSQL) through the shared
 * {@link apiFetch}; the former `public/data/products.json` mock is no longer a
 * source. Write calls carry the bearer token automatically (see `src/api/http.ts`).
 *
 * This layer only performs the HTTP call and returns the body as `unknown`.
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

/** Body accepted by `POST` and `PUT /api/v1/products` (the `ProductCreate/UpdateRequest`). */
export interface ProductWritePayload {
  readonly name: string;
  readonly description: string;
  readonly imageBase: string;
  readonly price: number;
  readonly categoryId: number;
  readonly productTypeId: number;
  readonly stock: number;
  readonly active: boolean;
}

export async function createProductRequest(payload: ProductWritePayload): Promise<unknown> {
  return apiFetch("/api/v1/products", { method: "POST", body: payload });
}

export async function updateProductRequest(
  id: number,
  payload: ProductWritePayload,
): Promise<unknown> {
  return apiFetch(`/api/v1/products/${String(id)}`, { method: "PUT", body: payload });
}

export async function deleteProductRequest(id: number): Promise<unknown> {
  return apiFetch(`/api/v1/products/${String(id)}`, { method: "DELETE" });
}
