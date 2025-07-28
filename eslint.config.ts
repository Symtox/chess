import js from "@eslint/js";
import globals from "globals";
import tsEslint from "typescript-eslint";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

const tsLintConfig = tsEslint.config(
  tsEslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/array-type': [
        'error',
        {
          'default': 'array-simple'
        }
      ]
    }
  }
)

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tsLintConfig,
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
    ignores: ['package*']
  },
  //TODO needs update for baseline
  // {
  //   files: ["**/*.css"],
  //   plugins: { css },
  //   language: "css/css",
  //   extends: ["css/recommended"],
  // },
]);
