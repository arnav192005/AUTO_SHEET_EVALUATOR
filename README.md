<div align="center">
  <h1>📝 AUTO_SHEET_EVALUATOR</h1>
  <p><strong>Automated Answer Sheet Evaluator — OCR + RAG + LLM grading pipeline</strong></p>
</div>

A modern, AI-powered web application for evaluating answer sheets. It is designed to help educators quickly grade handwritten papers, apply custom rubrics, and generate detailed insights using advanced Machine Learning techniques.

## 🚀 Features

- **Fast & Accurate AI Evaluation**: Streamline the grading process with an automated pipeline combining OCR (Google Cloud Vision), RAG (ChromaDB), and LLMs.
- **Handwriting Recognition**: Robust OCR capabilities using OpenCV and Google Cloud Vision to accurately extract handwritten text from scanned answer sheets.
- **Custom Rubrics & Context**: Upload grading rubrics and reference materials. The RAG pipeline intelligently retrieves relevant context for grading.
- **Rich Insights & Analytics**: Gain an overview of student performance and identify areas of improvement through beautiful interactive charts (Recharts).
- **Modern & Interactive UI**: Built with a premium, smooth, and highly responsive design using React, Lucide icons, and Tailwind/Vanilla CSS.
- **Responsive Dashboard**: Track progress and manage classes from any device.

## 🛠️ Technologies Used

### Frontend
- **[React 19](https://react.dev/)**: Frontend library for building user interfaces.
- **[Vite](https://vitejs.dev/)**: Next-generation, lightning-fast frontend build tool.
- **[React Router DOM](https://reactrouter.com/)**: For seamless client-side routing.
- **[Recharts](https://recharts.org/)**: Composable charting library for analytics and insights.
- **[Lucide React](https://lucide.dev/)**: Beautiful and consistent iconography.
- **[KaTeX](https://katex.org/)**: Fast math typesetting for rendering mathematical formulas.

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)**: High-performance async web framework for the API.
- **[SQLAlchemy & Alembic](https://www.sqlalchemy.org/)**: ORM and database migrations (using SQLite/asyncio).
- **[Google Cloud Vision](https://cloud.google.com/vision)**: For state-of-the-art OCR on scanned PDFs and images.
- **[ChromaDB](https://www.trychroma.com/)**: Vector database for Retrieval-Augmented Generation (RAG).
- **[LiteLLM](https://github.com/BerriAI/litellm)**: Provider-agnostic LLM interface for grading and reasoning.
- **[OpenCV & Pillow](https://opencv.org/)**: Image processing and PDF-to-image conversion.

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.11+)
- `uv` package manager (optional, but recommended for Python)

### 1. Backend Setup

```bash
cd backend

# Create a virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .

# Run database migrations
alembic upgrade head

# Start the FastAPI server
fastapi run apps/main.py
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open `http://localhost:5173` to view the application in your browser.

## 📜 License

This project is licensed under the terms included in the LICENSE file.
