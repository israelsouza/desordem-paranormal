import express from "express";
import "dotenv/config";
import { appRoutes } from "./src/routes/routes.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "./src/utils/cron-job.js";
import { SemanticSearchService } from "./src/services/semantic-search-service.js";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });

async function main() {
  const app = express();
  const port = process.env.ENV_PORT;

  app.use(appRoutes);

  await SemanticSearchService.loadFeatureExtraction();

  await SemanticSearchService.compareEmbedding("teste");

  app.listen(port, () => {
    console.log(`a porta ${port} ta abrida !`);
  });
}
main();
