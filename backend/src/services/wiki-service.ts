import { Page as wikiPage } from "wikijs";
import { WikiDataManipulationService } from "./wiki-data-manipulation-service";
import { HtmlHasher } from "../utils/html-hasher";
import { WikiRepository } from "../repository/wiki-repository";
import { Request, Response } from "express";

export interface Page {
  id: number;
  name: string;
  link: string;
  html: string;
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
    WikiRepository.UpdatePage(pageObj);
  }

  public static async UpdateConnections(page: Page, allPages: Page[]) {
    const getPageConnections = await WikiDataManipulationService.GetPageLinks(
      page.html
    );

    for (const entrie of getPageConnections) {
      const connection = allPages.find((page) => {
        return page.name == entrie[1];
      });

      if (!connection) {
        continue;
      }
      WikiRepository.UpdateConnection({
        originPage: page.id,
        targetPage: connection.id,
      });
    }
  }

  public static async GetWiki(req: Request, res: Response) {
    const wiki = await WikiRepository.GetWiki();
    res.json(wiki);
  }
}
