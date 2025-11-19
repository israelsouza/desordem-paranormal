import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const page = sqliteTable("page", {
  id: int().primaryKey(),
  name: text().notNull(),
  link: text().notNull(),
  html: text().notNull(),
});

export const page_connection = sqliteTable("page_connection", {
  id: int().primaryKey({ autoIncrement: true }),
  page_id: int()
    .notNull()
    .references(() => page.id),
  connection_id: int()
    .notNull()
    .references(() => connection.id),
});

export const connection = sqliteTable("connections", {
  id: int().primaryKey({ autoIncrement: true }),
  originPage: int()
    .notNull()
    .references(() => page.id),
  targetPage: int()
    .notNull()
    .references(() => page.id),
});
