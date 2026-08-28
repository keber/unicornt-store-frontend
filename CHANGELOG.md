# Changelog

Este changelog documenta la refactorización de Unicorn't Store desde JavaScript vanilla sin build hacia Vite + TypeScript estricto, ejecutada en 8 etapas sobre la rama `refactor` (ver [REFACTOR-GUIDE.md](REFACTOR-GUIDE.md) para el plan completo y el mapeo contra la rúbrica del Hito 2).

Formato: cada entrada corresponde a una etapa, en orden cronológico. No sigue [Keep a Changelog](https://keepachangelog.com/) estrictamente porque no hay versiones publicadas intermedias — es el registro de una migración de arquitectura, no de un producto con releases.

## Etapa 8 — Despliegue y retiro del legado

- El build de Vite no incluía ninguna de las 147 imágenes del catálogo (vivían en `assets/img/`, fuera de `public/` y sin ser importadas por JS, así que Vite no tenía forma de detectarlas). Se movieron a `public/assets/img/` — mismo path relativo, cero cambios de código, ahora sí llegan a `dist/`.
- `scripts/process-images.js` actualizado para escribir en la nueva ubicación; los originales de respaldo se quedan fuera de `public/` a propósito.
- `.github/workflows/static.yml` reescrito: corre el gate completo (`format:check`/`lint`/`test`) y construye con Vite antes de publicar — y publica únicamente `dist/`, ya no el repositorio completo.
- Se retiran `assets/js/app.js`, `assets/js/cart.js` y `assets/js/products.js` (sin referencias desde la Etapa 4).
- Smoke test completo contra el build de producción real (`vite preview`, no el dev server): catálogo, detalle, carrito y checkout, con las imágenes cargando correctamente.
- README y este changelog actualizados a la arquitectura actual.

## Etapa 7 — Pruebas y calidad

- Cobertura de test para `lib/dom.ts` (las guardias de DOM), `lib/currency.ts`, `lib/quantity.ts`, `lib/button-feedback.ts`.
- Cobertura de test para todos los `components/` (ProductCard, ProductDetail, CartPanel, LoadingSkeleton, ErrorFallback, Toast).
- Cobertura de test para las `views/` (delegación de eventos y cantidades, `aria-busy` durante la carga, envío exitoso/fallido del checkout) y el arranque de ambas páginas.
- `GlobalFallback`: última red de seguridad si el arranque de una página falla de forma síncrona (contenedor esperado ausente del HTML).
- Nuevo `.github/workflows/ci.yml`: valida cada push/PR (antes solo existía el workflow de deploy).
- Suite de 77 → 160 tests.

## Etapa 6 — Asincronía real de carga y envío

- `aria-busy` en los contenedores mientras `fetchProducts()` está en vuelo, retirado en un `finally`; el skeleton ahora vive en el HTML inicial, no solo inyectado por JS.
- `submitOrder()` simulado con latencia real (900ms) y ~15% de fallo aleatorio, para forzar a la UI a manejar el camino de error, no solo el feliz.
- Checkout: botón deshabilitado + spinner durante el envío, `try/catch/finally`, estado controlado por el enum `CheckoutStatus` (switch exhaustivo, nunca banderas sueltas). Si falla, el carrito y el formulario se preservan para reintentar.

## Etapa 5 — Formulario real de checkout

- "Finalizar compra" pasa de botón-que-simula a un `<form>` real: `preventDefault()`, extracción vía `FormData`, validación de nombre/email/dirección.
- Errores mostrados junto a cada campo, foco automático en el primero inválido.
- `requireFormStringField()`: la aserción especializada para `FormData` (`FormDataEntryValue | null` → `string`, o lanza).

## Etapa 4 — Arquitectura modular

- Migración vertical completa (catálogo → detalle → carrito → checkout) que reemplaza `assets/js/app.js` + `cart.js` + `products.js`.
- Se establecen las capas `lib/`, `components/`, `services/`, `views/`, `pages/`.
- Bootstrap pasa de CDN a dependencia de npm; su CSS se bundlea con Vite y su JS (`Toast`, `Offcanvas`) se importa donde se usa.

## Etapa 3 — Modelado de dominio y saneo de datos

- Contratos TypeScript cerrados: `ProductModel`/`ProductDto`, `CartModel`/`CartItemModel`, `CheckoutModel`. Categorías y subcategorías como `as const` + unión derivada.
- Type guards que validan estructuralmente cualquier dato externo (`isProductDto`, `isCartItemModel`) antes de confiar en él.
- Catálogo movido de `assets/js/products.js` a `public/data/products.json`, extraído programáticamente (no a mano) para garantizar paridad exacta.
- Capa `api/` + `services/` con `ApiError` de razón cerrada (`network`/`http`/`invalid-json`/`invalid-payload`).

## Etapa 2 — Toolchain

- Vite (multipágina), TypeScript en modo `strict`, ESLint (flat config) y Prettier, Vitest + jsdom.

## Etapa 1 — Baseline y seguridad de migración

- Checklist de casos de aceptación funcional y estructura de datos verificada contra el código real (no contra documentación potencialmente desactualizada).
- `package.json`, `package-lock.json` y `scripts/` pasan a estar trackeados en git (estaban en `.gitignore` desde el inicio del proyecto).
