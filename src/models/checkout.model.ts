import type { CartItemModel } from "@/models/cart.model";
import { requireFormStringField } from "@/lib/form";

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

/** Extrae RawCheckoutInput de un FormData (Etapa 5). `name="..."` del input debe calzar con la clave. */
export function extractRawCheckoutInput(formData: FormData): RawCheckoutInput {
  return {
    fullName: requireFormStringField(formData, "fullName"),
    email: requireFormStringField(formData, "email"),
    address: requireFormStringField(formData, "address"),
  };
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

/**
 * Un mensaje por campo, mostrado junto al input correspondiente (Etapa
 * 5). La ausencia de una clave significa "ese campo es valido".
 */
export interface CheckoutFieldErrors {
  fullName?: string;
  email?: string;
  address?: string;
}

const MIN_NAME_LENGTH = 3;
const MIN_ADDRESS_LENGTH = 5;

/**
 * Chequeo deliberadamente simple (sin regex) de forma de email: evita
 * cualquier riesgo de backtracking catastrofico y alcanza para el
 * objetivo real, que es atrapar errores de tipeo obvios, no reemplazar
 * una verificacion real (esa solo la da confirmar el correo enviandolo).
 */
function isPlausibleEmail(value: string): boolean {
  if (value.includes(" ")) {
    return false;
  }
  const at = value.indexOf("@");
  if (at <= 0 || at === value.length - 1) {
    return false;
  }
  const domain = value.slice(at + 1);
  const dot = domain.indexOf(".");
  return dot > 0 && dot < domain.length - 1;
}

/**
 * Valida los datos del comprador extraidos del formulario. Puro: no
 * toca el DOM, asi que se prueba sin jsdom y sin montar el formulario
 * real (ver product.view.ts/cart.view.ts para el uso con FormData).
 */
export function validateCheckoutInput(raw: RawCheckoutInput): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};

  if (raw.fullName.trim().length < MIN_NAME_LENGTH) {
    errors.fullName = `Ingresa tu nombre completo (mínimo ${String(MIN_NAME_LENGTH)} caracteres).`;
  }

  if (!isPlausibleEmail(raw.email.trim())) {
    errors.email = "Ingresa un email válido.";
  }

  if (raw.address.trim().length < MIN_ADDRESS_LENGTH) {
    errors.address = `Ingresa una dirección de envío válida (mínimo ${String(MIN_ADDRESS_LENGTH)} caracteres).`;
  }

  return errors;
}

export function hasCheckoutErrors(errors: CheckoutFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
