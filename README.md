# Unicorn't Store — Frontend MVP

🔗 **Repositorio:** [github.com/keber/unicornt-store-frontend](https://github.com/keber/unicornt-store-frontend)

Tienda en línea de poleras y tazones geek/memes, desarrollada como proyecto frontend con HTML5 semántico, Bootstrap 5 y JavaScript vanilla.

🌐 **Demo:** [unicornt-store.keber.cl](https://unicornt-store.keber.cl)

---

## Descripción

Unicorn't Store es un e-commerce estático orientado al público tech y gamer. Permite explorar un catálogo de productos, ver el detalle de cada uno y gestionar un carrito de compras persistente, todo sin backend ni frameworks JavaScript.

---

## Funcionalidades

- **Catálogo de productos** — grilla responsiva con 49 poleras organizadas por categoría (DevOps, IT Crowd, Programador, Personajes, Linux, QA, General, etc.)
- **Página de detalle** — imagen ampliada, descripción, selector de cantidad y botón de agregar al carrito
- **Carrito offcanvas** — sidebar deslizable con resumen de items, ajuste de cantidades, eliminación individual, vaciado completo y total en tiempo real
- **Persistencia** — el carrito se guarda en `localStorage` y sobrevive al recargar la página
- **Feedback visual** — toast de confirmación al agregar productos, badge con contador en el ícono del carrito

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura de páginas |
| Bootstrap 5.3.8 (CDN) | Layout, componentes (navbar, offcanvas, cards, toasts) |
| Font Awesome 6.5.1 (CDN) | Iconografía |
| CSS custom (variables) | Paleta de marca, estilos propios |
| JavaScript vanilla (ES6+) | Lógica de catálogo, carrito y renderizado |
| localStorage | Persistencia del carrito |
| Node.js + sharp | Script de procesamiento de imágenes (dev only) |

---

## Estructura del proyecto

```
├── index.html              # Home — grilla de productos
├── product.html            # Detalle de producto
├── assets/
│   ├── css/
│   │   └── main.css        # Estilos y variables de marca
│   ├── js/
│   │   ├── products.js     # Catálogo de 49 productos
│   │   ├── cart.js         # Lógica de carrito (CRUD + render)
│   │   └── app.js          # Renderizado de páginas y eventos
│   └── img/                # Imágenes WebP en 3 tamaños por producto
│       ├── devops/
│       ├── it-crowd/
│       ├── programador/
│       ├── personajes/
│       ├── general/
│       ├── qa/
│       ├── linux/
│       ├── cloud/
│       └── pm/
├── scripts/
│   └── process-images.js   # Procesamiento y optimización de imágenes
└── package.json
```

---

## Imágenes

Cada producto tiene tres versiones WebP generadas con `sharp`:

| Sufijo | Tamaño | Uso |
|---|---|---|
| `.webp` | 800×800 px | Página de detalle |
| `-card.webp` | 480×480 px | Cards del catálogo |
| `-thumb.webp` | 150×150 px | Miniaturas en el carrito |

Para regenerar las imágenes a partir de los originales:

```bash
npm install
npm run process-images
```

> Los originales se guardan en `assets/img/originals/` (excluido de git).

---

## Instalación local

No requiere servidor ni dependencias de runtime. Basta con clonar y abrir con Live Server:

```bash
git clone https://github.com/keber/unicornt-store-frontend.git
cd unicornt-store-frontend
# Abrir index.html con Live Server en VS Code, PrePros o similar
```

---

## Paleta de colores

| Variable | Valor | Uso |
|---|---|---|
| `--brand` | `#7c3aed` | Color principal (violeta) |
| `--brand-dark` | `#5b21b6` | Hover de botones |
| `--brand-light` | `#ede9fe` | Fondos suaves, fill de imágenes |
| `--accent` | `#ec4899` | Badges y acentos (rosa) |
| `--footer-bg` | `#1e1b4b` | Fondo del footer |
