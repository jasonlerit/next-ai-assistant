import { z } from "zod"

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_LOGGER: z
    .string()
    .transform((value) => value === "true")
    .default("false"),
})
