import { beforeEach, describe, expect, it } from "vitest";
import { createLoadingState } from "@/components/LoadingSkeleton/LoadingSkeleton";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("createLoadingState", () => {
  it("usa el mensaje por defecto si no se pasa uno", () => {
    document.body.append(createLoadingState());
    expect(document.body.textContent).toContain("Cargando...");
  });

  it("usa el mensaje personalizado cuando se pasa uno", () => {
    document.body.append(createLoadingState("Cargando catálogo..."));
    expect(document.body.textContent).toContain("Cargando catálogo...");
  });

  it("incluye el icono de spinner", () => {
    document.body.append(createLoadingState());
    expect(document.querySelector(".fa-spinner")).not.toBeNull();
  });
});
