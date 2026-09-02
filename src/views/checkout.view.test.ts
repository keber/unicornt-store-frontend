import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireElement, requireElementOfType } from "@/lib/dom";
import type { CartModel } from "@/models/cart.model";
import type { ProductModel } from "@/models/product.model";

const { submitCheckout } = vi.hoisted(() => ({ submitCheckout: vi.fn() }));
vi.mock("@/services/checkout.service", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/checkout.service")>();
  return { ...actual, submitCheckout };
});

const { initCheckoutForm } = await import("@/views/checkout.view");

const products: ProductModel[] = [
  {
    id: 1,
    name: "Polera A",
    category: "Polera",
    subcategory: "devops",
    price: 10000,
    description: "d",
    image: "assets/img/devops/a",
  },
];
const cart: CartModel = { items: [{ id: 1, qty: 1 }] };

const FORM_FIXTURE = `
  <form id="checkout-form">
    <input id="checkout-fullName" name="fullName" />
    <div id="checkout-fullName-error"></div>
    <input id="checkout-email" name="email" />
    <div id="checkout-email-error"></div>
    <input id="checkout-street" name="street" />
    <div id="checkout-street-error"></div>
    <input id="checkout-city" name="city" />
    <div id="checkout-city-error"></div>
    <input id="checkout-region" name="region" />
    <div id="checkout-region-error"></div>
    <input id="checkout-zipCode" name="zipCode" />
    <div id="checkout-submit-error" class="d-none"></div>
    <button type="submit" id="btn-checkout">Finalizar compra</button>
  </form>
`;

function fillValidForm(): void {
  requireElementOfType("#checkout-fullName", HTMLInputElement).value = "Ana Pérez";
  requireElementOfType("#checkout-email", HTMLInputElement).value = "ana@example.com";
  requireElementOfType("#checkout-street", HTMLInputElement).value = "Av. Siempre Viva 742";
  requireElementOfType("#checkout-city", HTMLInputElement).value = "Santiago";
  requireElementOfType("#checkout-region", HTMLInputElement).value = "RM";
}

function submitForm(): void {
  requireElementOfType("#checkout-form", HTMLFormElement).dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true }),
  );
}

beforeEach(() => {
  submitCheckout.mockReset();
  document.body.innerHTML = FORM_FIXTURE;
});

describe("initCheckoutForm -- envio exitoso y fallido", () => {
  it("durante el envio deshabilita el boton y muestra el spinner", async () => {
    let resolveSubmit: () => void = () => undefined;
    submitCheckout.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      }),
    );
    const onSuccess = vi.fn();
    initCheckoutForm(requireElementOfType("#checkout-form", HTMLFormElement), {
      getCart: () => cart,
      getProducts: () => products,
      onSuccess,
    });
    fillValidForm();

    submitForm();

    const button = requireElementOfType("#btn-checkout", HTMLButtonElement);
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(button.innerHTML).toContain("Enviando");

    resolveSubmit();
    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });
    expect(button.disabled).toBe(false);
    expect(button.getAttribute("aria-busy")).toBeNull();
  });

  it("si submitCheckout() falla, muestra el error inline, reactiva el boton y NO llama onSuccess", async () => {
    submitCheckout.mockRejectedValueOnce(new Error("fallo simulado"));
    const onSuccess = vi.fn();
    initCheckoutForm(requireElementOfType("#checkout-form", HTMLFormElement), {
      getCart: () => cart,
      getProducts: () => products,
      onSuccess,
    });
    fillValidForm();

    submitForm();

    await vi.waitFor(() => {
      expect(requireElement("#checkout-submit-error").textContent).not.toBe("");
    });
    expect(onSuccess).not.toHaveBeenCalled();
    expect(requireElementOfType("#btn-checkout", HTMLButtonElement).disabled).toBe(false);
  });

  it("no llama a submitCheckout() si el carrito esta vacio (guardia defensiva)", () => {
    const onSuccess = vi.fn();
    initCheckoutForm(requireElementOfType("#checkout-form", HTMLFormElement), {
      getCart: () => ({ items: [] }),
      getProducts: () => products,
      onSuccess,
    });
    fillValidForm();

    submitForm();

    expect(submitCheckout).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
