import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const parents = pgTable("parents", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const children = pgTable(
  "children",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentId: uuid("parent_id")
      .notNull()
      .references(() => parents.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    ageBand: text("age_band", { enum: ["4-7", "8-12", "13+"] }).notNull(),
    presentationToken: text("presentation_token").notNull(),
    currency: text("currency", { enum: ["KZT"] })
      .notNull()
      .default("KZT"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("children_parent_id_idx").on(table.parentId)],
);
