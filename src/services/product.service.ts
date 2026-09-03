import { ApiError } from "@/api/errors";
import type { ProductWritePayload } from "@/api/product.api";
import { httpProductGateway, type ProductGateway } from "@/gateways/product.gateway";
import { isProductDto, isProductPageDto, toProductModel } from "@/models/product.dto";
import type { ProductModel } from "@/models/product.model";

export interface ProductQuery {
  readonly category?: string;
  readonly q?: string;
}

/**
 * Service layer: orchestrates the gateway call, runtime validation and the
 * DTO -> model mapping. It depends on the {@link ProductGateway} port, never on the
 * concrete `api/` module; `httpProductGateway` is the default, a fake drives it in
 * tests. Views import this, never `fetch` or the DTO directly.
 */
export async function fetchProducts(
  query: ProductQuery = {},
  gateway: ProductGateway = httpProductGateway,
): Promise<ProductModel[]> {
  const payload = await gateway.list(query);

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
export async function createProduct(
  payload: ProductWritePayload,
  gateway: ProductGateway = httpProductGateway,
): Promise<ProductModel> {
  return parseProduct(await gateway.create(payload));
}

/** Admin: replace a product. */
export async function updateProduct(
  id: number,
  payload: ProductWritePayload,
  gateway: ProductGateway = httpProductGateway,
): Promise<ProductModel> {
  return parseProduct(await gateway.update(id, payload));
}

/** Admin: delete a product. Resolves on a 204. */
export async function deleteProduct(
  id: number,
  gateway: ProductGateway = httpProductGateway,
): Promise<void> {
  await gateway.remove(id);
}
