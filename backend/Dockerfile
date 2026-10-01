FROM python:3.11-slim

# Install system dependencies required for OpenCV and pdf2image
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Install uv for fast dependency management
RUN pip install uv

WORKDIR /app

# Copy pyproject.toml and uv.lock
COPY pyproject.toml uv.lock ./

# Install dependencies (including all extras for RAG, OCR, etc)
RUN uv sync --all-extras

# Copy the rest of the application code
COPY . .

# The database is created on first start (in the mounted ./data volume).
# Don't seed at build time: data/ is a volume, and seed data is fake demo content.

EXPOSE 8000

# Start FastAPI server
CMD ["uv", "run", "uvicorn", "apps.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
