/**
 * Item de carrito. Se mantienen los nombres de campo (`id`/`qty`) y la
 * forma de almacenamiento (array plano) que ya usa
 * localStorage["unicornt_cart"] (ver docs/etapa-1-baseline.md) para que
 * el carrito de un usuario real no se pierda al migrar: cart.storage.ts
 * valida esta forma en vez de introducir un esquema nuevo que obligue a
 * una migracion de datos.
 */
export interface CartItemModel {
  readonly id: number;
  readonly qty: number;
}

/**
 * Modelo de dominio del carrito completo. Envuelve los items en un
 * objeto (en vez de exponer el array suelto) para poder agregar campos
 * derivados a futuro (p.ej. `updatedAt`) sin cambiar la firma de
 * CartModel en el resto de la app.
 */
export interface CartModel {
  readonly items: readonly CartItemModel[];
}

export const EMPTY_CART: CartModel = { items: [] };

function isFinitePositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export function isCartItemModel(value: unknown): value is CartItemModel {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return isFinitePositiveInteger(candidate.id) && isFinitePositiveInteger(candidate.qty);
}

export function isCartItemModelArray(value: unknown): value is CartItemModel[] {
  return Array.isArray(value) && value.every(isCartItemModel);
}
