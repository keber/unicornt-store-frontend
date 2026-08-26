# Contexto del Proyecto - Unicorn't Store

> Documento de referencia para agentes o etapas futuras del proyecto.
> Generado a partir del estado actual del frontend MVP (marzo 2026).

---

## 1. Descripción del negocio

**Unicorn't Store** es una tienda en línea de **poleras y tazones geek/memes**, orientada al público tech, desarrolladores y entusiastas de la cultura de internet. El nombre es un juego de palabras con "unicorn" (startup unicornio) + apóstrofe de negación.

- **Dominio:** unicornt-store.keber.cl
- **Repositorio:** https://github.com/keber/unicornt-store-frontend
- **Estado actual:** Frontend MVP estático (sin backend, sin autenticación, sin pagos reales)

---

## 2. Modelo de productos (estado actual)

### 2.1 Categorías de producto

El catálogo actual cuenta con **49 productos**, todos de tipo **Polera**. Existe intención de agregar **tazones** en el futuro. Los productos están organizados en subcategorías temáticas:

| Subcategoría | Productos | Descripción temática |
|---|---|---|
| `pm` | 1 | Project management / gestión |
| `cloud` | 1 | Arquitectura cloud |
| `devops` | 6 | DevOps, CI/CD, Docker, deployments |
| `enigma` | 2 | Máquina Enigma, criptografía histórica |
| `general` | 5 | Memes generales (Stonks, This Is Fine, Don Ramón, etc.) |
| `it-crowd` | 16 | Referencias a la serie IT Crowd |
| `linux` | 1 | Linux / CLI |
| `personajes` | 6 | Personajes tech (Turing, Tesla, Chuck Norris) |
| `programador` | 9 | Memes de programación (CSS, testing, reuniones) |
| `qa` | 2 | Quality Assurance / testing |

### 2.2 Estructura de datos de un producto (frontend)

```js
{
  id: number,           // identificador único secuencial (1–49)
  name: string,         // nombre del producto
  category: "Polera" | "Tazón",
  subcategory: string,  // slug de la categoría temática
  price: number,        // precio en CLP (pesos chilenos), sin decimales
  description: string,  // descripción corta (1–3 oraciones)
  image: string         // ruta base sin extensión, e.g. "assets/img/devops/breaking-prod"
}
```

### 2.3 Rango de precios observado

- Mínimo: **$12.990 CLP**
- Máximo: **$15.990 CLP**
- Los precios varían por complejidad/temática del diseño, no por tipo de producto (todos son poleras actualmente)

---

## 3. Modelo del carrito (estado actual)

El carrito se implementa **100% en el frontend**, sin backend:

```js
// Clave en localStorage
"unicornt_cart" → Array<{ id: number, qty: number }>
```

### Operaciones actuales

| Operación | Descripción |
|---|---|
| Agregar | Añade producto o incrementa `qty` si ya existe |
| Eliminar | Remueve un ítem por `id` |
| Cambiar cantidad | Actualiza `qty`; si `qty ≤ 0` elimina el ítem |
| Vaciar | Reemplaza el array por `[]` |
| Calcular total | `Σ (price × qty)` cruzando con el catálogo |
| Finalizar compra | Simula checkout: vacía carrito y muestra toast de confirmación |

> ⚠️ **No existe orden real, pago, usuario ni persistencia server-side.** Esta es la brecha más crítica para la siguiente etapa.

---

## 4. Páginas y flujo de usuario

```
index.html  (Home / catálogo)
│
├── Grilla de 49 cards de productos
│   ├── Imagen, nombre, descripción truncada, precio
│   ├── Botón "Agregar al carrito" → agrega y muestra toast
│   └── Botón "Ver más" → navega a product.html?id={id}
│
├── Navbar (sticky)
│   ├── Logo → index.html
│   ├── Link "Inicio" (aria-current="page")
│   ├── Link "Contacto" → #contacto (sección footer)
│   └── Botón carrito → abre offcanvas lateral
│
└── Offcanvas del carrito (derecha)
    ├── Lista de ítems con imagen, nombre, precio, qty editable
    ├── Botones eliminar por ítem
    ├── Total calculado en tiempo real
    ├── Botón "Finalizar compra" (simulado)
    └── Botón "Vaciar carrito"

product.html  (Detalle de producto)
│
├── Breadcrumb: Inicio > {nombre del producto}
├── Imagen grande (800×800 WebP)
├── Badge de categoría, nombre, precio, descripción completa
├── Selector de cantidad (+ / −, input numérico, min 1 / max 99)
├── Botón "Agregar al carrito" (con qty seleccionada)
└── Botón "← Volver" → index.html
```

---

## 5. Arquitectura técnica del frontend

### Stack

| Capa | Tecnología |
|---|---|
| Markup | HTML5 semántico (`header`, `nav`, `main`, `section`, `article`, `footer`, `address`) |
| Estilos | Bootstrap 5.3.8 (CDN) + CSS custom con variables |
| Íconos | Font Awesome 6.5.1 (CDN) |
| Lógica | JavaScript vanilla ES6+ (sin frameworks) |
| Persistencia | `localStorage` del navegador |
| Imágenes | WebP optimizadas con `sharp` (Node.js, solo dev) |

### Archivos JS

| Archivo | Responsabilidad |
|---|---|
| `assets/js/products.js` | Array `products[]` con los 49 productos (datos estáticos) |
| `assets/js/cart.js` | CRUD del carrito + renderizado del offcanvas |
| `assets/js/app.js` | Renderizado de páginas, eventos, inicialización |

### Convención de imágenes

Cada producto tiene **3 versiones WebP** generadas desde los originales:

| Sufijo | Resolución | Uso |
|---|---|---|
| `.webp` | 800×800 px | Página de detalle |
| `-card.webp` | 480×480 px | Cards del catálogo |
| `-thumb.webp` | 150×150 px | Miniaturas en el carrito |

Ruta base: `assets/img/{subcategory}/{slug}` (sin extensión en `products.js`)

---

## 6. Paleta de marca

| Variable CSS | Valor | Uso |
|---|---|---|
| `--brand` | `#7c3aed` | Color principal (violeta) |
| `--brand-dark` | `#5b21b6` | Hover de botones |
| `--brand-light` | `#ede9fe` | Fondos suaves, fill de imágenes |
| `--accent` | `#ec4899` | Badges, precios, acentos (rosa) |
| `--footer-bg` | `#1e1b4b` | Fondo del footer |

---

## 7. Entidades implícitas (sin backend aún)

Estas entidades existen de forma lógica en el frontend y deberán modelarse formalmente en etapas futuras:

### Producto
```
id           integer   PK
name         string
category     string    enum: ["Polera", "Tazón"]
subcategory  string    slug temático
price        integer   CLP, sin decimales
description  text
image_base   string    ruta base sin extensión
```

### Item de carrito (transitorio, en localStorage)
```
product_id   integer   FK → Producto
qty          integer   min 1
```

### Orden (inexistente, futura)
```
id           - no implementado
user_id      - no hay autenticación
items[]      - derivado del carrito
total        - calculado en frontend
status       - no implementado ("simulado" al hacer checkout)
created_at   - no implementado
```

### Usuario (inexistente, futura)
```
- No existe ninguna capa de autenticación o sesión
- El carrito es anónimo y vive en el navegador del cliente
```

---

## 8. Brechas y trabajo pendiente por etapa

### Backend / API
- No existe ningún endpoint. Todos los datos son estáticos en `products.js`
- Se necesitará una API REST o GraphQL para: productos, órdenes, usuarios, stock
- El carrito deberá migrarse a server-side (o sincronizarse) para usuarios autenticados

### Base de datos
- No existe esquema de datos
- Entidades candidatas: `products`, `categories`, `orders`, `order_items`, `users`, `addresses`
- Precios en CLP sin decimales → `INTEGER` o `NUMERIC(10,0)` es suficiente
- Imágenes: solo se almacena el slug base; las versiones WebP son generadas en tiempo de build

### Autenticación
- No existe ningún sistema de login/registro
- El flujo de "Finalizar compra" es completamente simulado (vacía carrito + toast)

### Pagos
- No integrado. Candidatos para Chile: Transbank Webpay, Mercado Pago, Flow

### Stock / inventario
- No modelado. Actualmente no hay límite de unidades por producto
- El campo `max` en el selector de cantidad está hardcodeado a `99`

### Despliegue
- Actualmente: GitHub Pages (dominio personalizado `unicornt-store.keber.cl` via CNAME)
- Para una versión con backend: se necesitará un servidor (Node/Python/etc.) + base de datos + posiblemente contenedores

### Búsqueda y filtros
- No implementados en el MVP
- El catálogo se muestra completo sin opciones de filtrar por subcategoría, precio o texto

---

## 9. Convenciones de código

- **Nombrado de archivos:** kebab-case en todo (imágenes, carpetas, JS)
- **Idioma:** Español neutro (sin voseo) en toda la UI
- **Moneda:** CLP chileno, formateado con `toLocaleString("es-CL")` → `$13.990`
- **IDs de producto:** Enteros secuenciales desde 1, sin gaps en el MVP actual
- **Sin framework JS:** Todo vanilla, sin jQuery, sin React/Vue/Angular
- **Sin build tool:** No hay bundler (Webpack, Vite, etc.). Los scripts se cargan directamente en el HTML

---

## 10. Repositorio y ramas

- **Repositorio:** https://github.com/keber/unicornt-store-frontend
- **Rama principal:** `main`
- **Estrategia de ramas:** Se ha usado `dev` para desarrollo, con PRs hacia `main`
- **Template de PR:** `.github/pull_request_template.md` (con checklist adaptado al proyecto)
