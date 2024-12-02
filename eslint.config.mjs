import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginPrettier from "eslint-plugin-prettier/recommended"; // Prettier plugin
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginPrettier,
  prettierConfig,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-console": "warn",         // Warn for console.log
      "eqeqeq": "error",            // Enforce strict equality checks
      "prettier/prettier": "error", // Ensure Prettier formatting is followed
    },
  },
];