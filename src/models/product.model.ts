import type { ProductDto } from "@/models/product.dto";

/**
 * Categorias de producto. Vocabulario cerrado del negocio (ver
 * docs/project-context.md): hoy el catalogo solo tiene "Polera", pero
 * "Tazon" es parte del dominio declarado a futuro.
 */
export const PRODUCT_CATEGORIES = ["Polera", "Tazón"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export function isProductCategory(value: unknown): value is ProductCategory {
  return typeof value === "string" && (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Subcategorias tematicas verificadas contra assets/js/products.js
 * (ver docs/etapa-1-baseline.md, seccion 2).
 */
export const PRODUCT_SUBCATEGORIES = [
  "pm",
  "cloud",
  "devops",
  "enigma",
  "general",
  "it-crowd",
  "linux",
  "personajes",
  "programador",
  "qa",
] as const;
export type ProductSubcategory = (typeof PRODUCT_SUBCATEGORIES)[number];

export function isProductSubcategory(value: unknown): value is ProductSubcategory {
  return typeof value === "string" && (PRODUCT_SUBCATEGORIES as readonly string[]).includes(value);
}

/**
 * Modelo de dominio: la forma en la que el resto de la app consume un
 * producto, una vez que ProductDto paso por isProductDto() y por
 * toProductModel(). category/subcategory ya son uniones cerradas, no
 * string.
 */
export interface ProductModel {
  readonly id: number;
  readonly name: string;
  readonly category: ProductCategory;
  readonly subcategory: ProductSubcategory;
  readonly price: number;
  readonly description: string;
  /** Ruta base sin extension: "assets/img/{subcategory}/{slug}". */
  readonly image: string;
}

/** Sufijos fisicos generados por scripts/process-images.js (ver Etapa 1). */
export const PRODUCT_IMAGE_VARIANTS = {
  detail: "",
  card: "-card",
  thumb: "-thumb",
} as const;
export type ProductImageVariant = keyof typeof PRODUCT_IMAGE_VARIANTS;

export function productImageSrc(product: ProductModel, variant: ProductImageVariant): string {
  return `${product.image}${PRODUCT_IMAGE_VARIANTS[variant]}.webp`;
}

/**
 * Convierte un ProductDto ya validado (isProductDto) en un ProductModel.
 * Hoy es una copia estructural porque el DTO y el modelo comparten forma;
 * el punto de conversion existe para poder absorber, sin tocar el resto
 * de la app, un DTO distinto cuando el catalogo venga del backend real
 * (Hito 4).
 */
export function toProductModel(dto: ProductDto): ProductModel {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category,
    subcategory: dto.subcategory,
    price: dto.price,
    description: dto.description,
    image: dto.image,
  };
}
