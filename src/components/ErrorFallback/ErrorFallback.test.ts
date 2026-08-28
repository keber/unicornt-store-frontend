import { beforeEach, describe, expect, it } from "vitest";
import {
  RETRY_BUTTON_SELECTOR,
  createErrorFallback,
} from "@/components/ErrorFallback/ErrorFallback";
import { requireElementOfType } from "@/lib/dom";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("createErrorFallback", () => {
  it("muestra el mensaje recibido", () => {
    document.body.append(createErrorFallback("No se pudo cargar el catálogo."));
    expect(document.body.textContent).toContain("No se pudo cargar el catálogo.");
  });

  it("incluye un boton de reintentar que calza con RETRY_BUTTON_SELECTOR", () => {
    document.body.append(createErrorFallback("Error"));

    const retryButton = requireElementOfType(RETRY_BUTTON_SELECTOR, HTMLButtonElement);
    expect(retryButton.textContent).toContain("Reintentar");
  });
});
