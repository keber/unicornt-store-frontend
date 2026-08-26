/**
 * Feedback visual temporal en un boton ("Agregado" -> vuelve al estado
 * original al cabo de `durationMs`). Mismo patron que el app.js legado,
 * ahora reutilizable desde ProductCard y ProductDetail.
 */
export function flashButtonFeedback(
  button: HTMLButtonElement,
  temporaryHtml: string,
  durationMs: number,
): void {
  const originalHtml = button.innerHTML;
  button.innerHTML = temporaryHtml;
  button.disabled = true;
  window.setTimeout(() => {
    button.innerHTML = originalHtml;
    button.disabled = false;
  }, durationMs);
}
