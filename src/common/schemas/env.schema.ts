import { z } from "zod"

export const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string(),
  DATABASE_URL: z.string().url(),
  DATABASE_LOGGER: z
    .string()
    .transform((value) => value === "true")
    .default("false"),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
})
