import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schemas"
import env from "@/common/env"

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

const db = drizzle({
  client: pool,
  casing: "snake_case",
  logger: env.DATABASE_LOGGER,
  schema,
})

export default db
