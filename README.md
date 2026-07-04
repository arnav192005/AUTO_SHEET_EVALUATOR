<div align="center">

# 🎓 Automated Answer Sheet Evaluator

**An AI-powered grading system for handwritten exam answer sheets**

*OCR → RAG Retrieval → LLM Scoring → Human-in-the-Loop Review*

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.138-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Build](https://img.shields.io/badge/Tests-6%20Passing-brightgreen?style=for-the-badge)](backend/tests/)

</div>

---

## 📖 What is this project?

This is an **intelligent exam grading system** that automatically evaluates handwritten student answer sheets using a multi-stage AI pipeline:

```
📄 Upload Scanned Sheet
        ↓
🔍 OpenCV Preprocessing  (deskew, denoise, crop)
        ↓
📝 OCR via Google Vision  (extract handwritten text)
        ↓
🧩 RAG Retrieval          (find relevant answer-key context)
        ↓
🤖 LLM Scoring            (Claude/GPT scores against rubric)
        ↓
📊 Confidence Routing     (auto-approve or flag for review)
        ↓
👨‍🏫 Teacher Review UI     (React + Vite dashboard for overrides)
        ↓
📤 CSV Export             (final grades)
```

### Why does this exist?

Grading hundreds of handwritten answer sheets is **tedious, inconsistent, and slow**. This system automates the process while keeping a teacher in the loop for uncertain cases — combining the speed of AI with the accuracy of human judgment.

---

## 🏗️ Architecture

```
answer-sheet-evaluator/
│
├── backend/                    ← Python FastAPI Backend
│   ├── apps/
│   │   ├── api/                ← FastAPI entrypoint, routers, middleware
│   ├── packages/               ← Core grading logic
│   │   ├── ocr/                ← OpenCV + Vision API logic
│   │   ├── rag/                ← ChromaDB embeddings + retrieval
│   │   ├── llm/                ← LiteLLM client + prompts
│   │   ├── evaluation/         ← Scorer + confidence routing
│   │   └── common/             ← Config, Logging, Pydantic schemas
│   ├── db/                     ← SQLAlchemy ORM + Alembic migrations
│   └── tests/                  ← Pytest suite
│
├── frontend/                   ← React + Vite Frontend
│   ├── src/
│   │   ├── pages/              ← Dashboard, Upload, Review Session pages
│   │   ├── components/         ← Reusable UI components (Sidebar, Charts)
│   │   └── App.jsx             ← React Router configuration
│   ├── package.json            ← Node.js dependencies
│   └── vite.config.js          ← Vite bundler configuration
│
└── README.md                   ← Project documentation
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Backend API** | FastAPI 0.138 | Async, auto-docs, type-safe |
| **Language** | Python 3.11+ | Rich ML/AI ecosystem |
| **Frontend** | React 19 + Vite | Fast HMR, component-based UI |
| **Routing** | React Router DOM | Seamless client-side navigation |
| **Styling** | Vanilla CSS + Lucide | Custom animations, clean iconography |
| **Database** | SQLite → PostgreSQL | Simple local dev, easy scale-up |
| **ORM** | SQLAlchemy 2 + Alembic | Async ORM, migrations |
| **OCR** | Google Vision API + OpenCV | Best handwriting recognition |
| **Vector DB** | ChromaDB | Local-first, no cloud needed |
| **LLM** | LiteLLM (Claude/GPT) | Provider-agnostic, swap anytime |
| **Package Mgr** | uv (Python), npm (Node) | Fast and reliable dependency resolution |

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- Python (v3.11+)
- [uv](https://docs.astral.sh/uv/) — install with: `pip install uv` (recommended for backend)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/adityanair2509/answersheetevaluator.git
cd answersheetevaluator
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies using uv
uv sync --all-extras

# Configure environment variables
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start API server (auto-reload)
.venv\Scripts\uvicorn apps.api.main:app --reload --host 0.0.0.0 --port 8000
```
*(On Linux/macOS, use `.venv/bin/uvicorn` to start the server)*

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open **http://localhost:5173** to view the application in your browser.
Open **http://localhost:8000/docs** for the interactive backend API Swagger UI.

---

## 🧪 Confidence & Routing

The system computes a **multi-signal confidence score** for each answer:

```
Final Confidence = f(OCR confidence × Retrieval score × LLM confidence × Rubric match)

≥ 0.85  →  ✅ Auto-approved    (no human review needed)
0.65–0.85 → 🟡 Optional review  (teacher can spot-check)
< 0.65  →  🔴 Mandatory review  (human must verify)
```

---

## 🗄️ Data Model

The system uses normalized relational tables combined with vector embeddings:

```
exams ──────────────────── questions
  │                            │
  ├── answer_keys ─────────── answer_key_chunks (RAG vectors)
  │
  └── answer_sheets ─────────── sheet_pages
            │
            └── extracted_answers (OCR output)
                      │
                      └── evaluation_results (LLM scores)
                                │
                                ├── confidence_flags (review triggers)
                                └── teacher_overrides (human corrections)
```

---

## 📄 License

MIT — see [LICENSE](LICENSE)
