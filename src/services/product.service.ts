import { fetchProductsPayload } from "@/api/product.api";
import { ApiError } from "@/api/errors";
import { isProductDtoArray } from "@/models/product.dto";
import { toProductModel, type ProductModel } from "@/models/product.model";

/**
 * Capa de servicio: orquesta API + validacion (isProductDtoArray) +
 * mapeo DTO -> Model. Es el unico punto que las vistas/componentes
 * (Etapa 4) deberian importar para obtener productos; nunca deberian
 * llamar fetch() ni el DTO directamente.
 */
export async function fetchProducts(): Promise<ProductModel[]> {
  const payload = await fetchProductsPayload();

  if (!isProductDtoArray(payload)) {
    throw new ApiError(
      "invalid-payload",
      "El catalogo recibido no tiene la forma esperada de productos.",
    );
  }

  return payload.map(toProductModel);
}
