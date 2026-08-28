/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";

// Multipágina: se conservan index.html y product.html como entradas
// independientes (ver docs/etapa-1-baseline.md); no se introduce un router.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        product: resolve(import.meta.dirname, "product.html"),
      },
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.ts"],
    css: false,
  },
});
