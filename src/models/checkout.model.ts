import type { CartItemModel } from "@/models/cart.model";

/**
 * Estados del envio de la compra. Enum cerrado: la rubrica del Hito 2
 * exige "bloquear... cadenas de texto libres para el control de estados",
 * asi que ningun componente debe comparar contra un string suelto como
 * "loading" o "ok" — siempre contra CheckoutStatus.
 */
export const CHECKOUT_STATUSES = ["idle", "submitting", "success", "error"] as const;
export type CheckoutStatus = (typeof CHECKOUT_STATUSES)[number];

export function isCheckoutStatus(value: unknown): value is CheckoutStatus {
  return typeof value === "string" && (CHECKOUT_STATUSES as readonly string[]).includes(value);
}

/**
 * Datos del comprador tal como salen de FormData (Etapa 5): todo string,
 * todavia sin validar (puede venir vacio, con espacios, con un email mal
 * formado, etc.). El formulario real y sus reglas de validacion por
 * campo se definen en la Etapa 5; este contrato solo fija que campos
 * existen para no bloquear el modelado de CheckoutModel.
 */
export interface RawCheckoutInput {
  readonly fullName: string;
  readonly email: string;
  readonly address: string;
}

/**
 * Payload normalizado y validado, listo para "enviarse" (Etapa 6,
 * simulado) y, a futuro, para mapear 1:1 al POST /api/orders del backend
 * real (Hito 4).
 */
export interface CheckoutModel {
  readonly buyer: RawCheckoutInput;
  readonly items: readonly CartItemModel[];
  readonly total: number;
  readonly status: CheckoutStatus;
}
