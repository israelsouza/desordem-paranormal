import express from "express";
import "dotenv/config";
import { appRoutes } from "./src/routes/routes.js";
import "./src/utils/cron-job.js";
import { SemanticSearchService } from "./src/services/semantic-search-service.js";

async function main() {
  const app = express();
  const port = process.env.ENV_PORT;

  app.use(express.json());
  app.use(appRoutes);

  app.listen(port, () => {
    console.log(`a porta ${port} ta abrida !`);
  });

  SemanticSearchService.loadFeatureExtraction();
}
main();
