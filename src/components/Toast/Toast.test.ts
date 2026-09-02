import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Toast } from "bootstrap";
import { showToast } from "@/components/Toast/Toast";
import { MissingElementError, requireElement } from "@/lib/dom";

beforeEach(() => {
  document.body.innerHTML = `
    <div id="cart-toast" class="toast" role="alert">
      <div class="toast-body">
        <span id="toast-message"></span>
      </div>
    </div>
  `;
  // Desactiva la animacion en tests: sin ella Bootstrap no programa el timer
  // de "transitionend" emulado, que en CI llegaba a disparar un dispatchEvent
  // sobre el toast ya desmontado y tumbaba la corrida entera
  // ("Failed to execute 'dispatchEvent' ... parameter 1 is not of type 'Event'").
  Toast.getOrCreateInstance(requireElement("#cart-toast"), { animation: false });
});

afterEach(() => {
  const toastEl = document.getElementById("cart-toast");
  if (toastEl) {
    Toast.getInstance(toastEl)?.dispose();
  }
});

describe("showToast", () => {
  it("escribe el mensaje en #toast-message", () => {
    showToast("¡Producto agregado al carrito!");
    expect(requireElement("#toast-message").textContent).toBe("¡Producto agregado al carrito!");
  });

  it("usa el mensaje por defecto si no se pasa uno", () => {
    showToast();
    expect(requireElement("#toast-message").textContent).toBe("Producto agregado al carrito.");
  });

  it("agrega la clase show al toast (bootstrap.Toast.show())", () => {
    showToast("mensaje");
    expect(requireElement("#cart-toast").classList.contains("show")).toBe(true);
  });

  it("lanza MissingElementError si el markup del toast no esta montado", () => {
    document.body.innerHTML = "";
    expect(() => {
      showToast("mensaje");
    }).toThrow(MissingElementError);
  });
});
