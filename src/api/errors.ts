/**
 * Motivos de fallo de la capa API. Enum cerrado (no strings libres) para
 * que product.service.ts y, mas adelante, la UI de la Etapa 6 puedan
 * distinguir red / HTTP / JSON invalido / payload invalido sin comparar
 * contra texto suelto.
 */
export const API_ERROR_REASONS = ["network", "http", "invalid-json", "invalid-payload"] as const;
export type ApiErrorReason = (typeof API_ERROR_REASONS)[number];

export class ApiError extends Error {
  readonly reason: ApiErrorReason;

  constructor(reason: ApiErrorReason, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ApiError";
    this.reason = reason;
  }
}
