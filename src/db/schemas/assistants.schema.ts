import { users } from "@/db/schemas/users.schema"
import { InferSelectModel, relations } from "drizzle-orm"
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const assistants = pgTable("assistants", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text()
    .notNull()
    .references(() => users.id),
  name: text().notNull(),
  role: text().notNull(),
  model: text().notNull(),
  instruction: text().notNull(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
})

export const assistantsRelations = relations(assistants, ({ one }) => ({
  author: one(users, {
    fields: [assistants.userId],
    references: [users.id],
  }),
}))

export const selectAssistantsSchema = createSelectSchema(assistants)

export const insertAssistantsSchema = createInsertSchema(assistants, {
  name: (s) => s.min(1).max(255),
  role: (s) => s.min(1).max(255),
  model: (s) => s.min(1).max(255),
  instruction: (s) => s.min(1),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const patchAssistantsSchema = insertAssistantsSchema.partial()

export type Assistant = InferSelectModel<typeof assistants>
