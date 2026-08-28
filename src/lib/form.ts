/**
 * `FormData.get()` devuelve `FormDataEntryValue | null` (string | File |
 * null): nunca un string garantizado. Esta asercion especializada
 * confirma el tipo antes de usarlo, en vez de asumirlo con `as string`.
 */
export function requireFormStringField(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== "string") {
    throw new TypeError(`El campo "${name}" no llegó como texto en el FormData.`);
  }
  return value;
}
