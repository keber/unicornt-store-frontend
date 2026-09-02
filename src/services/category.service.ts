import { fetchCategoriesPayload } from "@/api/category.api";
import { ApiError } from "@/api/errors";
import { isCategoryDtoArray, toCategoryModel } from "@/models/category.dto";
import type { CategoryModel } from "@/models/category.model";

/**
 * Service layer for categories: API call, runtime validation and DTO -> model
 * mapping. Used by the catalog view to build its category filter.
 */
export async function fetchCategories(): Promise<CategoryModel[]> {
  const payload = await fetchCategoriesPayload();

  if (!isCategoryDtoArray(payload)) {
    throw new ApiError(
      "invalid-payload",
      "The categories response does not have the expected shape.",
    );
  }

  return payload.map(toCategoryModel);
}
