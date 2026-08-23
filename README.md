# 🤖 AI BOT — 3D Talking Avatar RAG Chatbot

A full-stack **Retrieval-Augmented Generation (RAG) Chatbot** featuring a 3D animated talking avatar. Designed as a college assistant for **SSIT** (Sir Padampat Singhania University), the system answers general questions, queries a pre-embedded college knowledge base, and lets users upload PDFs to have AI conversations grounded strictly in the uploaded document.

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 **Natural Language Chat** | Conversational AI powered by **Groq (Llama-3.1)** for near-instant responses. |
| 🎓 **College Knowledge Base** | Built-in RAG over SSIT campus data using precomputed embeddings. |
| 📄 **PDF Upload & Chat** | Upload any PDF — text is extracted, chunked, embedded, and searchable in real time. |
| 🧠 **Vector Similarity Search** | L2 (Euclidean) distance-based native JS vector search (no FAISS/Python needed at runtime). |
| 👤 **3D Talking Avatar** | Three.js-powered 3D character with lip-sync and dynamic bone animation. |
| 🔊 **Text-to-Speech** | AI responses spoken aloud via **Google Cloud TTS**. |
| 💾 **Persistent Chat History** | All PDF-based conversations auto-saved to **MongoDB**. |
| 📚 **Browse Previous Chats** | Review / resume past conversations grouped by document. |
| 📱 **Responsive UI** | Glassmorphism design with Tailwind CSS — works on desktop & mobile. |

---

## 🛠️ Technology Stack

### Frontend (`ai-bot-frontend/`)
| Layer | Technology |
|---|---|
| Framework | **React 19** (Vite 6) |
| Styling | **Tailwind CSS 4** |
| Routing | React Router DOM 7 |
| 3D Avatar | **Three.js** (GLB models + lip-sync) |
| HTTP Client | **Axios** |
| TTS | Google Cloud TTS (REST) |

### Backend (`Backend/`)
| Layer | Technology |
|---|---|
| Runtime | **Node.js** (Express 4) |
| Database | **MongoDB** (Mongoose 8 ODM) |
| Embeddings | `@xenova/transformers` → **all-MiniLM-L6-v2** (runs locally in Node) |
| LLM | **Groq API** via OpenAI-compatible SDK → `llama-3.1-8b-instant` |
| PDF Parsing | **pdfjs-dist** (legacy build for Node) |
| File Upload | **Multer** |
| Vector Search | Custom native JS L2 distance engine (local JSON stores) |
| Deployment | **Vercel** (serverless-ready via `vercel.json`) |

---

## 🏗️ System Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     REACT FRONTEND                        │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │ Chat UI  │  │ 3D Avatar    │  │ Google TTS Audio   │   │
│  └────┬─────┘  └──────┬───────┘  └────────┬───────────┘   │
│       │               │                   │               │
│       └───────────────┼───────────────────┘               │
│                       ▼ Axios HTTP                         │
└───────────────────────┼───────────────────────────────────┘
                        ▼
┌───────────────────────────────────────────────────────────┐
│                  EXPRESS BACKEND API                      │
│  ┌───────────────┐ ┌───────────────┐ ┌─────────────────┐  │
│  │ PDF Parser    │ │ Embedding     │ │ Groq LLM        │  │
│  │ (pdfjs-dist)  │ │ (transformers)│ │ (Llama-3.1)     │  │
│  └───────┬───────┘ └───────┬───────┘ └────────┬────────┘  │
│          │                 │                  │           │
│          ▼                 ▼                  │           │
│  ┌───────────────┐ ┌───────────────┐         │           │
│  │ Uploads/      │ │ VectorStore   │◄────────┘           │
│  │ Raw PDFs      │ │ (JSON files)  │ Similarity Search   │
│  └───────────────┘ └───────────────┘                     │
│                                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │ MongoDB — PDF metadata + Chat history            │    │
│  └──────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
```

---

## ⚙️ Prerequisites & System Requirements

### Minimum System Specs
| Component | Minimum | Recommended |
|---|---|---|
| OS | Windows 10 / macOS 12 / Ubuntu 20.04 | x64, any modern OS |
| CPU | Dual-core x64 | Quad-core or better |
| RAM | **4 GB** | **8 GB+** *(embedding model consumes ~1–2 GB on first load)* |
| Disk Space | 3 GB free | 10 GB free (for `node_modules` + uploads) |
| Internet | Required for Groq API, Google TTS, MongoDB Atlas | Same |

### Software That Must Be Installed First
1. **Node.js ≥ 18.x** (LTS recommended — v20 or v22)  
   → Download from https://nodejs.org  
   Verify with:
   ```bash
   node --version
   npm --version
   ```
2. **MongoDB** — either:
   - **MongoDB Atlas** (free tier — recommended, easiest): https://www.mongodb.com/cloud/atlas
   - **MongoDB Community Server** locally: https://www.mongodb.com/try/download/community
3. **API Keys** (free tiers available):
   - **Groq API Key:** https://console.groq.com/keys *(needed for LLM responses)*
4. **Git** (to clone the repo): https://git-scm.com/downloads

> **Python is NOT required** at runtime — embeddings run natively in Node.js via `@xenova/transformers`.

---

## 🚀 Setup Instructions

### Step 1 — Clone the Repository
```bash
git clone <your-repo-url.git>
cd AI_BOT
```

### Step 2 — Install Dependencies
Open **two separate terminals** (one for Backend, one for Frontend), or install sequentially:

**Terminal A — Backend:**
```bash
cd Backend
npm install
```

**Terminal B — Frontend:**
```bash
cd ai-bot-frontend
npm install
```

### Step 3 — Configure Environment Variables
Copy the `.env.example` templates and fill in real values.

#### 3a) Backend `.env`
```bash
# In Backend/ folder
copy .env.example .env          # Windows PowerShell/CMD
# cp .env.example .env          # macOS / Linux
```
Then edit `Backend/.env` with:

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ Yes | MongoDB Atlas / local connection string (e.g. `mongodb+srv://user:pass@cluster0.mongodb.net/ai-bot?...`) |
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key from https://console.groq.com/keys |
| `GROQ_MODEL` | ❌ Optional | Default: `llama-3.1-8b-instant`. Alternatives: `llama-3.1-70b-versatile`, `mixtral-8x7b-32768` |

#### 3b) Frontend `.env.local`
```bash
# In ai-bot-frontend/ folder
copy .env.example .env.local    # Windows
# cp .env.example .env.local    # macOS / Linux
```
Edit if your backend isn't on port 5000 or is deployed elsewhere:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000` | Full URL of the running backend server |

### Step 4 — Start the Servers

**Terminal A — Backend (runs on http://localhost:5000):**
```bash
cd Backend
npm run dev          # development with nodemon auto-reload
# OR
npm start            # plain node
```
You should see:
```
🚀 Server running on port 5000
🔄 Connecting to MongoDB...
✅ MongoDB connected
🔄 Initializing embedding model...
✅ Embedding model initialized successfully
```

**Terminal B — Frontend (runs on http://localhost:5173):**
```bash
cd ai-bot-frontend
npm run dev
```

### Step 5 — Open the App
Visit **http://localhost:5173** in your browser.

---

## 📡 API Endpoints

All backend endpoints exposed at `http://localhost:5000`:

| Method | Endpoint | Body / Params | Description |
|---|---|---|---|
| `GET` | `/` | — | Health check / welcome |
| `POST` | `/ask` | `{ text: string }` | Ask a general / college-related question |
| `POST` | `/upload-pdf` | `multipart/form-data: pdf` | Upload a PDF → extract text → embed → returns `pdfId` |
| `POST` | `/ask-pdf` | `{ pdfId, question }` | Chat about a specific uploaded PDF |
| `POST` | `/save-chat` | `{ pdfId?, question, answer }` | Save a chat entry (auto-saved for PDFs; also used for general chat save) |
| `GET` | `/all-chats` | — | Get all chats grouped by PDF / general |
| `GET` | `/chat-history/:pdfId` | `pdfId` URL param | Full chat history for one uploaded PDF |

---

## 📁 Project Structure

```
AI_BOT/
├── .gitignore                         # Root ignore rules (node_modules, .env, .venv, uploads…)
├── .env.example                       # ⚠️ Per-folder .env.example (see Backend/ + frontend/)
├── README.md                          # This file
├── ARCHITECTURE.md                    # Deep-dive architecture + Mermaid diagrams
├── package.json                       # Root placeholder
│
├── Backend/                           # 🔵 Node.js Express API
│   ├── .gitignore
│   ├── .env.example                   # Environment template
│   ├── .env                           # ⚙️ Your secrets (NOT committed)
│   ├── package.json
│   ├── server.js                      # Entry point — all API routes
│   ├── db.js                          # MongoDB connection
│   ├── vercel.json                    # Vercel serverless deploy config
│   │
│   ├── College_Data/                  # Seed knowledge base
│   │   ├── College_Data.json          # Raw SSIT college facts
│   │   └── College_Embeddings.json    # Precomputed vectors for college RAG
│   │
│   ├── SSIT_FAQ_Full.json             # Additional FAQ seed data
│   ├── upload-college-data.js         # One-time data upload script
│   │
│   ├── controllers/
│   │   └── pdfController.js
│   ├── models/
│   │   └── pdf.js                     # PDF + PDFChat Mongoose schemas
│   ├── routes/
│   │   └── pdfRoutes.js
│   └── utils/
│       ├── aiUtils.js                 # Groq LLM helper (getGeminiResponse → Groq)
│       ├── embeddingUtils.js          # Xenova all-MiniLM-L6-v2 embeddings
│       └── searchUtils.js             # Native L2 vector search (no FAISS needed)
│
├── ai-bot-frontend/                   # 🟢 React + Vite UI
│   ├── .gitignore
│   ├── .env.example                   # Environment template
│   ├── .env.local                     # ⚙️ Frontend env (NOT committed)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   ├── index.html
│   │
│   ├── public/
│   │   ├── avatar.html
│   │   ├── libs/                      # 3D runtime libs (lipsync, dynamic bones, talkinghead)
│   │   └── models/                    # 3D avatar .glb files
│   │
│   └── src/
│       ├── main.jsx                   # React entry
│       ├── App.jsx                    # Router setup
│       ├── App.css / index.css
│       ├── api/api.js                 # Axios client + all backend API calls
│       ├── pages/
│       │   └── HomePage.jsx           # Main page
│       ├── components/
│       │   ├── ChatBox.jsx            # Conversation display
│       │   ├── ChatInput.jsx          # Message input + PDF upload
│       │   ├── Sidebar.jsx            # Chat history / PDF selector
│       │   ├── AvatarViewer.jsx       # Three.js 3D avatar renderer
│       │   ├── AvatarFallback.jsx
│       │   ├── ModelViewer.jsx
│       │   └── VoiceInput.jsx
│       ├── libs/                      # Copies of 3D libs for build bundling
│       └── utils/
│           ├── googleTTS.js
│           └── helpers.js
│
├── uploads/                           # ⚫ Generated at runtime — ignored by Git
└── vectorstore/                       # ⚫ Generated at runtime — ignored by Git
```

---

## 🎯 Core Functionality Deep-Dive

### 1. General / College Query Flow
1. User types a question.
2. Frontend sends `POST /ask { text }`.
3. Backend generates an embedding via `all-MiniLM-L6-v2`.
4. Keyword check → if college-related, runs L2 vector search over `College_Embeddings.json` → top-3 chunks as context.
5. Question + context (if any) sent to **Groq Llama-3.1**.
6. Answer returned to frontend → displayed in chat → spoken by avatar via Google TTS.

### 2. PDF Upload Flow
1. User uploads a PDF via chat input.
2. Frontend `POST /upload-pdf` (multipart).
3. Backend **Multer** saves the file → **pdfjs-dist** extracts text → splits into ~700-char chunks.
4. Each chunk embedded with `all-MiniLM-L6-v2` → saved to `vectorstore/pdf_{id}.json`.
5. PDF metadata (`name`, `path`) saved to MongoDB → `pdfId` returned.

### 3. PDF Chat Flow
1. User asks a question with a selected PDF.
2. `POST /ask-pdf { pdfId, question }`.
3. Question embedded → L2 search over that PDF's JSON vectorstore → top-3 matching chunks.
4. Prompt = "You are an SSIT college assistant" + PDF chunks + question → Groq.
5. Answer returned + automatically saved to `PDFChat` collection in MongoDB.

---

## ❓ FAQ / Troubleshooting

<details>
<summary><strong>Q: Embedding model takes forever to load on first request?</strong></summary>

Normal — `@xenova/transformers` downloads ~100 MB `all-MiniLM-L6-v2` model once, then caches it. First request may take 10–30 seconds; subsequent requests are instant. Ensure you have ≥4 GB RAM.
</details>

<details>
<summary><strong>Q: Groq rate limit errors ("429 Too Many Requests")?</strong></summary>

Free Groq tier has rate limits. Either:
- Wait a moment and retry.
- Upgrade your Groq plan.
- Swap `GROQ_MODEL` to a different model in `.env`.
</details>

<details>
<summary><strong>Q: MongoDB connection fails / times out?</strong></summary>

Checklist:
1. `MONGO_URI` in `Backend/.env` is correct.
2. If using Atlas → your current IP is whitelisted in Atlas → Network Access.
3. Username/password are URL-encoded (no special `@` / `:` chars unescaped).
4. Atlas cluster is actually running (not paused).
</details>

<details>
<summary><strong>Q: Frontend can't reach backend (CORS / network errors)?</strong></summary>

- Backend must be running on port 5000 (or set `VITE_API_URL` to match).
- CORS is already enabled in `server.js` via `app.use(cors())`.
</details>

<details>
<summary><strong>Q: 3D avatar doesn't load / shows blank?</strong></summary>

- Browser must support WebGL (all modern Chrome/Firefox/Edge/Safari do).
- Check DevTools console for GLB model loading errors.
- `.glb` models are located in `ai-bot-frontend/public/models/`.
</details>

---

## 🤝 Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m "Add feature xyz"`.
4. Push to branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

---

## 📜 License

MIT — feel free to use, modify, and distribute. Attribution appreciated.

---

## 🙏 Acknowledgments

- **Groq** for ultra-fast LLM inference.
- **Hugging Face / Xenova** for the transformers.js port enabling in-Node embeddings.
- **Vercel** for serverless hosting.
- **MongoDB Atlas** free tier for document storage.
- Three.js community for 3D avatar libs (`talkinghead`, `dynamicbones`, `lipsync`).
