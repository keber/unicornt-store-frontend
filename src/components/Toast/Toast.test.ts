import { beforeEach, describe, expect, it } from "vitest";
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
