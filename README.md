# Unicorn't Store — Frontend

Tienda en línea de poleras y tazones geek/memes. Frontend construido con Vite + TypeScript estricto, sin frameworks de UI, con Bootstrap 5 como dependencia de npm.

🌐 **Demo:** [unicornt-store.keber.cl](https://unicornt-store.keber.cl)
🔗 **Repositorio:** [github.com/keber/unicornt-store-frontend](https://github.com/keber/unicornt-store-frontend)

---

## Descripción

Unicorn't Store es un e-commerce orientado al público tech y gamer. Permite explorar un catálogo de productos, ver el detalle de cada uno, gestionar un carrito de compras persistente y completar un checkout con formulario validado — todo servido de forma estática (sin backend propio todavía; ver [Roadmap](#roadmap)).

El proyecto pasó por una refactorización completa desde una base 100% JavaScript vanilla sin build hacia una arquitectura modular en TypeScript estricto. El detalle completo de esa migración, etapa por etapa, vive en [REFACTOR-GUIDE.md](REFACTOR-GUIDE.md) y [docs/etapa-1-baseline.md](docs/etapa-1-baseline.md).

---

## Funcionalidades

- **Catálogo de productos** — grilla responsiva con 49 poleras organizadas por categoría (DevOps, IT Crowd, Programador, Personajes, Linux, QA, General, etc.), cargado de forma asíncrona con estado de carga y fallback con reintentar.
- **Página de detalle** — imagen ampliada, descripción, selector de cantidad y botón de agregar al carrito.
- **Carrito offcanvas** — sidebar deslizable con resumen de items, ajuste de cantidades, eliminación individual, vaciado completo y total en tiempo real.
- **Checkout con formulario real** — nombre, email y dirección, validados en el cliente con errores por campo y foco automático en el primer campo inválido; envío simulado con latencia real y manejo de éxito/error.
- **Persistencia** — el carrito se guarda en `localStorage` y sobrevive al recargar la página.
- **Feedback visual** — toast de confirmación, badge con contador en el ícono del carrito, spinners durante las operaciones asíncronas.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Build | Vite (multipágina: `index.html` + `product.html`, sin router) |
| Lenguaje | TypeScript en modo `strict`, sin `any` |
| UI | Bootstrap 5 (dependencia npm, no CDN) + CSS custom con variables |
| Iconografía | Font Awesome 6.5.1 (CDN) |
| Lint / formato | ESLint (flat config, `typescript-eslint` strict + stylistic) / Prettier |
| Pruebas | Vitest + jsdom |
| Persistencia | `localStorage`, validado en runtime (nunca se confía en `JSON.parse` a ciegas) |
| CI / Deploy | GitHub Actions — ver [CI/CD](#cicd) |
| Imágenes | WebP optimizadas con `sharp` (Node.js, solo en desarrollo) |

---

## Arquitectura

```
src/
├── api/            # HTTP/fetch crudo, devuelve `unknown`; errores tipados (ApiError)
├── models/         # Contratos TS: interfaces, enums cerrados (as const), type guards
├── services/       # Valida (api → DTO) y mapea a modelos; orquesta reglas de negocio
├── storage/        # Lectura/escritura de localStorage, validada
├── components/     # Funciones puras que devuelven HTML (o envuelven un widget de Bootstrap)
├── views/          # Orquestan api + servicios + componentes + eventos del DOM
├── lib/            # Utilidades: guardias de DOM, moneda, cantidades, feedback de botones
└── pages/          # Entrypoints de Vite (uno por página), con fallback global
```

Flujo de datos: `api` (fetch crudo) → `models` (valida y tipa) → `services` (mapea y aplica reglas) → `views` (pinta el DOM y escucha eventos) → `components` (generan el HTML). Ninguna capa salta a la que no le corresponde: las vistas nunca llaman `fetch()` directamente, ni los componentes tocan `localStorage`.

**Guardias de DOM** (`src/lib/dom.ts`): ningún módulo llama `document.getElementById(...)`/`querySelector(...)` y encadena `.addEventListener` sin comprobar `null`. `requireElement()`, `requireElementOfType()` y `assertElementType()` (una assertion function real de TypeScript) son el único punto de acceso al DOM.

---

## Instalación local

Requiere Node.js 22+.

```bash
git clone https://github.com/keber/unicornt-store-frontend.git
cd unicornt-store-frontend
npm ci
npm run dev
```

### Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo de Vite con recarga en caliente |
| `npm run build` | `tsc --noEmit` (type-check) + `vite build` → genera `dist/` |
| `npm run preview` | Sirve `dist/` localmente, para probar el build de producción tal cual se despliega |
| `npm test` | Corre la suite de Vitest una vez |
| `npm run test:watch` | Vitest en modo watch |
| `npm run lint` | ESLint sobre todo `src/` y los archivos de configuración |
| `npm run format` / `npm run format:check` | Prettier, aplica o solo verifica |
| `npm run process-images` | Regenera las 3 variantes WebP por producto (ver [Imágenes](#imágenes)) |

---

## Pruebas

Vitest + jsdom, con tests colocados junto al código que prueban (`*.test.ts`). Cobertura actual: modelos y type guards, capa API (red/HTTP/JSON inválido/payload inválido), servicios (operaciones puras del carrito, checkout), storage (recuperación ante `localStorage` corrupto), componentes (render de tarjetas/detalle/carrito vacío y con productos), vistas (delegación de eventos y cantidades, `aria-busy` durante la carga, envío exitoso/fallido del checkout) y el arranque de ambas páginas, incluido el fallback global.

```bash
npm test
```

---

## CI/CD

Dos workflows de GitHub Actions, separados a propósito:

- **`.github/workflows/ci.yml`** — corre en cada push a `main`/`refactor`/`etapas/**` y en PRs: `npm ci` → `format:check` → `lint` → `test` → `build`. Nunca publica nada, solo valida.
- **`.github/workflows/static.yml`** — se dispara con cada push a `main`. Corre el mismo gate de calidad y, si pasa, construye con Vite y publica **únicamente `dist/`** a GitHub Pages (no el repositorio completo). El dominio personalizado se configura en *Settings → Pages* del repositorio, no requiere un archivo `CNAME` en el código al desplegar vía GitHub Actions.

---

## Imágenes

Cada producto tiene tres versiones WebP, servidas desde `public/assets/img/` (todo lo que vive bajo `public/` Vite lo copia tal cual a `dist/`):

| Sufijo | Tamaño | Uso |
|---|---|---|
| `.webp` | 800×800 px | Página de detalle |
| `-card.webp` | 480×480 px | Cards del catálogo |
| `-thumb.webp` | 150×150 px | Miniaturas en el carrito |

Para regenerar las imágenes a partir de los originales:

```bash
npm run process-images
```

> Los originales de respaldo se guardan en `assets/img/originals/` (excluido de git, fuera de `public/` para no publicarlos con el sitio).

---

## Roadmap

Este repositorio es la base frontend de un proyecto mayor con hitos adicionales: DDD sobre una base de dominio separada, y un backend en Spring Boot (API REST + PostgreSQL + Swagger) que reemplazará el catálogo estático (`public/data/products.json`) y el checkout simulado (`src/api/checkout.api.ts`) por servicios reales. La capa `api/` está deliberadamente aislada para que ese cambio no toque `services/`, `views/` ni `components/`.

---

## Paleta de colores

| Variable | Valor | Uso |
|---|---|---|
| `--brand` | `#7c3aed` | Color principal (violeta) |
| `--brand-dark` | `#5b21b6` | Hover de botones |
| `--brand-light` | `#ede9fe` | Fondos suaves, fill de imágenes |
| `--accent` | `#ec4899` | Badges y acentos (rosa) |
| `--footer-bg` | `#1e1b4b` | Fondo del footer |
