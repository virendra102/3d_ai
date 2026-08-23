# API Endpoints Documentation

This document lists all API endpoints for the backend service. Use this as a reference for Postman testing.

## Server Information
- Base URL: `http://localhost:5000`

## General Chat Endpoints

### Ask a General Question
- **Endpoint**: `/ask`
- **Method**: POST
- **Description**: Ask a general question. If college-related, it will try to find context from college data.
- **Request Body**:
  ```json
  {
    "text": "Tell me about the college campus"
  }
  ```
- **Response**:
  ```json
  {
    "answer": "The response from the AI..."
  }
  ```

## PDF Management Endpoints

### Upload PDF
- **Endpoint**: `/upload-pdf`
- **Method**: POST
- **Description**: Upload a PDF file for processing
- **Request**: Form data with key `pdf` containing the PDF file
- **Response**:
  ```json
  {
    "pdfId": "64f89a2e1234567890abcdef",
    "message": "✅ PDF uploaded and embedded."
  }
  ```

### Ask Question about PDF
- **Endpoint**: `/ask-pdf`
- **Method**: POST
- **Description**: Ask a question about a previously uploaded PDF
- **Request Body**:
  ```json
  {
    "pdfId": "64f89a2e1234567890abcdef",
    "question": "What is the main topic of this document?"
  }
  ```
- **Response**:
  ```json
  {
    "answer": "The response from the AI based on the PDF content..."
  }
  ```

### Get Chat History for PDF
- **Endpoint**: `/chat-history/:pdfId`
- **Method**: GET
- **Description**: Get the chat history for a specific PDF
- **Parameters**: 
  - `pdfId`: The ID of the PDF document
- **Response**:
  ```json
  {
    "history": [
      {
        "_id": "64f89a2e1234567890abcdef",
        "pdfId": "64f89a2e1234567890abcdef",
        "pdfTitle": "Document.pdf",
        "question": "What is this document about?",
        "answer": "This document is about...",
        "createdAt": "2023-09-06T12:34:56.789Z"
      }
    ]
  }
  ```

### Get All Chats
- **Endpoint**: `/all-chats`
- **Method**: GET
- **Description**: Get all chats grouped by PDF
- **Response**:
  ```json
  [
    {
      "_id": {
        "pdfId": "64f89a2e1234567890abcdef",
        "pdfTitle": "Document.pdf"
      },
      "chats": [
        {
          "question": "What is this document about?",
          "answer": "This document is about...",
          "createdAt": "2023-09-06T12:34:56.789Z"
        }
      ]
    }
  ]
  ```

### Save Chat
- **Endpoint**: `/save-chat`
- **Method**: POST
- **Description**: Save a chat interaction for a PDF
- **Request Body**:
  ```json
  {
    "pdfId": "64f89a2e1234567890abcdef",
    "question": "What are the main points?",
    "answer": "The main points are..."
  }
  ```
- **Response**:
  ```json
  {
    "message": "Chat saved successfully"
  }
  ```

## Alternative PDF Routes (Currently Not Used in Main Server)

These routes are defined in `routes/pdfRoutes.js` but are not currently integrated into the main server:

### Upload PDF (Alternative)
- **Endpoint**: `/pdf/upload`
- **Method**: POST
- **Description**: Upload a PDF file (using LangChain implementation)
- **Request**: Form data with key `pdf` containing the PDF file
- **Response**:
  ```json
  {
    "success": true,
    "filename": "1630948123456-document.pdf",
    "chunks": 15
  }
  ```

### Ask PDF Question (Alternative)
- **Endpoint**: `/pdf/ask`
- **Method**: POST
- **Description**: Ask a question about a PDF (using in-memory chunks storage)
- **Request Body**:
  ```json
  {
    "filename": "1630948123456-document.pdf",
    "question": "What is this document about?"
  }
  ```
- **Response**:
  ```json
  {
    "response": "This document is about..."
  }
  ```

### List PDFs (Alternative)
- **Endpoint**: `/pdf/list`
- **Method**: GET
- **Description**: Get a list of all uploaded PDFs
- **Response**:
  ```json
  {
    "files": [
      {
        "filename": "1630948123456-document.pdf",
        "chunks": 15
      }
    ]
  }
  ```

### Get PDF Chunks (Alternative)
- **Endpoint**: `/pdf/chunks/:filename`
- **Method**: GET
- **Description**: Get all chunks from a specific PDF
- **Parameters**:
  - `filename`: The filename of the PDF
- **Response**:
  ```json
  {
    "filename": "1630948123456-document.pdf",
    "chunks": ["chunk 1 text", "chunk 2 text", "..."]
  }
  ```

## Notes for Testing

1. The main implementation is in `server.js` which uses MongoDB for storage and Python FAISS for vector search.
2. The alternative implementation is in `routes/pdfRoutes.js` and `controllers/pdfController.js` but is not currently connected to the main server.
3. For PDF uploads, use multipart/form-data with the key 'pdf'.
4. Remember to store the returned pdfId from uploads for subsequent calls to /ask-pdf and /chat-history. 