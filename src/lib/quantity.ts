export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

/** Restringe una cantidad al rango [min, max], igual que el selector +/- legado. */
export function clampQuantity(value: number, min = MIN_QUANTITY, max = MAX_QUANTITY): number {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

/**
 * Convierte el `.value` (string) de un <input type="number"> a una
 * cantidad valida, sin confiar en que el navegador ya la valido: un
 * valor vacio, no numerico o fuera de rango cae al minimo/maximo mas
 * cercano en vez de propagar NaN.
 */
export function parseQuantityInput(
  rawValue: string,
  min = MIN_QUANTITY,
  max = MAX_QUANTITY,
): number {
  return clampQuantity(Number.parseInt(rawValue, 10), min, max);
}
