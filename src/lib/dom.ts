/**
 * Guardias de DOM centralizadas. Objetivo explicito de la rubrica del
 * Hito 2 ("Renderizado Seguro y Gestion de Eventos"): ningun modulo de
 * vistas/componentes debe llamar `document.getElementById(...)` o
 * `.querySelector(...)` y encadenar `.addEventListener` directamente
 * sin comprobar null, ni usar el operador `!` (bloqueado ademas por
 * @typescript-eslint/no-non-null-assertion en eslint.config.js).
 */

export class MissingElementError extends Error {
  constructor(selector: string) {
    super(`No se encontro el elemento requerido: "${selector}".`);
    this.name = "MissingElementError";
  }
}

export class UnexpectedElementTypeError extends Error {
  constructor(selector: string, expected: string) {
    super(`El elemento "${selector}" no es una instancia de ${expected}.`);
    this.name = "UnexpectedElementTypeError";
  }
}

/** Como document/Element, pero solo el subconjunto que usamos (facil de mockear en tests). */
export type ElementSource = Pick<ParentNode, "querySelector">;

/**
 * Busca un elemento opcional. Es la version explicita de
 * `document.querySelector`: existe para que el resto del codigo nunca
 * mezcle "puede no estar" con "debe estar" (ver requireElement).
 */
export function queryElement(selector: string, root: ElementSource = document): Element | null {
  return root.querySelector(selector);
}

/** Busca un elemento que DEBE existir; lanza si falta en vez de dejar pasar un null silencioso. */
export function requireElement(selector: string, root: ElementSource = document): Element {
  const element = queryElement(selector, root);
  if (element === null) {
    throw new MissingElementError(selector);
  }
  return element;
}

/**
 * Asercion especializada: confirma en runtime (via `instanceof`, nunca
 * `as`) que un elemento es del tipo concreto esperado antes de acceder a
 * APIs propias de ese tipo (`.value`, `.disabled`, `.reset()`, etc).
 */
export function assertElementType<T extends Element>(
  element: Element,
  ctor: new () => T,
  selector: string,
): asserts element is T {
  if (!(element instanceof ctor)) {
    throw new UnexpectedElementTypeError(selector, ctor.name);
  }
}

/** Combina requireElement + assertElementType: la forma habitual de pedir un input, boton, etc. */
export function requireElementOfType<T extends Element>(
  selector: string,
  ctor: new () => T,
  root: ElementSource = document,
): T {
  const element = requireElement(selector, root);
  assertElementType(element, ctor, selector);
  return element;
}

/**
 * `event.target` es `EventTarget | null`: puede no ser un Element (p.ej.
 * un nodo de texto, o `null`). Este helper valida `instanceof Element`
 * antes de llamar `.closest()`, en vez de asumirlo como hacia el
 * `e.target.closest(...)` directo del app.js legado.
 */
export function closestFromEventTarget(
  target: EventTarget | null,
  selector: string,
): Element | null {
  if (!(target instanceof Element)) {
    return null;
  }
  return target.closest(selector);
}

/**
 * Lee `data-id` de un elemento (patron usado en cards, botones e inputs
 * del carrito) como numero, validando que exista y sea un entero valido
 * en vez de propagar `NaN` silenciosamente como hacia
 * `parseInt(btn.dataset.id, 10)` en el app.js legado.
 */
export function requireDataId(element: Element): number {
  assertElementType(element, HTMLElement, "[data-id]");
  const raw = element.dataset.id;
  const id = raw === undefined ? Number.NaN : Number.parseInt(raw, 10);
  if (!Number.isInteger(id)) {
    throw new TypeError(
      `El elemento no tiene un data-id numerico valido (recibido: "${raw ?? ""}").`,
    );
  }
  return id;
}
