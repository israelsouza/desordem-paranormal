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

    console.log("pipelone loaded");

    this.featureExtractionPipeline = extractor;
  }

  public static async getEmbedding(text: string, prefix: string) {
    const response = await this.featureExtractionPipeline(
      `${prefix}: ${text}`,
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

  public static async compareEmbedding(searchQuery: string) {
    const embedding = await this.getEmbedding(searchQuery, "query");
    return WikiRepository.ListPagebySimilarity(embedding);
  }
}
