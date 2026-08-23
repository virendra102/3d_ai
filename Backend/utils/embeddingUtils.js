import { pipeline } from "@xenova/transformers";

// Cache for embedding model
let embeddingExtractor = null;

/**
 * Generate embedding for text using Hugging Face's model
 * @param {string} text - The text to generate embedding for
 * @returns {Promise<Array<number>>} The embedding as array of numbers
 */
export async function generateEmbedding(text) {
  if (!embeddingExtractor) {
    console.log("🔄 Initializing embedding model...");
    embeddingExtractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Embedding model initialized successfully");
  }
  const result = await embeddingExtractor(text, { pooling: "mean", normalize: true });
  return Array.from(result.data);
}

/**
 * Check if a query is related to college/university topics
 * @param {string} query - The user query to check
 * @returns {boolean} True if query is college-related
 */
export function isCollegeQuery(query) {
  const keywords = ["college", "university", "campus", "admissions", "courses", "degree", "faculty", "history"];
  return keywords.some(keyword => query.toLowerCase().includes(keyword));
} 