import { Offcanvas } from "bootstrap";
import { extractCheckoutForm } from "@/adapters/checkoutForm";
import { ApiError } from "@/api/errors";
import { showToast } from "@/components/Toast/Toast";
import { requireElement, requireElementOfType } from "@/lib/dom";
import type { CartModel } from "@/models/cart.model";
import {
  hasCheckoutErrors,
  validateCheckoutInput,
  type CheckoutFieldErrors,
  type CheckoutStatus,
} from "@/models/checkout.model";
import type { OrderConfirmation } from "@/models/order.dto";
import type { ProductModel } from "@/models/product.model";
import { buildCheckoutModel, submitCheckout } from "@/services/checkout.service";

/** `name="..."` on the input must match these keys (see extractCheckoutForm). */
const FIELD_INPUT_IDS = {
  fullName: "checkout-fullName",
  email: "checkout-email",
  street: "checkout-street",
  city: "checkout-city",
  region: "checkout-region",
} as const;

const SUBMIT_BUTTON_SELECTOR = "#btn-checkout";
const SUBMIT_ERROR_SELECTOR = "#checkout-submit-error";
const SUBMITTING_HTML =
  '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';

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

function setSubmitError(form: HTMLFormElement, message: string | null): void {
  const el = requireElement(SUBMIT_ERROR_SELECTOR, form);
  el.textContent = message ?? "";
  el.classList.toggle("d-none", message === null);
}

/**
 * Unico lugar que traduce CheckoutStatus a DOM. El switch es exhaustivo
 * (el `default` con `never` obliga a actualizarlo si CHECKOUT_STATUSES
 * gana un valor nuevo) para que el estado del boton se controle
 * siempre contra el enum, nunca contra una bandera booleana suelta.
 */
function renderCheckoutStatus(
  status: CheckoutStatus,
  submitButton: HTMLButtonElement,
  idleButtonHtml: string,
): void {
  switch (status) {
    case "idle":
    case "success":
    case "error":
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      submitButton.innerHTML = idleButtonHtml;
      return;
    case "submitting":
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
      submitButton.innerHTML = SUBMITTING_HTML;
      return;
    default: {
      const exhaustive: never = status;
      throw new TypeError(`Estado de checkout no manejado: ${String(exhaustive)}`);
    }
  }
}

export interface CheckoutFormOptions {
  getCart: () => CartModel;
  getProducts: () => readonly ProductModel[];
  onSuccess: (confirmation: OrderConfirmation) => void;
}

/**
 * Convierte "Finalizar compra" en un formulario real y asincrono
 * (Etapas 5 y 6): preventDefault() + FormData + validacion (Etapa 5);
 * submitOrder() con latencia simulada, boton deshabilitado + spinner,
 * y try/catch/finally (Etapa 6, 4 puntos de la rubrica).
 */
export function initCheckoutForm(form: HTMLFormElement, options: CheckoutFormOptions): void {
  const submitButton = requireElementOfType(SUBMIT_BUTTON_SELECTOR, HTMLButtonElement, form);
  const idleButtonHtml = submitButton.innerHTML;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const raw = extractCheckoutForm(form);
    const errors = validateCheckoutInput(raw);

    if (hasCheckoutErrors(errors)) {
      applyFieldErrors(form, errors);
      return;
    }
    applyFieldErrors(form, {});
    setSubmitError(form, null);

    const cart = options.getCart();
    if (cart.items.length === 0) {
      // Defensivo: el formulario esta oculto con el carrito vacio (ver
      // cart.view.ts), pero no depender solo de eso.
      return;
    }
    const order = buildCheckoutModel(raw, cart, options.getProducts());

    void (async () => {
      let status: CheckoutStatus = "submitting";
      renderCheckoutStatus(status, submitButton, idleButtonHtml);

      try {
        const confirmation = await submitCheckout(order);
        status = "success";
        form.reset();
        options.onSuccess(confirmation);
      } catch (cause) {
        status = "error";
        setSubmitError(form, checkoutErrorMessage(cause));
      } finally {
        // Unico lugar que vuelve a pintar el boton, ya sea que el envio
        // haya terminado en "success" o en "error".
        renderCheckoutStatus(status, submitButton, idleButtonHtml);
      }
    })();
  });
}

/** Actionable copy for a failed submit. A stock rejection keeps the cart untouched. */
function checkoutErrorMessage(cause: unknown): string {
  if (cause instanceof ApiError && cause.reason === "http" && cause.message.includes("422")) {
    return "Un producto de tu carrito se quedó sin stock. Ajusta las cantidades y vuelve a intentar.";
  }
  if (cause instanceof ApiError && cause.reason === "network") {
    return "No pudimos contactar la tienda. Revisa tu conexión e intenta de nuevo.";
  }
  return "No se pudo procesar tu compra. Intenta de nuevo.";
}

export function completeCheckout(offcanvasEl: Element, confirmation: OrderConfirmation): void {
  Offcanvas.getInstance(offcanvasEl)?.hide();
  showToast(`¡Compra confirmada! Pedido #${String(confirmation.id)}. 🦄`);
}
