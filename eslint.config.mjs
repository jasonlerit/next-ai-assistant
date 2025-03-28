import { FlatCompat } from "@eslint/eslintrc"
import n from "eslint-plugin-n"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mjs"],
    ignores: ["src/components/ui/*", "src/hooks/*"],
    plugins: { n },
    rules: {
      "n/no-process-env": "error",
      "no-console": "error",
    },
  },
]

export default eslintConfig
