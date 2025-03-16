import { AI_MODELS } from "@/common/constants/ai-models"
import { users } from "@/db/schemas/users.schema"
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const assistants = pgTable("assistants", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text()
    .notNull()
    .references(() => users.id),
  name: text().notNull(),
  role: text().notNull(),
  model: text().notNull(),
  systemInstruction: text().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const assistantsRelations = relations(assistants, ({ one }) => ({
  author: one(users, {
    fields: [assistants.userId],
    references: [users.id],
  }),
}))

export const selectAssistantsSchema = createSelectSchema(assistants)

export const insertAssistantsSchema = createInsertSchema(assistants, {
  name: (s) => s.min(1, "Minimum of 1 character").max(255, "Maximum of 255 characters"),
  role: (s) => s.min(1, "Minimum of 1 character").max(255, "Maximum of 255 characters"),
  model: () =>
    z.enum(AI_MODELS.map((model) => model.value) as [string, ...string[]], {
      errorMap: () => ({ message: "Please select a model" }),
    }),
  systemInstruction: (s) => s.min(1, "Minimum of 1 character"),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
})

export const patchAssistantsSchema = insertAssistantsSchema.partial()

export type Assistant = InferSelectModel<typeof assistants>
export type CreateAssistant = Omit<InferInsertModel<typeof assistants>, "id" | "userId">
