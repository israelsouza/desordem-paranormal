import { Page as wikiPage } from "wikijs";
import { WikiDataManipulationService } from "./wiki-data-manipulation-service";
import { HtmlHasher } from "../utils/html-hasher";

export interface Page {
  id: number;
  name: string;
  link: string;
  html: string;
  connections?: number[];
}
export class WikiService {
  public static async GetPages() {
    const pageRecords = await WikiDataManipulationService.GetPages();

    if (!pageRecords) {
      throw new Error("deu erro no GetAllPages da service");
    }

    const allPagesObjects: Page[] = [];
    for (const [pageid, page] of pageRecords) {
      await WikiService.FormatPage(page, allPagesObjects);
    }

    return allPagesObjects;
  }

  private static async FormatPage(page: wikiPage, allPagesObjects: Page[]) {
    const html = await page.html();
    const htmlHash = HtmlHasher.hasher(html);

    const pageObj: Page = {
      id: page.raw.pageid,
      name: page.raw.title,
      link: page.raw.fullurl,
      html: htmlHash,
    };
    allPagesObjects.push(pageObj);
  }

  public static async GetConnections(htmlPage: string, allPages: Page[]) {
    const connections: number[] = [];

    const getPageConnections = await WikiDataManipulationService.GetPageLinks(
      htmlPage
    );

    for (const entrie of getPageConnections) {
      const pageObj = allPages.find((page) => {
        return page.name == entrie[1];
      });

      if (!pageObj) {
        continue;
      }
      connections.push(pageObj.id);
    }

    return connections;
  }
}
