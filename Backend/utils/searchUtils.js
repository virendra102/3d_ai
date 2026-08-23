import fs from "fs";

// Constants
export const COLLEGE_VECTOR_PATH = "./College_Data/College_Embeddings.json";

// Helper function to calculate L2 (squared Euclidean) distance
function calculateL2Distance(vecA, vecB) {
  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sum += diff * diff;
  }
  return sum;
}

/**
 * Run vector search for college data natively in Node.js instead of Python FAISS
 * @param {Array<number>} embedding - The query embedding
 * @param {string} userQuery - The original user query
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array<object>>} Search results
 */
export async function runFaissSearch(embedding, userQuery, topK = 3) {
  if (!fs.existsSync(COLLEGE_VECTOR_PATH)) {
    throw new Error("College vector file not found.");
  }

  const fileData = fs.readFileSync(COLLEGE_VECTOR_PATH, "utf-8");
  const data = JSON.parse(fileData);

  if (!data || data.length === 0) return [];

  const resultsWithDists = data.map(item => {
    return {
      text: item.text,
      distance: calculateL2Distance(embedding, item.embedding)
    };
  });

  resultsWithDists.sort((a, b) => a.distance - b.distance);

  return resultsWithDists.slice(0, topK).map(res => ({
    text: res.text
  }));
}

/**
 * Run vector search for PDF data natively in Node.js instead of Python FAISS
 * @param {Array<number>} embedding - The query embedding
 * @param {string} vectorPath - Path to the PDF vector file
 * @returns {Promise<Array<object>>} Search results
 */
export async function runPdfFaissSearch(embedding, vectorPath) {
  if (!fs.existsSync(vectorPath)) {
    throw new Error("PDF vector file not found.");
  }

  const fileData = fs.readFileSync(vectorPath, "utf-8");
  const data = JSON.parse(fileData);

  if (!data || data.length === 0) return [];

  const topK = Math.min(3, data.length);

  const resultsWithDists = data.map(item => {
    return {
      text: item.text,
      distance: calculateL2Distance(embedding, item.embedding)
    };
  });

  resultsWithDists.sort((a, b) => a.distance - b.distance);

  return resultsWithDists.slice(0, topK).map(res => ({
    text: res.text,
    score: 1.0 / (1.0 + res.distance)
  }));
}