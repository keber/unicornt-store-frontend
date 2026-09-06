import type { ProductModel } from "@/models/product.model";

/**
 * A product exactly as the backend returns it from
 * `GET /api/v1/products` (the `ProductResponse` record). It is validated with
 * {@link isProductDto} before the rest of the app trusts it; `unknown` is never
 * consumed directly.
 */
export interface ProductDto {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly imageBase: string;
  readonly price: number;
  readonly categoryId: number;
  readonly categoryName: string;
  readonly productTypeId: number;
  readonly productTypeName: string;
  readonly stock: number;
  readonly active: boolean;
}

/** The paginated envelope returned by `GET /api/v1/products` (`ProductPageResponse`). */
export interface ProductPageDto {
  readonly content: ProductDto[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

/**
 * Structural type guard: no `as`, validated field by field. A payload that fails
 * any check is rejected whole (see product.service.ts) rather than letting a
 * half-typed product through.
 */
export function isProductDto(value: unknown): value is ProductDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const c = value as Record<string, unknown>;
  return (
    isPositiveInteger(c.id) &&
    isNonEmptyString(c.name) &&
    isString(c.description) &&
    isString(c.imageBase) &&
    typeof c.price === "number" &&
    Number.isFinite(c.price) &&
    c.price >= 0 &&
    isPositiveInteger(c.categoryId) &&
    isNonEmptyString(c.categoryName) &&
    isPositiveInteger(c.productTypeId) &&
    isNonEmptyString(c.productTypeName) &&
    isNonNegativeInteger(c.stock) &&
    typeof c.active === "boolean"
  );
}

export function isProductDtoArray(value: unknown): value is ProductDto[] {
  return Array.isArray(value) && value.every(isProductDto);
}

export function isProductPageDto(value: unknown): value is ProductPageDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const c = value as Record<string, unknown>;
  return (
    isProductDtoArray(c.content) &&
    isNonNegativeInteger(c.page) &&
    isNonNegativeInteger(c.size) &&
    isNonNegativeInteger(c.totalElements) &&
    isNonNegativeInteger(c.totalPages)
  );
}

/** Bridges a validated {@link ProductDto} to the {@link ProductModel} the app uses. */
export function toProductModel(dto: ProductDto): ProductModel {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.categoryName,
    categoryId: dto.categoryId,
    subcategory: dto.productTypeName,
    price: dto.price,
    description: dto.description,
    image: dto.imageBase,
    stock: dto.stock,
    active: dto.active,
  };
}
