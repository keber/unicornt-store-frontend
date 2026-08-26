import { ApiError } from "@/api/errors";

/**
 * Hoy sirve el JSON estatico de public/data/products.json. En la
 * integracion con el Hito 4 (Spring Boot) este es el unico valor que
 * cambia, idealmente a una URL configurable via variable de entorno de
 * Vite (import.meta.env.VITE_API_BASE_URL + "/api/products").
 */
const PRODUCTS_URL = "/data/products.json";

/**
 * Capa API: solo hace la llamada HTTP y entrega el body como `unknown`.
 * No conoce ProductDto ni ProductModel — esa responsabilidad es de
 * product.service.ts. Separar esto evita que un cambio de backend
 * obligue a tocar la logica de validacion o el resto de la app.
 */
export async function fetchProductsPayload(): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(PRODUCTS_URL);
  } catch (cause) {
    throw new ApiError("network", "No se pudo conectar para cargar el catalogo.", { cause });
  }

  if (!response.ok) {
    throw new ApiError(
      "http",
      `El catalogo respondio con un error (HTTP ${String(response.status)}).`,
    );
  }

  try {
    return await response.json();
  } catch (cause) {
    throw new ApiError("invalid-json", "La respuesta del catalogo no es JSON valido.", { cause });
  }
}
