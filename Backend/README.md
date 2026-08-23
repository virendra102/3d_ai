# College AI Assistant with RAG

A Retrieval-Augmented Generation (RAG) system for a college AI assistant that uses Groq for generation and retrieves college-specific information from Weaviate.

## Features

- **Dual-mode operation**: Uses RAG for college-related queries and direct LLM generation for general questions
- **College context retrieval**: Retrieves relevant college information from Weaviate
- **Consistent tone**: Always responds as a college assistant
- **Data management**: Includes API to upload and embed college information

## Tech Stack

- **Backend**: Node.js with Express.js
- **LLM**: Groq (via OpenAI-compatible API)
- **Vector Database**: Weaviate (for storing and retrieving embeddings)
- **Embeddings**: Google Vertex AI Embeddings

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install express cors dotenv axios weaviate-ts-client google-auth-library @google/generative-ai
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   # Groq API
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=llama-3.1-8b-instant
   
   # Google Cloud (for Vertex AI embeddings)
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
   GOOGLE_PROJECT_ID=your_google_project_id_here
   
   # Weaviate Vector Database
   WEAVIATE_SCHEME=https
   WEAVIATE_HOST=your-cluster-url.weaviate.cloud
   WEAVIATE_API_KEY=your-weaviate-api-key-here
   ```
4. Start the server:
   ```bash
   node server.js
   ```

## API Endpoints

### Ask a Question

```
POST /ask
```

Request body:
```json
{
  "text": "What are the admission requirements for the computer science program?"
}
```

Response:
```json
{
  "answer": "As your college assistant, I can tell you that the Computer Science program requires..."
}
```

### Upload College Data

```
POST /upload-college-data
```

Request body:
```json
{
  "documents": [
    {
      "id": "cs-program-001",
      "title": "Computer Science Program",
      "category": "academics",
      "text": "The Computer Science program offers courses in algorithms, data structures..."
    },
    {
      "id": "admissions-001",
      "title": "Admission Requirements",
      "category": "admissions",
      "text": "To apply for admission, students need to submit transcripts, test scores..."
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "message": "Successfully uploaded 2 documents to Weaviate"
}
```

## Implementation Details

1. **Query Processing**:
   - The system analyzes each query using the backend rules to determine if it's college-related
   - For college queries, it retrieves relevant information from Weaviate
   - All queries are processed with appropriate context

2. **Embedding Generation**:
   - Uses local embeddings to generate vectors for both queries and documents
   - Stores document embeddings in Weaviate for efficient retrieval

3. **Response Generation**:
   - Combines retrieved information with the user query
   - Ensures all responses maintain a consistent college assistant tone 
