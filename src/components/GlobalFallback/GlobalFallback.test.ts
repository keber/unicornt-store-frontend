import { describe, expect, it, vi } from "vitest";
import { renderGlobalFallback } from "@/components/GlobalFallback/GlobalFallback";
import { requireElementOfType } from "@/lib/dom";

describe("renderGlobalFallback", () => {
  it("reemplaza todo el body con el mensaje por defecto", () => {
    document.body.innerHTML = "<div>contenido previo</div>";
    renderGlobalFallback();
    expect(document.body.textContent).toContain("Ocurrió un error inesperado");
    expect(document.body.textContent).not.toContain("contenido previo");
  });

  it("acepta un mensaje personalizado", () => {
    renderGlobalFallback("No se pudo iniciar la aplicación.");
    expect(document.body.textContent).toContain("No se pudo iniciar la aplicación.");
  });

  it('el boton "Recargar" dispara window.location.reload()', () => {
    renderGlobalFallback();
    const reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadSpy },
      writable: true,
    });

    requireElementOfType("#btn-global-reload", HTMLButtonElement).click();

    expect(reloadSpy).toHaveBeenCalledOnce();
  });
});
