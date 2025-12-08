import { Page as wikiPage } from "wikijs";
import { WikiDataManipulationService } from "./wiki-data-manipulation-service";
import { WikiRepository } from "../repository/wiki-repository";

export interface Page {
  id: number;
  name: string;
  link: string;
  html: string;
  categories: string[];
  connections?: number[];
}

export interface Connection {
  originPage: number;
  targetPage: number;
}

export class WikiService {
  public static async GetPages() {
    const pageRecords = await WikiDataManipulationService.GetPages();

    if (!pageRecords) {
      throw new Error("deu erro no GetAllPages da service");
    }

    const allPagesObjects: Page[] = [];

    while (pageRecords.length > 0) {
      console.log("processing pages", pageRecords.length);
      const pageBatch = pageRecords.splice(0, 30);

      const pageBatchPromisse = pageBatch.map((page) => {
        return WikiService.FormatPage(page[1]);
      });

      const formatedPages = await Promise.all(pageBatchPromisse);

      const filteredPages = formatedPages.filter((page) => !!page);

      await WikiRepository.UpdatePage(filteredPages);
      allPagesObjects.push(...filteredPages);
    }

    return allPagesObjects;
  }

  private static async FormatPage(page: wikiPage) {
    try {
      const html = await page.html();
      const categories = await page.categories();
      const pageObj: Page = {
        id: page.raw.pageid,
        name: page.raw.title,
        link: page.raw.fullurl,
        categories,
        html,
      };

      return pageObj;
    } catch (error) {
      console.log("erro no formatPage: ", error);
    }
  }

  public static async UpdatePageConnections() {
    const allPages = await this.GetPages();

    for (const page of allPages) {
      console.log("processing connections", allPages.length);

      const getPageConnections = await WikiDataManipulationService.GetPageLinks(
        page.html
      );

      const connections: Connection[] = [];

      for (const entrie of getPageConnections) {
        const connection = allPages.find((page) => {
          return page.name == entrie[1];
        });

        if (!connection) {
          continue;
        }
        connections.push({
          originPage: Math.max(page.id, connection.id),
          targetPage: Math.min(page.id, connection.id),
        });
      }
      await WikiRepository.UpdateConnection(connections);
    }
  }

  public static async GetWiki() {
    const wiki = await WikiRepository.GetWiki();
    return wiki;
  }
}
