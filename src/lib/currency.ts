/**
 * Formatea un monto en CLP igual que el formatPrice() legado de
 * assets/js/app.js: prefijo "$" + separador de miles es-CL, sin
 * decimales (los precios del catalogo ya son enteros).
 */
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("es-CL")}`;
}
