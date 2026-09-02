import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flashButtonFeedback } from "@/lib/button-feedback";
import { requireElementOfType } from "@/lib/dom";

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = '<button id="btn">Agregar</button>';
});

afterEach(() => {
  vi.useRealTimers();
});

describe("flashButtonFeedback", () => {
  it("reemplaza el html y deshabilita el boton de inmediato", () => {
    const btn = requireElementOfType("#btn", HTMLButtonElement);

    flashButtonFeedback(btn, "Agregado", 1500);

    expect(btn.innerHTML).toBe("Agregado");
    expect(btn.disabled).toBe(true);
  });

  it("restaura el html original y reactiva el boton tras la duracion indicada", () => {
    const btn = requireElementOfType("#btn", HTMLButtonElement);
    const originalHtml = btn.innerHTML;

    flashButtonFeedback(btn, "Agregado", 1500);
    vi.advanceTimersByTime(1499);
    expect(btn.disabled).toBe(true);

    vi.advanceTimersByTime(1);
    expect(btn.innerHTML).toBe(originalHtml);
    expect(btn.disabled).toBe(false);
  });
});
