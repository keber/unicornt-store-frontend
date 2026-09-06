import type { CategoryModel } from "@/models/category.model";

/** A category exactly as `GET /api/v1/categories` returns it (`CategoryResponse`). */
export interface CategoryDto {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isCategoryDto(value: unknown): value is CategoryDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "number" &&
    Number.isInteger(c.id) &&
    c.id > 0 &&
    isNonEmptyString(c.name) &&
    isNonEmptyString(c.slug)
  );
}

export function isCategoryDtoArray(value: unknown): value is CategoryDto[] {
  return Array.isArray(value) && value.every(isCategoryDto);
}

export function toCategoryModel(dto: CategoryDto): CategoryModel {
  return { id: dto.id, name: dto.name, slug: dto.slug };
}
