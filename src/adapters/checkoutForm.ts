import { requireFormStringField } from "@/lib/form";
import type { RawCheckoutInput } from "@/models/checkout.model";

/**
 * DOM/`FormData` boundary for the checkout form. Keeping this here (not in
 * `checkout.model.ts`) reverses the H3 leak: the pure checkout model and its
 * validator never import `FormData`.
 *
 * `name="..."` on each input must match the keys below.
 */
export function extractCheckoutForm(form: HTMLFormElement): RawCheckoutInput {
  const data = new FormData(form);
  return {
    fullName: requireFormStringField(data, "fullName"),
    email: requireFormStringField(data, "email"),
    street: requireFormStringField(data, "street"),
    city: requireFormStringField(data, "city"),
    region: requireFormStringField(data, "region"),
    zipCode: optional(data, "zipCode"),
  };
}

function optional(data: FormData, field: string): string {
  const value = data.get(field);
  return typeof value === "string" ? value.trim() : "";
}
