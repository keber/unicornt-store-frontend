import {
  createProductRequest,
  deleteProductRequest,
  fetchProductsPayload,
  updateProductRequest,
  type ProductWritePayload,
} from "@/api/product.api";
import { ApiError } from "@/api/errors";
import { isProductDto, isProductPageDto, toProductModel } from "@/models/product.dto";
import type { ProductModel } from "@/models/product.model";

export interface ProductQuery {
  readonly category?: string;
  readonly q?: string;
}

/**
 * Service layer: orchestrates the API call, runtime validation of the paginated
 * envelope and the DTO -> model mapping. Views and components import this, never
 * `fetch` or the DTO directly.
 */
export async function fetchProducts(query: ProductQuery = {}): Promise<ProductModel[]> {
  const payload = await fetchProductsPayload(query);

  if (!isProductPageDto(payload)) {
    throw new ApiError(
      "invalid-payload",
      "The catalog response does not have the expected product-page shape.",
    );
  }

  return payload.content.map(toProductModel);
}

function parseProduct(payload: unknown): ProductModel {
  if (!isProductDto(payload)) {
    throw new ApiError("invalid-payload", "The product response does not have the expected shape.");
  }
  return toProductModel(payload);
}

/** Admin: create a product. The bearer token is attached by the shared client. */
export async function createProduct(payload: ProductWritePayload): Promise<ProductModel> {
  return parseProduct(await createProductRequest(payload));
}

/** Admin: replace a product. */
export async function updateProduct(id: number, payload: ProductWritePayload): Promise<ProductModel> {
  return parseProduct(await updateProductRequest(id, payload));
}

/** Admin: delete a product. Resolves on a 204. */
export async function deleteProduct(id: number): Promise<void> {
  await deleteProductRequest(id);
}
