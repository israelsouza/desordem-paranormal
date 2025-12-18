import type { Request, Response } from "express";
import { WikiService } from "../services/wiki-service";
import { SemanticSearchService } from "../services/semantic-search-service";

export class WikiController {
  public static async GetWiki(req: Request, res: Response) {
    const wiki = await WikiService.GetWiki();
    res.json(wiki);
  }

  public static async SearchWiki(req: Request, res: Response) {
    const { search } = req.body;
    const response = await SemanticSearchService.compareEmbedding(search);
    res.json(response);
  }
}
