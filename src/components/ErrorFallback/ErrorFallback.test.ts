import { describe, expect, it } from "vitest";
import {
  RETRY_BUTTON_SELECTOR,
  renderErrorFallback,
} from "@/components/ErrorFallback/ErrorFallback";
import { requireElementOfType } from "@/lib/dom";

describe("renderErrorFallback", () => {
  it("muestra el mensaje recibido", () => {
    document.body.innerHTML = renderErrorFallback("No se pudo cargar el catálogo.");
    expect(document.body.textContent).toContain("No se pudo cargar el catálogo.");
  });

  it("incluye un boton de reintentar que calza con RETRY_BUTTON_SELECTOR", () => {
    document.body.innerHTML = renderErrorFallback("Error");
    const retryButton = requireElementOfType(RETRY_BUTTON_SELECTOR, HTMLButtonElement);
    expect(retryButton.textContent).toContain("Reintentar");
  });
});
