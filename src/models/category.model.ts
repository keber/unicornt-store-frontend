/**
 * Domain model of a product category, consumed by the catalog filter once a
 * {@link CategoryDto} has passed validation and `toCategoryModel`.
 */
export interface CategoryModel {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
}
