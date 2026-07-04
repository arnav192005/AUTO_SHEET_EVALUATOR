# AUTOEVAL (Answer Sheet Evaluator)

A modern, AI-powered web application for evaluating answer sheets, designed to help educators quickly grade papers, apply custom rubrics, and generate detailed insights.

## 🚀 Features
- **Fast & Accurate AI Evaluation**: Streamline the grading process with advanced automated checking combining OCR and LLMs.
- **Custom Rubrics & Context**: Define how answers should be checked by providing custom rubrics and contextual documents via RAG.
- **Rich Insights & Analytics**: Gain an overview of student performance and identify areas of improvement through interactive charts.
- **Modern & Interactive UI**: Built with a premium, smooth, and highly responsive design using CSS animations and hover effects.
- **Responsive Dashboard**: Track progress and manage classes from any device.

## 🛠️ Technologies Used
- **[React](https://react.dev/)**: Frontend library for building user interfaces.
- **[Vite](https://vitejs.dev/)**: Next-generation, lightning-fast frontend build tool.
- **[FastAPI](https://fastapi.tiangolo.com/)**: High-performance async web framework for the backend API.
- **[SQLAlchemy & Alembic](https://www.sqlalchemy.org/)**: Robust ORM and database migrations using SQLite.
- **[Google Cloud Vision](https://cloud.google.com/vision)**: For state-of-the-art OCR on scanned PDFs and images.
- **[ChromaDB](https://www.trychroma.com/)**: Vector database for Retrieval-Augmented Generation (RAG).
- **[LiteLLM](https://github.com/BerriAI/litellm)**: Provider-agnostic LLM interface for grading and reasoning.
- **[React Router DOM](https://reactrouter.com/)**: For seamless client-side routing across different pages (Dashboard, Upload, Review, etc.).
- **[Lucide React](https://lucide.dev/)**: Beautiful and consistent iconography throughout the application.

## ⚙️ Getting Start

### Prerequisites
- Node.js (v18+)
- Python (v3.11+)
- `uv` package manager (optional, but recommended for Python)

### Backend Setup
1. Open terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create virtual environment and install dependencies:
   ```bash
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv pip install -e .
   ```
3. Run database migrations:
   ```bash
   alembic upgrade head
   ```
4. Start the server:
   ```bash
   fastapi run apps/main.py
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
