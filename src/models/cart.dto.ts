import type { CartItemModel, CartModel } from "@/models/cart.model";

/**
 * One priced line exactly as `GET /api/v1/cart` and `POST /api/v1/cart/merge`
 * return it (`CartItemResponse`). Quantities are named `quantity` (never `qty`);
 * money is a whole-CLP integer.
 */
export interface CartItemDto {
  readonly productId: number;
  readonly productName: string;
  readonly imageBase: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly subtotal: number;
}

/** The authenticated user's cart as the backend returns it (`CartResponse`). */
export interface CartDto {
  readonly items: readonly CartItemDto[];
  readonly itemCount: number;
  readonly total: number;
}

/** One line of the local cart sent up in a `POST /api/v1/cart/merge` body. */
export interface CartMergeItem {
  readonly productId: number;
  readonly quantity: number;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function isCartItemDto(value: unknown): value is CartItemDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    isPositiveInteger(item.productId) &&
    isPositiveInteger(item.quantity) &&
    typeof item.productName === "string" &&
    typeof item.imageBase === "string" &&
    isNonNegativeNumber(item.unitPrice) &&
    isNonNegativeNumber(item.subtotal)
  );
}

export function isCartDto(value: unknown): value is CartDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const cart = value as Record<string, unknown>;
  return (
    Array.isArray(cart.items) &&
    cart.items.every(isCartItemDto) &&
    isNonNegativeNumber(cart.itemCount) &&
    isNonNegativeNumber(cart.total)
  );
}

/**
 * Maps the backend cart onto the app's {@link CartModel}. The model keeps the
 * legacy `{ id, qty }` field names so `storage/cart.storage.ts`, `cart.view.ts`
 * and `CartPanel` consume it unchanged; the mapper bridges the two shapes.
 */
export function toCartModel(dto: CartDto): CartModel {
  const items: CartItemModel[] = dto.items.map((item) => ({
    id: item.productId,
    qty: item.quantity,
  }));
  return { items };
}

/** Builds the `merge` request lines from the local (anonymous) cart. */
export function toMergeItems(localItems: readonly CartItemModel[]): CartMergeItem[] {
  return localItems.map((item) => ({ productId: item.id, quantity: item.qty }));
}
