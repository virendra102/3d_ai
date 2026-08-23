import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "pdf-parse";
const pdfParse = pkg.default || pkg;
import { getGeminiResponse } from "../utils/aiUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "../uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Store PDF chunks in memory for quick access
const pdfChunks = {};

// Simple text splitter function to replace LangChain's splitter
function splitTextIntoChunks(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let i = 0;
  
  while (i < text.length) {
    // If not at the beginning, include overlap
    const start = i === 0 ? 0 : i - overlap;
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    i = end;
  }
  
  return chunks;
}

// Upload a PDF file
export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Write the file to disk
    fs.writeFileSync(filepath, req.file.buffer);

    // Process the PDF using pdf-parse
    const dataBuffer = fs.readFileSync(filepath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;
    
    // Split text into chunks
    const chunks = splitTextIntoChunks(text, 1000, 200);
    
    // Store chunks in memory
    pdfChunks[filename] = chunks;

    res.status(200).json({ 
      success: true, 
      filename,
      chunks: chunks.length 
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ error: "Failed to upload PDF" });
  }
};

// Ask questions about a PDF
export const askPdf = async (req, res) => {
  try {
    const { filename, question } = req.body;
    
    if (!filename || !question) {
      return res.status(400).json({ error: "Filename and question are required" });
    }
    
    // Check if the file exists in memory
    if (!pdfChunks[filename]) {
      return res.status(404).json({ error: "PDF not found or not processed" });
    }
    
    // Prepare context from chunks
    const context = pdfChunks[filename].join("\n\n");
    
    // Get response from Gemini
    const response = await getGeminiResponse(question, context);
    
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error asking PDF:", error);
    res.status(500).json({ error: "Failed to process question" });
  }
};

// Get list of all uploaded PDFs
export const getPdfList = (req, res) => {
  try {
    const files = Object.keys(pdfChunks).map(filename => ({
      filename,
      chunks: pdfChunks[filename].length
    }));
    
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error getting PDF list:", error);
    res.status(500).json({ error: "Failed to get PDF list" });
  }
};

// Get chunks from a specific PDF
export const getChunks = (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!pdfChunks[filename]) {
      return res.status(404).json({ error: "PDF not found" });
    }
    
    res.status(200).json({ 
      filename,
      chunks: pdfChunks[filename]
    });
  } catch (error) {
    console.error("Error getting chunks:", error);
    res.status(500).json({ error: "Failed to get chunks" });
  }
}; 