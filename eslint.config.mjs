import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    ".next-dev-*/**",
    "out/**",
    "build/**",
    "public/**",
    ".codex-snapshots/**",
    "age-gate-boot.js",
    "characters.js",
    "script.js",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
]);
