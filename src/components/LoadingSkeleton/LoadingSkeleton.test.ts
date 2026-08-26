import { describe, expect, it } from "vitest";
import { renderLoadingState } from "@/components/LoadingSkeleton/LoadingSkeleton";

describe("renderLoadingState", () => {
  it("usa el mensaje por defecto si no se pasa uno", () => {
    document.body.innerHTML = renderLoadingState();
    expect(document.body.textContent).toContain("Cargando...");
  });

  it("usa el mensaje personalizado cuando se pasa uno", () => {
    document.body.innerHTML = renderLoadingState("Cargando catálogo...");
    expect(document.body.textContent).toContain("Cargando catálogo...");
  });

  it("incluye el icono de spinner", () => {
    document.body.innerHTML = renderLoadingState();
    expect(document.querySelector(".fa-spinner")).not.toBeNull();
  });
});
