## Recomendación

No conviene reconstruir Unicorn’t Store desde cero ni limitarse a renombrar `.js` como `.ts`. Recomiendo una **reconstrucción interna incremental en el mismo repositorio**:

- Conservar catálogo, imágenes, diseño, navegación y comportamiento del carrito.
- Reemplazar progresivamente la arquitectura global por Vite + TypeScript estricto, módulos, capas, componentes DOM y pruebas.
- Mantener la aplicación funcional después de cada etapa.
- Retirar `assets/js/*.js` solo cuando exista paridad funcional comprobada.

Comparé `unicornt-store-frontend` en `76754f6` con `neonpulse-frontend` en `acc1f79`.

## Comparación actual

| Dimensión | Unicorn’t Store | NeonPulse / objetivo |
|---|---|---|
| Lenguaje | JavaScript global y JSDoc | TypeScript `strict`, módulos ES |
| Herramientas | Sin build ni dependencias controladas | Vite, TypeScript, ESLint, Prettier |
| Modelos | Objetos y cadenas libres | Interfaces, tipos cerrados y DTO |
| Datos | Array global en `products.js` | JSON → API → validación → servicio |
| Arquitectura | `app.js` mezcla render, eventos y coordinación | `api / services / views / components / models / lib` |
| DOM | Guardias parciales y accesos potencialmente nulos | `requireElement<T>()` y eventos tipados |
| Formularios | No existen | Submit controlado y payload validado |
| Asincronía | No hay carga o envío asíncrono real | `fetch`, `async/await`, errores y skeleton |
| Pruebas | No existen | Vitest + jsdom y pruebas colocadas |
| Despliegue | GitHub Pages publica todo el repositorio | Debe publicar exclusivamente `dist` |

Puntaje de partida estimado: **3/10**. El gap no está en las funcionalidades de tienda, sino en la base técnica.

# Capa estratégica

## 1. Proteger el producto existente

Definir el comportamiento que debe sobrevivir al refactor: catálogo de 49 productos, detalle, cantidades, carrito persistente, totales, toast, vaciado y checkout.

## 2. Instalar una base técnica equivalente

Convertir el repositorio en un proyecto Vite + TypeScript estricto, con módulos, lint, formato y pruebas, sin modificar todavía la experiencia visible.

## 3. Modelar el dominio y sanear los datos

Transformar productos, categorías, carrito y compra en contratos TypeScript cerrados. Sustituir los datos globales por un payload externo validado en runtime.

## 4. Migrar por funcionalidades verticales

Reconstruir sucesivamente catálogo, detalle, carrito y checkout. Cada funcionalidad debe atravesar todas las capas y quedar probada antes de migrar la siguiente.

## 5. Cubrir explícitamente la rúbrica

Incorporar un formulario seguro y dos flujos asíncronos visibles: carga del catálogo y envío simulado de la compra.

## 6. Elevar calidad y automatización

Agregar pruebas unitarias e integradas, controles automáticos y un pipeline que solo despliegue código compilado y validado.

## 7. Ejecutar el corte definitivo

Comprobar paridad funcional, retirar el JavaScript legado y actualizar despliegue y documentación.

# Capa táctica

## Etapa 1: baseline y seguridad de migración

- Crear una rama de refactor.
- Documentar casos de aceptación del sitio actual.
- Registrar estructura de los 49 productos y rutas de imágenes.
- Mantener `index.html` y `product.html`: Vite puede funcionar como aplicación multipágina; no es necesario introducir un router.
- Definir que cada etapa debe pasar build, lint y pruebas antes de continuar.

## Etapa 2: toolchain

Incorporar, tomando NeonPulse como referencia:

- `package.json`, `package-lock.json`.
- Vite con entradas para `index.html` y `product.html`.
- TypeScript con `strict`, `noImplicitReturns` y módulos ES.
- Alias `@/`.
- ESLint, Prettier, Vitest y jsdom.
- Scripts `dev`, `build`, `test`, `lint` y `format:check`.
- Bootstrap instalado como dependencia en lugar de CDN.

Recomiendo **mantener Bootstrap inicialmente**. Migrar además a Tailwind no aporta puntos a la rúbrica y elevaría mucho el riesgo visual. Si se desea paridad exacta con NeonPulse, hacerlo después del 10/10 como refactor separado.

## Etapa 3: modelos y datos

Crear contratos como:

- `ProductModel`
- `ProductDto`
- `ProductCategory`
- `CartItemModel`
- `CartModel`
- `CheckoutModel`
- `RawCheckoutInput`

Acciones:

- Modelar categorías mediante `as const` y un tipo derivado.
- Mover los productos a `public/data/products.json`.
- Recibir `response.json()` como `unknown`.
- Implementar `isProductDto()` y validar todo el array.
- Convertir DTO a modelo en el servicio.
- Validar también lo recuperado de `localStorage`; no confiar directamente en `JSON.parse`.
- Evitar `any`, strings libres para estados y arrays sin tipo.

## Etapa 4: arquitectura modular

Estructura sugerida:

```text
src/
├── api/
│   ├── product.api.ts
│   ├── checkout.api.ts
│   └── errors.ts
├── models/
├── services/
│   ├── product.service.ts
│   ├── cart.service.ts
│   └── checkout.service.ts
├── storage/
│   └── cart.storage.ts
├── components/
│   ├── ProductCard/
│   ├── ProductDetail/
│   ├── CartPanel/
│   ├── CheckoutForm/
│   ├── LoadingSkeleton/
│   ├── Toast/
│   └── ErrorFallback/
├── views/
│   ├── catalog.view.ts
│   ├── product.view.ts
│   └── checkout.view.ts
├── lib/
│   ├── dom.ts
│   ├── currency.ts
│   └── quantity.ts
└── pages/
    ├── catalog.main.ts
    └── product.main.ts
```

Orden de migración:

1. Catálogo.
2. Detalle de producto.
3. Persistencia y operaciones puras del carrito.
4. Render y eventos del carrito.
5. Checkout.

No trasladar `app.js` completo a `app.ts`: eso conservaría el monolito.

## Etapa 5: DOM y formulario — 3 puntos

- Reutilizar un helper `requireElement<T>()`.
- Validar `event.target instanceof Element` antes de usar `closest()`.
- Tipar botones, inputs, formularios y elementos Bootstrap.
- Eliminar accesos directos como `getElementById(...).addEventListener(...)` sin guardia.
- Convertir “Finalizar compra” en un formulario real de checkout.
- Aplicar `preventDefault()`.
- Extraer datos mediante `FormData`.
- Convertirlos desde `unknown/string` a `CheckoutModel` mediante validación.
- Mostrar errores junto al campo y enfocar el primero inválido.
- Mantener validación de cantidades y límites del carrito.

El checkout es preferible a inventar un formulario de contacto porque reutiliza una funcionalidad existente.

## Etapa 6: asincronía — 4 puntos

### Carga

- `fetchProductsPayload()` carga `/data/products.json`.
- Manejar por separado red, HTTP, JSON inválido y payload incompatible.
- Mostrar skeleton desde el HTML inicial.
- Usar `aria-busy`.
- Reemplazarlo por catálogo o detalle al completar.
- Mostrar fallback visual con opción de reintentar al fallar.
- Limpiar el estado en `finally`.

### Envío

- Implementar `submitOrder()` asíncrono, inicialmente como adaptador simulado.
- Aplicar una latencia controlada para representar el servicio externo.
- Deshabilitar el botón y mostrar spinner durante el envío.
- Manejar éxito y error mediante `try/catch/finally`.
- Vaciar el carrito solamente después de un envío exitoso.
- Mantener el servicio desacoplado para poder sustituirlo luego por un backend real.

Así se cubre literalmente “carga y envío de datos”.

## Etapa 7: pruebas y calidad

Cobertura mínima:

- Type guards de productos.
- Respuesta válida, red caída, HTTP incorrecto, JSON inválido y payload inválido.
- Operaciones puras del carrito.
- Recuperación ante `localStorage` corrupto.
- Render de tarjetas, detalle, carrito vacío y carrito con productos.
- Delegación de eventos y cantidades.
- `preventDefault()` y validación del checkout.
- Envío exitoso y fallido.
- Skeleton y `aria-busy`.
- Fallback global.
- Arranque correcto de ambas páginas.

El pipeline debería ejecutar:

```text
npm ci
npm run format:check
npm run lint
npm test
npm run build
```

## Etapa 8: despliegue y retiro del legado

- Cambiar el workflow actual: no debe subir todo el repositorio.
- Construir con Vite y publicar únicamente `dist`.
- Configurar correctamente el `base` para dominio personalizado/GitHub Pages.
- Preservar `CNAME` si el dominio lo requiere.
- Hacer smoke testing de catálogo, detalle, carrito y checkout.
- Verificar rutas de las 147 imágenes optimizadas.
- Eliminar `assets/js/app.js`, `cart.js` y `products.js` solo después de la paridad.
- Actualizar README, arquitectura, comandos y changelog.

## Nota: conservación del catálogo estático para una futura fase con backend

Este refactor es solo de frontend. Cuando se incorpore un backend real (fuera de alcance aquí), **no eliminar** `public/assets/img/` ni `public/data/products.json` asumiendo que el backend los reemplaza 1:1. Se conservan como modo degradado de solo lectura, con alcance acotado:

- **Qué cubre**: catálogo y detalle de producto cuando el backend no responde.
- **Qué NO cubre**: carrito, checkout ni ninguna operación que dependa de estado vivo del backend. En modo degradado esas acciones muestran error o quedan deshabilitadas; nunca simulan una funcionalidad de escritura que en realidad no existe.
- **Supuesto**: el fallback tiene sentido mientras las imágenes dependan de la misma disponibilidad que el backend (p. ej. un monolito que sirve API y estáticos juntos). Si más adelante las imágenes se separan a un storage/CDN independiente, revisar si el fallback local sigue aportando algo.
- **Riesgo conocido**: el snapshot estático puede desincronizarse del catálogo real (precios, productos descontinuados) si el backend permite catálogo dinámico. Aceptable mientras el catálogo sea prácticamente estático.
- **Trigger de revisión**: la primera vez que el backend permita alta/baja/edición de productos sin pasar por un redeploy del frontend — ahí hay que decidir si el snapshot se regenera en build o si el fallback se retira.

## Definición de terminado

| Rúbrica | Evidencia para cerrar |
|---|---|
| **3/3 Modelado** | `strict`, interfaces, categorías cerradas, DTO y almacenamiento validados, sin `any` |
| **3/3 DOM/Formularios** | Guardias reales, eventos tipados, `preventDefault`, `FormData` y payload limpio |
| **4/4 Asincronía** | Carga y envío con `async/await`, `try/catch/finally`, loading, éxito y error |
| **Calidad equivalente** | Build limpio, lint/formato y suite completa de pruebas |
| **Paridad funcional** | Ninguna regresión visible respecto del sitio actual |

La ruta recomendada es, por tanto, **refactor de producto + reconstrucción de arquitectura**, no un rewrite completo. Los activos de Unicorn’t Store se conservan; lo que se sustituye íntegramente es su infraestructura JavaScript global. Fuentes comparadas: [Unicorn’t Store](https://github.com/keber/unicornt-store-frontend) y [NeonPulse](https://github.com/keber/neonpulse-frontend).