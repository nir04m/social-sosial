import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.config({
    extends: ['next'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  }),
  
  // disable unescaped-entities in any not-found.tsx under profile/*
  {
    files: ["src/app/profile/*/not-found.tsx"],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },

  // disable <img> warning in your components/pages
  {
    files: ["src/app/**/*.{tsx,jsx}", "src/components/**/*.{tsx,jsx}"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },

  // silence Prisma-generated wrapper-type & any rules
  {
    files: ["src/generated/**", "node_modules/.prisma/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
    },
  },
];

export default eslintConfig;
