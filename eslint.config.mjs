import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
  // Node.js environment for config files
  {
    files: [
      "babel.config.js",
      "jest.config.js",
      "jest.setup.js",
      "postcss.config.js",
      "tailwind.config.js",
      "vite.config.js"
    ],
    languageOptions: {
      globals: globals.node
    }
  }
]);
