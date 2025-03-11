import env from "@/common/env"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./src/app/db/migrations",
  schema: "./src/app/db/schemas",
})
