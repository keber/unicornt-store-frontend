import { Offcanvas } from "bootstrap";
import { showToast } from "@/components/Toast/Toast";
import { requireElement, requireElementOfType } from "@/lib/dom";
import {
  extractRawCheckoutInput,
  hasCheckoutErrors,
  validateCheckoutInput,
  type CheckoutFieldErrors,
} from "@/models/checkout.model";

/** `name="..."` del input en el HTML debe calzar con estas claves (ver extractRawCheckoutInput). */
const FIELD_INPUT_IDS = {
  fullName: "checkout-fullName",
  email: "checkout-email",
  address: "checkout-address",
} as const;

function setFieldError(
  form: HTMLFormElement,
  inputId: string,
  message: string | undefined,
): HTMLInputElement {
  const input = requireElementOfType(`#${inputId}`, HTMLInputElement, form);
  const feedback = requireElement(`#${inputId}-error`, form);

  if (message) {
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    feedback.textContent = message;
  } else {
    input.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
    feedback.textContent = "";
  }

  return input;
}

/** Pinta los errores junto a cada campo y enfoca el primero invalido. true si no hubo ninguno. */
function applyFieldErrors(form: HTMLFormElement, errors: CheckoutFieldErrors): boolean {
  let firstInvalid: HTMLInputElement | null = null;

  for (const key of Object.keys(FIELD_INPUT_IDS) as (keyof typeof FIELD_INPUT_IDS)[]) {
    const input = setFieldError(form, FIELD_INPUT_IDS[key], errors[key]);
    if (errors[key] !== undefined && firstInvalid === null) {
      firstInvalid = input;
    }
  }

  firstInvalid?.focus();
  return firstInvalid === null;
}

/**
 * Convierte "Finalizar compra" en un formulario real (Etapa 5,
 * 3 puntos de la rubrica): preventDefault(), extrae los datos con
 * FormData, los valida y muestra los errores junto al campo
 * correspondiente en vez de dejar que el navegador recargue la pagina.
 *
 * Solo si el formulario es valido se llama a onValidSubmit(): hoy
 * (Etapa 5) eso dispara el checkout simulado de completeSimulatedCheckout();
 * la Etapa 6 lo reemplaza por un submitOrder() asincrono real con
 * try/catch/finally y estados de carga.
 */
export function initCheckoutForm(form: HTMLFormElement, onValidSubmit: () => void): void {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const raw = extractRawCheckoutInput(new FormData(form));
    const errors = validateCheckoutInput(raw);

    if (hasCheckoutErrors(errors)) {
      applyFieldErrors(form, errors);
      return;
    }

    applyFieldErrors(form, {});
    form.reset();
    onValidSubmit();
  });
}

export function completeSimulatedCheckout(offcanvasEl: Element): void {
  Offcanvas.getInstance(offcanvasEl)?.hide();
  showToast("¡Gracias por tu compra! Tu pedido está en camino. 🦄");
}
