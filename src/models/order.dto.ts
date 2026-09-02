/** The order confirmation returned by `POST /api/v1/orders` (`OrderConfirmationResponse`). */
export interface OrderConfirmationDto {
  readonly id: number;
  readonly status: string;
  readonly total: number;
}

export interface OrderConfirmation {
  readonly id: number;
  readonly status: string;
  readonly total: number;
}

export function isOrderConfirmationDto(value: unknown): value is OrderConfirmationDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "number" &&
    Number.isFinite(c.id) &&
    typeof c.status === "string" &&
    c.status.length > 0 &&
    typeof c.total === "number" &&
    Number.isFinite(c.total)
  );
}

export function toOrderConfirmation(dto: OrderConfirmationDto): OrderConfirmation {
  return { id: dto.id, status: dto.status, total: dto.total };
}
