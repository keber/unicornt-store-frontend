// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "assets/**", "scripts/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // La rubrica del Hito 2 exige cero "any" y estados con enums, no strings libres.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  {
    files: ["*.config.{js,ts}", "eslint.config.js"],
    ...tseslint.configs.disableTypeChecked,
  },
  eslintConfigPrettier,
);
