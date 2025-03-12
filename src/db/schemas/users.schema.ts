import { assistants } from "@/db/schemas/assistants.schema"
import { relations } from "drizzle-orm"
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  assistants: many(assistants),
}))
