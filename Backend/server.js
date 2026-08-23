import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";
import { spawn } from "child_process";
import { connectDB } from "./db.js";
import { PDF, PDFChat } from "./models/pdf.js";
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
// import pdfRoutes from "./routes/pdfRoutes.js";
import { generateEmbedding, isCollegeQuery } from "./utils/embeddingUtils.js";
import { runFaissSearch, runPdfFaissSearch } from "./utils/searchUtils.js";
import { getGeminiResponse } from "./utils/aiUtils.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

await connectDB();
const upload = multer({ dest: "uploads/" });
const PORT = 5000;

// Add PDF routes (optional - currently not used in main implementation)
// app.use("/pdf", pdfRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the PDF Chatbot API! Use /ask or /upload-pdf endpoints.");
});

// 🎯 /ask: General or College
app.post("/ask", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: "Empty query" });

    const embedding = await generateEmbedding(text);
    const isCollege = isCollegeQuery(text);

    let contextText = "", useLLMOnly = !isCollege;

    if (isCollege) {
      try {
        const results = await runFaissSearch(embedding, text, 3);
        if (results.length) {
          contextText = results.map(d => d.text).join("\n\n");
        } else {
          useLLMOnly = true;
        }
      } catch (err) {
        console.warn("⚠️ FAISS fallback:", err.message);
        useLLMOnly = true;
      }
    }

    const finalAnswer = await getGeminiResponse(text, useLLMOnly ? "" : contextText);
    res.json({ answer: finalAnswer });
  } catch (err) {
    console.error("❌ /ask error:", err);
    res.status(500).json({ error: "Internal error" });
  }
});

// 📥 /upload-pdf using pdfjs-dist
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const file = req.file;
    if (!file || !fs.existsSync(file.path)) {
      return res.status(400).json({ error: "PDF file not found" });
    }

    const data = new Uint8Array(fs.readFileSync(file.path));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(" ");
      fullText += `\n[Page ${i}]\n${pageText}\n`;
    }

    const chunks = fullText.match(/(.|[\r\n]){1,700}/g) || [];
    const embeddings = [];
    for (const chunk of chunks) {
      const emb = await generateEmbedding(chunk);
      embeddings.push({ text: chunk, embedding: emb });
    }

    const pdfDoc = await PDF.create({ name: file.originalname, path: file.path });

    const vectorDir = "vectorstore";
    if (!fs.existsSync(vectorDir)) {
      fs.mkdirSync(vectorDir);
    }

    const vectorPath = `${vectorDir}/pdf_${pdfDoc._id}.json`;
    fs.writeFileSync(vectorPath, JSON.stringify(embeddings));

    res.json({ pdfId: pdfDoc._id, message: "✅ PDF uploaded and embedded." });
  } catch (err) {
    console.error("❌ /upload-pdf error:", err);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

app.post("/ask-pdf", async (req, res) => {
  const { pdfId, question } = req.body;
  if (!pdfId || !question) return res.status(400).json({ error: "Missing input" });

  const vectorPath = `vectorstore/pdf_${pdfId}.json`;
  if (!fs.existsSync(vectorPath)) return res.status(404).json({ error: "PDF vector not found" });

  const pdfDoc = await PDF.findById(pdfId);
  if (!pdfDoc) return res.status(404).json({ error: "PDF not found in DB" });

  try {
    const embedding = await generateEmbedding(question);
    const result = await runPdfFaissSearch(embedding, vectorPath);
    
    const context = result.map(d => d.text).join("\n\n");
    console.log("🔍 Using vectorPath:", vectorPath);
    console.log("❓ Question:", question);
    console.log("📄 Context Preview:", context.substring(0, 500));
    
    const answer = await getGeminiResponse(question, context);
    await PDFChat.create({ pdfId, pdfTitle: pdfDoc.name, question, answer });
    res.json({ answer });
  } catch (error) {
    console.error("❌ Error in /ask-pdf:", error);
    res.status(500).json({ error: "Failed to process PDF query" });
  }
});

app.get("/all-chats", async (req, res) => {
  try {
    // Use lean() to get plain JavaScript objects instead of Mongoose documents
    // This makes the query faster and consumes less memory
    const chats = await PDFChat.find()
      .sort({ createdAt: -1 })
      .lean();
    
    // Group the results in JavaScript instead of using MongoDB's aggregation
    // This is often faster for smaller datasets
    const groupedChats = [];
    const groupMap = new Map();
    
    for (const chat of chats) {
      const key = chat.pdfId ? chat.pdfId.toString() : 'general';
      
      if (!groupMap.has(key)) {
        const group = {
          _id: {
            pdfId: chat.pdfId,
            pdfTitle: chat.pdfTitle || 'General Chat'
          },
          chats: []
        };
        groupMap.set(key, group);
        groupedChats.push(group);
      }
      
      groupMap.get(key).chats.push({
        question: chat.question,
        answer: chat.answer,
        createdAt: chat.createdAt
      });
    }
    
    // Sort chats within each group by creation date
    for (const group of groupedChats) {
      group.chats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    res.json(groupedChats);
  } catch (error) {
    console.error("❌ Error in /all-chats:", error);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// 🗃 Get chat history for a PDF
app.get("/chat-history/:pdfId", async (req, res) => {
  try {
    const chats = await PDFChat.find({ pdfId: req.params.pdfId })
      .sort({ createdAt: 1 })
      .lean()
      .exec();
    
    res.json({ history: chats });
  } catch (error) {
    console.error("❌ Error in /chat-history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// app.post("/save-chat", async (req, res) => {
//   const { pdfId, question, answer } = req.body;

  
//   if (!pdfId || !question || !answer) return res.status(400).json({ error: "Missing input" });

//   try {
//     // Look up the PDF to get its title
//     const pdfDoc = await PDF.findById(pdfId);
//     if (!pdfDoc) {
//       return res.status(404).json({ error: "PDF not found" });
//     }

//     // Create chat with the PDF title included
//     const chat = new PDFChat({ 
//       pdfId, 
//       pdfTitle: pdfDoc.name, 
//       question, 
//       answer 
//     });
//     await chat.save();
    
//     res.json({ message: "Chat saved successfully", success: true });
//   } catch (error) {
//     console.error("❌ Error in /save-chat:", error);
//     res.status(500).json({ error: "Failed to save chat" });
//   }
// });


app.post("/save-chat", async (req, res) => {
  const { pdfId, question, answer } = req.body;

  // Validate question and answer
  if (!question || !answer) {
    return res.status(400).json({ error: "Missing question or answer" });
  }

  try {
    let chatData = {
      question,
      answer,
      createdAt: new Date()
    };

    // If it's a PDF-based chat
    if (pdfId) {
      const pdfDoc = await PDF.findById(pdfId);
      if (!pdfDoc) {
        return res.status(404).json({ error: "PDF not found" });
      }

      chatData.pdfId = pdfDoc._id;
      chatData.pdfTitle = pdfDoc.name;
    }

    const chat = new PDFChat(chatData);
    await chat.save();

    res.json({ message: "Chat saved successfully", success: true });
  } catch (error) {
    console.error("❌ Error in /save-chat:", error);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
