import {
  createProductRequest,
  deleteProductRequest,
  fetchProductsPayload,
  updateProductRequest,
  type ProductQueryParams,
  type ProductWritePayload,
} from "@/api/product.api";

/**
 * Port the catalog / admin service depends on, instead of importing the concrete
 * `api/product.api` module. Every method returns the raw body as `unknown`; the
 * service validates and maps. This is the minimal port extraction PLAN section 1
 * asks for &mdash; not a full hexagonal frontend.
 */
export interface ProductGateway {
  list(query?: ProductQueryParams): Promise<unknown>;
  create(payload: ProductWritePayload): Promise<unknown>;
  update(id: number, payload: ProductWritePayload): Promise<unknown>;
  remove(id: number): Promise<unknown>;
}

/** The production implementation: the real HTTP calls through the shared `apiFetch`. */
export const httpProductGateway: ProductGateway = {
  list: (query = {}) => fetchProductsPayload(query),
  create: (payload) => createProductRequest(payload),
  update: (id, payload) => updateProductRequest(id, payload),
  remove: (id) => deleteProductRequest(id),
};
