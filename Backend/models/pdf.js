import mongoose from "mongoose";

const PDFSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const PDF = mongoose.model("PDF", PDFSchema);

const ChatSchema = new mongoose.Schema({
  pdfId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PDF',
    index: true // Add an index for better query performance
  },
  pdfTitle: { type: String },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true } // Add an index for sorting
});

// Add a compound index for faster queries
ChatSchema.index({ pdfId: 1, createdAt: 1 });

export const PDFChat = mongoose.model("PDFChat", ChatSchema);
