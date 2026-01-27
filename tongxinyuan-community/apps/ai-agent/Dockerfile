FROM python:3.11-slim-bookworm

WORKDIR /app

# Install system dependencies (minimized)
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Install Python dependencies from official PyPI (via Proxy)
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run with single worker for low memory usage (ECS 2G optimization)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
