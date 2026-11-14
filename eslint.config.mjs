import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // One styling system: tailwind-variants (tv) via @/lib/utils.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "class-variance-authority",
              message:
                "Use tv from '@/lib/utils' (tailwind-variants) instead of cva.",
            },
            {
              name: "cn",
              message:
                "Import cn from '@/lib/utils' — it re-exports tailwind-variants.",
            },
          ],
        },
      ],
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
