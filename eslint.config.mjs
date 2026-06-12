import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Content site: many text-heavy pages with quotes in natural language
      "react/no-unescaped-entities": "off",
      // Content site: data types are dynamic, allow any in data-handling code
      "@typescript-eslint/no-explicit-any": "off",
      // Allow img elements for external tool logos (not all support next/image)
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
