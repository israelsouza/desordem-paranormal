import type { Request, Response } from "express";
import { WikiService } from "../services/wiki-service";

export class WikiController {
  public static async GetWiki(req: Request, res: Response) {
    const wiki = await WikiService.GetWiki();
    res.json(wiki);
  }
}
