FROM python:3.11-slim-bookworm

WORKDIR /app

# Install system dependencies (minimized)
# Update sources to Aliyun for China ECS (HTTP, Classic output to avoid CRLF issues)
RUN echo "deb http://mirrors.aliyun.com/debian/ bookworm main non-free non-free-firmware contrib" > /etc/apt/sources.list && \
    echo "deb http://mirrors.aliyun.com/debian-security/ bookworm-security main non-free non-free-firmware contrib" >> /etc/apt/sources.list && \
    echo "deb http://mirrors.aliyun.com/debian/ bookworm-updates main non-free non-free-firmware contrib" >> /etc/apt/sources.list && \
    rm -f /etc/apt/sources.list.d/debian.sources

RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/

RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Install Python dependencies from official PyPI (via Proxy)
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run with single worker for low memory usage (ECS 2G optimization)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
