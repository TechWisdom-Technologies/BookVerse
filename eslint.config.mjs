import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "postcss.config.js",
      "next.config.js",
      "prisma.config.ts",
      "tailwind.config.ts",
      ".eslintrc.json",
      "middleware.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
);
