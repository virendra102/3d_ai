import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const groqApiKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

const client = groqApiKey
  ? new OpenAI({
      apiKey: groqApiKey,
      baseURL: "https://api.groq.com/openai/v1",
    })
  : null;

function buildPrompt(question, context) {
  return `
Context from PDF or knowledge base:
${context || "No extra context."}

Question: ${question}

Answer as a helpful college assistant for SSIT. Use the provided context when relevant. If the context does not contain the answer, respond using your general knowledge.
`.trim();
}

function extractErrorMessage(error) {
  if (error?.status === 429) {
    return "Groq rate limit exceeded. Please try again in a moment.";
  }

  return error?.message || "Failed to get AI response";
}

/**
 * Get a response from Groq using context from a PDF or general query.
 * Kept under the existing function name so the rest of the app does not need changes.
 * @param {string} question - The user's question
 * @param {string} context - The context from PDF chunks or college search
 * @returns {Promise<string>} - The AI's response
 */
export const getGeminiResponse = async (question, context) => {
  if (!client) {
    throw new Error("GROQ_API_KEY is not set in the backend environment.");
  }

  try {
    const completion = await client.chat.completions.create({
      model: groqModel,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful college assistant for SSIT. Be concise, accurate, and friendly.",
        },
        {
          role: "user",
          content: buildPrompt(question, context),
        },
      ],
      temperature: 0.7,
    });

    const answer = completion?.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      throw new Error("Groq returned an empty response.");
    }

    return answer;
  } catch (error) {
    console.error("Error getting AI response:", error);
    throw new Error(extractErrorMessage(error));
  }
};

/**
 * Backward-compatible helper kept for any older code paths.
 * @param {string} userQuery - The user's question
 * @param {string} contextText - Optional context for RAG
 * @returns {Promise<string>} The AI-generated response
 */
export async function getGeminiResponseOld(userQuery, contextText = "") {
  return getGeminiResponse(userQuery, contextText);
}
