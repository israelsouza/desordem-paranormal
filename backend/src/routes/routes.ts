import { Router, type Response } from "express";
import { WikiController } from "../controller/get-wiki-controller.js";

export const appRoutes = Router();

appRoutes.get("/wiki", WikiController.GetWiki);
appRoutes.post("/search", WikiController.SearchWiki);
