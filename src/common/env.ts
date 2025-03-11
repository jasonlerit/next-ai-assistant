/* eslint-disable no-console */
/* eslint-disable n/no-process-env */

import { envSchema } from "@/common/schemas/env.schema"
import { loadEnvConfig } from "@next/env"
import { z, ZodError } from "zod"

const projectDir = process.cwd()
loadEnvConfig(projectDir)

type env = z.infer<typeof envSchema>

let env: env

try {
  env = envSchema.parse(process.env)
} catch (e) {
  const error = e as ZodError
  console.error("❌ Invalid env:", error.flatten().fieldErrors)
  process.exit(1)
}

export default env
