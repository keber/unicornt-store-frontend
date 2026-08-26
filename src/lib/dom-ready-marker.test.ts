import { describe, expect, it } from "vitest";
import { markViteReady } from "@/lib/dom-ready-marker";

describe("markViteReady", () => {
  it("marca el elemento raiz con data-vite-ready", () => {
    const root = document.createElement("html");

    markViteReady(root);

    expect(root.dataset.viteReady).toBe("true");
  });

  it("usa document.documentElement por defecto", () => {
    markViteReady();

    expect(document.documentElement.dataset.viteReady).toBe("true");
  });
});
