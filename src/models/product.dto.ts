import {
  isProductCategory,
  isProductSubcategory,
  type ProductCategory,
  type ProductSubcategory,
} from "@/models/product.model";

/**
 * Forma de un producto tal como llega desde /data/products.json (Etapa 3)
 * o, a futuro, desde el endpoint REST del backend (Hito 4). Se valida con
 * isProductDto() antes de confiar en ella; nunca se consume "unknown"
 * directamente en el resto de la app.
 */
export interface ProductDto {
  readonly id: number;
  readonly name: string;
  readonly category: ProductCategory;
  readonly subcategory: ProductSubcategory;
  readonly price: number;
  readonly description: string;
  readonly image: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Type guard estructural: no usa `as`, valida campo por campo. Un payload
 * que falle cualquier chequeo se rechaza completo (ver
 * product.service.ts) en vez de dejar pasar un producto a medio tipar.
 */
export function isProductDto(value: unknown): value is ProductDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    isFiniteNumber(candidate.id) &&
    Number.isInteger(candidate.id) &&
    candidate.id > 0 &&
    isNonEmptyString(candidate.name) &&
    isProductCategory(candidate.category) &&
    isProductSubcategory(candidate.subcategory) &&
    isFiniteNumber(candidate.price) &&
    candidate.price >= 0 &&
    isNonEmptyString(candidate.description) &&
    isNonEmptyString(candidate.image)
  );
}

export function isProductDtoArray(value: unknown): value is ProductDto[] {
  return Array.isArray(value) && value.every(isProductDto);
}
