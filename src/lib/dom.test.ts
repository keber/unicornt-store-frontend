import { beforeEach, describe, expect, it } from "vitest";
import {
  MissingElementError,
  UnexpectedElementTypeError,
  assertElementType,
  closestFromEventTarget,
  queryElement,
  requireDataId,
  requireElement,
  requireElementOfType,
} from "@/lib/dom";

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("queryElement", () => {
  it("devuelve el elemento si existe", () => {
    document.body.innerHTML = '<div id="foo"></div>';
    expect(queryElement("#foo")).not.toBeNull();
  });

  it("devuelve null si no existe, sin lanzar", () => {
    expect(queryElement("#nope")).toBeNull();
  });

  it("busca dentro de una raiz especifica, no solo document", () => {
    document.body.innerHTML = '<div id="root"><span id="inner"></span></div>';
    const root = requireElement("#root");
    expect(queryElement("#inner", root)).not.toBeNull();
    expect(queryElement("#nonexistent-outside", root)).toBeNull();
  });
});

describe("requireElement", () => {
  it("devuelve el elemento si existe", () => {
    document.body.innerHTML = '<div id="foo"></div>';
    expect(requireElement("#foo")).toBeInstanceOf(Element);
  });

  it("lanza MissingElementError si no existe", () => {
    expect(() => requireElement("#nope")).toThrow(MissingElementError);
  });
});

describe("assertElementType", () => {
  it("no lanza si el elemento es del tipo esperado", () => {
    document.body.innerHTML = '<input id="foo" />';
    const el = requireElement("#foo");
    expect(() => {
      assertElementType(el, HTMLInputElement, "#foo");
    }).not.toThrow();
  });

  it("lanza UnexpectedElementTypeError si el tipo no calza", () => {
    document.body.innerHTML = '<div id="foo"></div>';
    const el = requireElement("#foo");
    expect(() => {
      assertElementType(el, HTMLInputElement, "#foo");
    }).toThrow(UnexpectedElementTypeError);
  });
});

describe("requireElementOfType", () => {
  it("devuelve el elemento tipado si existe y calza", () => {
    document.body.innerHTML = '<button id="btn"></button>';
    const btn = requireElementOfType("#btn", HTMLButtonElement);
    expect(btn).toBeInstanceOf(HTMLButtonElement);
  });

  it("lanza MissingElementError si no existe", () => {
    expect(() => requireElementOfType("#nope", HTMLButtonElement)).toThrow(MissingElementError);
  });

  it("lanza UnexpectedElementTypeError si existe pero es de otro tipo", () => {
    document.body.innerHTML = '<div id="foo"></div>';
    expect(() => requireElementOfType("#foo", HTMLButtonElement)).toThrow(
      UnexpectedElementTypeError,
    );
  });
});

describe("closestFromEventTarget", () => {
  it("delega en closest() cuando target es un Element", () => {
    document.body.innerHTML = '<div class="wrapper"><button id="btn"></button></div>';
    const btn = requireElement("#btn");
    expect(closestFromEventTarget(btn, ".wrapper")).not.toBeNull();
  });

  it("devuelve null si target no es un Element (p.ej. null)", () => {
    expect(closestFromEventTarget(null, ".wrapper")).toBeNull();
  });

  it("devuelve null si target es un nodo de texto", () => {
    document.body.innerHTML = "<div>texto</div>";
    const textNode = document.body.firstChild?.firstChild ?? null;
    expect(closestFromEventTarget(textNode, "div")).toBeNull();
  });
});

describe("requireDataId", () => {
  it("lee un data-id numerico valido", () => {
    document.body.innerHTML = '<button data-id="42"></button>';
    expect(requireDataId(requireElement("button"))).toBe(42);
  });

  it("lanza TypeError si data-id esta ausente", () => {
    document.body.innerHTML = "<button></button>";
    expect(() => requireDataId(requireElement("button"))).toThrow(TypeError);
  });

  it("lanza TypeError si data-id no es un entero valido", () => {
    document.body.innerHTML = '<button data-id="abc"></button>';
    expect(() => requireDataId(requireElement("button"))).toThrow(TypeError);
  });

  it("lanza UnexpectedElementTypeError si el elemento no es HTMLElement", () => {
    // Un elemento SVG no tiene .dataset como HTMLElement
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    expect(() => requireDataId(svg)).toThrow(UnexpectedElementTypeError);
  });
});
