import { sql } from "drizzle-orm";
import { db } from "../../index";
import { connection, page } from "../database/schemas";
import { Connection, Page } from "../services/wiki-service";

export class WikiRepository {
  public static async GetWiki() {
    const pages = await db.select().from(page);
    const connections = await db.select().from(connection);

    console.log({ pages, connections });

    return {
      pages: pages,
      connection: connections,
    };
  }

  public static async UpdatePage(Pages: Page[]) {
    await db
      .insert(page)
      .values(Pages)
      .onConflictDoUpdate({
        target: page.id,
        set: {
          name: sql`excluded.name`,
          link: sql`excluded.link`,
          categories: sql`excluded.categories`,
        },
      });
  }

  public static async UpdateConnection(Connections: Connection[]) {
    await db
      .insert(connection)
      .values(Connections)
      .onConflictDoNothing({
        target: [connection.targetPage, connection.originPage],
      });
  }
}
