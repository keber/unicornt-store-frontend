# Etapa 1 — Baseline y seguridad de migración

> Congela el comportamiento y los datos actuales antes de tocar arquitectura.
> Referencia obligatoria para verificar paridad funcional al cierre de cada etapa posterior.
> Ver también [REFACTOR-GUIDE.md](../REFACTOR-GUIDE.md) y [docs/project-context.md](project-context.md).

Fuente verificada: `assets/js/products.js`, `assets/js/app.js`, `assets/js/cart.js` en el commit base de la rama `refactor`.

---

## 1. Casos de aceptación (deben sobrevivir intactos)

### Catálogo (`index.html`)

- [ ] Se renderizan las 49 cards de producto en `#product-list`.
- [ ] Cada card muestra: imagen `-card.webp`, badge de categoría, nombre, descripción, precio formateado (`$13.990`).
- [ ] Botón **Agregar** añade el producto al carrito (qty 1 o incrementa si ya existe), muestra el toast y da feedback visual temporal en el botón ("Agregado", deshabilitado ~1.5s).
- [ ] Botón **Ver más** navega a `product.html?id={id}`.
- [ ] El badge del navbar (`#cart-badge`) refleja la suma de unidades en todo momento, incluida la carga inicial de la página.

### Detalle de producto (`product.html?id=`)

- [ ] Con `id` inválido o inexistente, redirige a `index.html`.
- [ ] Muestra imagen `.webp` (800×800), breadcrumb con el nombre, badge, nombre, precio, descripción completa.
- [ ] Selector de cantidad: botones `−`/`+` y input numérico, rango `min=1` / `max=99`, sin salirse del rango.
- [ ] **Agregar al carrito** usa la cantidad seleccionada, muestra toast personalizado con el nombre del producto y feedback visual en el botón (~1.8s).
- [ ] `document.title` se actualiza con el nombre del producto.

### Carrito (offcanvas, presente en ambas páginas)

- [ ] Se re-renderiza cada vez que se abre (`show.bs.offcanvas`).
- [ ] Carrito vacío: mensaje "El carrito está vacío" y footer oculto.
- [ ] Carrito con ítems: imagen `-thumb.webp`, nombre, precio unitario, selector de cantidad (`−`/input/`+`, clamp 1–99), subtotal por ítem, botón eliminar.
- [ ] Cambiar cantidad (botones o input manual) actualiza persistencia, subtotal y total; `qty ≤ 0` elimina el ítem.
- [ ] **Vaciar carrito** deja el array en `[]` y re-renderiza.
- [ ] **Finalizar compra** (simulado): vacía el carrito, cierra el offcanvas, muestra toast "¡Gracias por tu compra!". No existe orden real (es la funcionalidad que la Etapa 5/6 deben convertir en un formulario con envío async real).
- [ ] Total mostrado = `Σ (price × qty)` de los ítems presentes en el catálogo (ítems huérfanos —id ya no existente— se ignoran silenciosamente, no rompen el render).

### Persistencia

- [ ] Carrito vive en `localStorage["unicornt_cart"]` como `Array<{ id: number, qty: number }>`.
- [ ] Si el valor almacenado es inválido/corrupto, `getCart()` debe degradar a `[]` sin lanzar excepción (comportamiento actual vía `try/catch`; debe preservarse y luego probarse explícitamente en la Etapa 7).

---

## 2. Estructura de datos verificada (49 productos)

Extraído programáticamente de `assets/js/products.js` (no asumido desde documentación previa):

```ts
{
  id: number;          // 1..49, secuencial, sin gaps, sin duplicados
  name: string;
  category: "Polera";  // única categoría presente hoy; "Tazón" es dato futuro (ver docs/project-context.md)
  subcategory: string; // slug temático, ver tabla abajo
  price: number;       // CLP entero, sin decimales
  description: string;
  image: string;       // ruta base sin extensión: "assets/img/{subcategory}/{slug}"
}
```

- **Total:** 49 productos, todos `category: "Polera"`.
- **Rango de precios real:** `$11.990` – `$15.990` CLP.
  - ⚠️ `docs/project-context.md` indica mínimo `$12.990`; el dato correcto verificado en código es `$11.990`. Corregir esa referencia al pasar a la Etapa 3.
- **IDs:** 1–49, contiguos, sin duplicados.

### Subcategorías (para armar `ProductCategory`/subcategoría como `as const`)

| Subcategoría | Productos |
|---|---|
| `pm` | 1 |
| `cloud` | 1 |
| `devops` | 6 |
| `enigma` | 2 |
| `general` | 5 |
| `it-crowd` | 16 |
| `linux` | 1 |
| `personajes` | 6 |
| `programador` | 9 |
| `qa` | 2 |

Total: 49.

---

## 3. Convención de imágenes (verificada)

- Ruta base por producto: `assets/img/{subcategory}/{slug}` (sin extensión en los datos).
- 3 variantes físicas por producto, **147 archivos en total** (49 × 3), confirmado por conteo directo del filesystem excluyendo `assets/img/originals/`:
  - `{slug}.webp` — 800×800 — detalle.
  - `{slug}-card.webp` — 480×480 — catálogo.
  - `{slug}-thumb.webp` — 150×150 — carrito.
- `assets/img/originals/` está y debe seguir en `.gitignore` (fuente de trabajo de `scripts/process-images.js`, no se sirve en producción).

---

## 4. Gate de calidad por etapa

A partir de la Etapa 2 (una vez exista el toolchain), **ninguna etapa se da por cerrada sin que, en su rama `refactor/NN-nombre`, pasen en verde**:

```text
npm run build
npm run lint
npm test
```

La Etapa 1 no tiene build/lint/test propios (es solo documentación y housekeeping de repo), por lo que su cierre se verifica manualmente contra el checklist de la sección 1 (sin cambios de comportamiento, solo se documenta y se corrige tracking de git).

---

## 5. Housekeeping de repositorio resuelto en esta etapa

- `.gitignore` dejaba fuera del control de versiones `package.json`, `package-lock.json` y `scripts/` — impracticable para las etapas 2+ que dependen de un `package.json` real y versionado. Se corrige en esta etapa.
- `.vscode/mcp.json` es configuración personal de herramientas (MCP local), no del proyecto — se agrega a `.gitignore` en lugar de commitearse.
