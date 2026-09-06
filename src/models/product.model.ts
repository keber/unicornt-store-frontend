/**
 * Domain model of a catalog product: the shape the rest of the app consumes once a
 * {@link ProductDto} from the backend has passed validation and `toProductModel`.
 *
 * This module has no dependency on `product.dto.ts` — that reverses the H3 leak
 * flagged in the frontend diagnosis. The DTO module imports this one and owns the
 * mapper.
 */
export interface ProductModel {
  readonly id: number;
  readonly name: string;
  /** Category display name from the backend, e.g. "Unicorns". */
  readonly category: string;
  /** Product-type display name from the backend, e.g. "T-shirt". */
  readonly subcategory: string;
  readonly price: number;
  readonly description: string;
  /** Base image name without extension, as stored by the backend. */
  readonly image: string;
  /** Backend fields carried through for the storefront; optional for legacy fixtures. */
  readonly categoryId?: number;
  readonly stock?: number;
  readonly active?: boolean;
}

/** Physical suffixes produced by scripts/process-images.js (see Stage 1). */
export const PRODUCT_IMAGE_VARIANTS = {
  detail: "",
  card: "-card",
  thumb: "-thumb",
} as const;
export type ProductImageVariant = keyof typeof PRODUCT_IMAGE_VARIANTS;

export function productImageSrc(product: ProductModel, variant: ProductImageVariant): string {
  return `${product.image}${PRODUCT_IMAGE_VARIANTS[variant]}.webp`;
}

/** True when the product is offered in the storefront and has at least one unit. */
export function isPurchasable(product: ProductModel): boolean {
  return product.active !== false && (product.stock ?? 1) > 0;
}
