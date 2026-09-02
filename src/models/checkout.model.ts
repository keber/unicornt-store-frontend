import type { CartItemModel } from "@/models/cart.model";

/**
 * States of submitting the purchase. Closed enum: no component compares against a
 * free string such as "loading" or "ok" - always against CheckoutStatus.
 */
export const CHECKOUT_STATUSES = ["idle", "submitting", "success", "error"] as const;
export type CheckoutStatus = (typeof CHECKOUT_STATUSES)[number];

export function isCheckoutStatus(value: unknown): value is CheckoutStatus {
  return typeof value === "string" && (CHECKOUT_STATUSES as readonly string[]).includes(value);
}

/**
 * Buyer + shipping data as it comes out of the checkout form: all strings, not yet
 * validated. The `FormData` boundary lives in `src/adapters/checkoutForm.ts`; this
 * module and its validator never import `FormData` (reverses the H3 leak).
 */
export interface RawCheckoutInput {
  readonly fullName: string;
  readonly email: string;
  readonly street: string;
  readonly city: string;
  readonly region: string;
  readonly zipCode: string;
}

/** Normalised, validated payload, ready to POST to /api/v1/orders. */
export interface CheckoutModel {
  readonly buyer: RawCheckoutInput;
  readonly items: readonly CartItemModel[];
  readonly total: number;
  readonly status: CheckoutStatus;
}

/** One message per field, shown next to the input. A missing key means "valid". */
export interface CheckoutFieldErrors {
  fullName?: string;
  email?: string;
  street?: string;
  city?: string;
  region?: string;
}

const MIN_NAME_LENGTH = 3;
const MIN_STREET_LENGTH = 5;

/** Deliberately simple email shape check (no regex, no backtracking risk). */
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

/** Pure validation of the extracted form input. No DOM. */
export function validateCheckoutInput(raw: RawCheckoutInput): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};

  if (raw.fullName.trim().length < MIN_NAME_LENGTH) {
    errors.fullName = `Ingresa tu nombre completo (mínimo ${String(MIN_NAME_LENGTH)} caracteres).`;
  }
  if (!isPlausibleEmail(raw.email.trim())) {
    errors.email = "Ingresa un email válido.";
  }
  if (raw.street.trim().length < MIN_STREET_LENGTH) {
    errors.street = `Ingresa la calle y número (mínimo ${String(MIN_STREET_LENGTH)} caracteres).`;
  }
  if (raw.city.trim().length === 0) {
    errors.city = "Ingresa la ciudad.";
  }
  if (raw.region.trim().length === 0) {
    errors.region = "Ingresa la región.";
  }

  return errors;
}

export function hasCheckoutErrors(errors: CheckoutFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
