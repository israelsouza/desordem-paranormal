import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const page = sqliteTable("page", {
  id: int().primaryKey(),
  name: text().notNull(),
  link: text().notNull(),
});

export const connection = sqliteTable("connections", {
  id: int().primaryKey({ autoIncrement: true }),
  originPage: int()
    .notNull()
    .references(() => page.id, { onDelete: "cascade" }),
  targetPage: int()
    .notNull()
    .references(() => page.id, { onDelete: "cascade" }),
});
