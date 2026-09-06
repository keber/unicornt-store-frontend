[![CI](https://github.com/keber/unicornt-store-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/keber/unicornt-store-frontend/actions/workflows/ci.yml)
[![Unit tests](https://github.com/keber/unicornt-store-frontend/actions/workflows/unit-report.yml/badge.svg)](https://unicornt-store.keber.cl/unit/main/)
[![Coverage](https://unicornt-store.keber.cl/unit/main/badges/coverage.svg)](https://unicornt-store.keber.cl/unit/main/coverage/)
[![E2E](https://github.com/keber/unicornt-store-frontend/actions/workflows/e2e-live.yml/badge.svg)](https://github.com/keber/unicornt-store-frontend/actions/workflows/e2e-live.yml)
[![Playwright](https://img.shields.io/badge/tested%20with-Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)

# Unicorn't Store — Frontend

Storefront for the Unicorn't store, built with **Vite + strict TypeScript**, no UI
framework, Bootstrap 5 as an npm dependency. It talks to the
[Unicornt Store backend](../unicornt-store-backend) (Spring Boot + PostgreSQL) over
its REST API — catalog, cart, checkout and JWT auth. Together they are the
*Final Delivery* full-stack system.

## What it does

- **Catalog** from the real backend (`GET /api/v1/products`) with a loading state,
  a retry fallback and a category filter (`GET /api/v1/categories`).
- **Product detail** page.
- **Cart** — an offcanvas panel. Anonymous carts live in `localStorage`; on login
  they are merged into the server cart (`POST /api/v1/cart/merge`) and the local
  copy is cleared.
- **Checkout** — a validated form (name, email, street, city, region, zip) that
  `POST`s the shipping address to `/api/v1/orders`; the backend takes the items
  from the server cart, decrements stock and confirms the order in one transaction.
  Success shows the order id; an out-of-stock rejection keeps the cart.
- **Auth** — login / register pages, a single token-storage boundary, one shared
  `apiFetch` that attaches the bearer header.
- **Admin** — a minimal product module (list, create/edit, delete) gated behind a
  `ROLE_ADMIN` session; a non-admin sees a clear message, never a broken screen.

## Stack

| Layer | Technology |
|-------|------------|
| Build | Vite — multipage (`index.html`, `product.html`, `login.html`, `register.html`, `admin.html`), no router |
| Language | TypeScript `strict`, **0 `any`**, 0 unsafe non-null assertions |
| UI | Bootstrap 5 (npm) + custom CSS |
| Lint / format | ESLint flat config (`typescript-eslint` strict + stylistic) / Prettier |
| Tests | Vitest + jsdom, `@vitest/coverage-v8` |

## Architecture

```
src/
├── api/         raw fetch via the shared apiFetch (base URL, JSON, bearer, 401); returns `unknown`
├── gateways/    ProductGateway / CheckoutGateway ports + Http* implementations
├── models/      DTO interfaces + runtime type guards + DTO → model mappers
│                (the model never imports the DTO — the mapper bridges them)
├── services/    validate + map + orchestrate; depend on a gateway port, not on api/
├── storage/     localStorage access, validated (cart, auth token)
├── adapters/    the FormData boundary (checkoutForm) kept out of the pure model
├── views/       safe DOM (textContent, typed queries, preventDefault); submitting/success/error states
└── pages/       one bootstrap entry per HTML page
```

## Requirements

- Node 20+
- The backend running on `http://localhost:8080` (see its README)

## Environment

```bash
cp .env.example .env.local
# VITE_API_BASE_URL=http://localhost:8080   (default when unset)
```

Only `VITE_*` variables reach the bundle. `.env*` files are git-ignored
(`.env.example` excepted).

## Reproduce from scratch

```bash
# backend first (see ../unicornt-store-backend/README.md)
cd ../unicornt-store-backend && docker compose up -d db && \
  SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run

# frontend
cd ../unicornt-store-frontend
cp .env.example .env.local
npm install
npm run dev            # http://localhost:5173

npm test               # Vitest
npm run lint           # ESLint
npm run build          # tsc --noEmit && vite build
```

## Demo flow

1. Open `http://localhost:5173` — the catalog renders from PostgreSQL, no CORS error.
2. Add a couple of products (anonymous cart in `localStorage`).
3. Go to `/register.html`, create an account — you are signed in and the local cart
   is merged into your server cart.
4. Open the cart, **Finalizar compra**, fill the address, submit — the order is
   confirmed, the cart empties, stock drops on the backend.
5. For the admin module: sign in with a `ROLE_ADMIN` account and open `/admin.html`.
