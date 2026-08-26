import { ApiError } from "@/api/errors";
import type { CheckoutModel } from "@/models/checkout.model";

const SIMULATED_LATENCY_MS = 900;

/**
 * Probabilidad de fallo del adaptador simulado. Existe para poder
 * demostrar (y probar, con Math.random mockeado) el camino de error de
 * verdad -- no solo el feliz -- sin depender de tener un backend real
 * que falle a demanda.
 */
const SIMULATED_FAILURE_RATE = 0.15;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Adaptador simulado de "POST /api/orders" (Hito 4, Spring Boot). Aplica
 * una latencia controlada para representar el servicio externo y falla
 * aleatoriamente para forzar a la UI a manejar el camino de error, no
 * solo el feliz.
 *
 * Cuando exista el backend real, esta es la unica funcion que cambia
 * (un fetch de verdad) -- checkout.service.ts y la UI no se enteran.
 */
export async function submitOrder(order: CheckoutModel): Promise<void> {
  await wait(SIMULATED_LATENCY_MS);

  if (Math.random() < SIMULATED_FAILURE_RATE) {
    throw new ApiError(
      "network",
      "El servicio de pedidos no respondió a tiempo. Intenta de nuevo.",
    );
  }

  // Éxito: no hay nada que devolver, `order` ya se validó antes de llegar aquí.
  void order;
}
