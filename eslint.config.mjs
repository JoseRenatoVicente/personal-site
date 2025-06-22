import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

/** @type {import('eslint').Linter.Config[]} */
const config = [
  { ignores: [".next/**", "public/**"] },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...tailwind.configs["flat/recommended"],
  ...compat.config({
    extends: ["next"],
    settings: {
      next: {
        rootDir: ".",
      },
    },
  }),
  ...compat.config({
    extends: ["plugin:drizzle/all"],
  }),
  {
    rules: {
      "no-undef": "error",
      "react/react-in-jsx-scope": "off",
      "tailwindcss/no-custom-classname": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "unicorn/prevent-abbreviations": "off",
      "tailwindcss/classnames-order": "off",
      "tailwindcss/enforces-shorthand": "off",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "no-console": "error",
    },
  },
]
export default config