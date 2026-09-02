import { fetchProductsPayload } from "@/api/product.api";
import { ApiError } from "@/api/errors";
import { isProductPageDto, toProductModel } from "@/models/product.dto";
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
