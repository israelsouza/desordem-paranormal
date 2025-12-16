import { FeatureExtractionPipeline, pipeline } from "@huggingface/transformers";
import { WikiRepository } from "../repository/wiki-repository";
import { cosineDistance, gt, sql } from "drizzle-orm";
import { page as pageSchema } from "../database/schemas";
export class SemanticSearchService {
  private static featureExtractionPipeline: FeatureExtractionPipeline;

  public static async loadFeatureExtraction() {
    const extractor = await pipeline(
      "feature-extraction",
      "intfloat/multilingual-e5-base"
    );

    this.featureExtractionPipeline = extractor;
  }

  public static async getVectorEmbedding(phrase: string, prefix: string) {
    const response = await this.featureExtractionPipeline(
      `${prefix}: ${phrase}`,
      {
        pooling: "mean",
        normalize: true,
      }
    );

    return Array.from(response.data);
  }

  public static async getPages() {
    const wiki = await WikiRepository.GetWiki();

    return wiki.pages;
  }

  public static async compareEmbedding(userSearch: string) {
    const search = await this.getVectorEmbedding(userSearch, "query");

    const simlarity = sql<number>`1 - (${cosineDistance(
      pageSchema.embedding,
      search
    )})`;

    return simlarity;
  }
}
