import express from "express";
import multer from "multer";
import path from "path";
import { uploadPdf, askPdf, getPdfList, getChunks } from "../controllers/pdfController.js";

const router = express.Router();

// Configure multer for PDF uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf") {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    cb(null, true);
  }
});

// PDF Routes
router.post("/upload", upload.single("pdf"), uploadPdf);
router.post("/ask", askPdf);
router.get("/list", getPdfList);
router.get("/chunks/:filename", getChunks);

export default router; 