# Multi-stage Dockerfile for Todo App Phase II
# Builds both backend and frontend services

# ============================================
# Stage 1: Backend Builder
# ============================================
FROM python:3.11-slim as backend-builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY backend/ ./backend/

# ============================================
# Stage 2: Frontend Builder
# ============================================
FROM node:20-slim as frontend-builder

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json* ./frontend/

# Install dependencies and build
WORKDIR /app/frontend
RUN npm ci --only=production && npm run build

# Copy frontend source code
COPY frontend/ .

# ============================================
# Stage 3: Backend Runtime
# ============================================
FROM python:3.11-slim as backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create non-root user
RUN useradd --create-home --shell /bin/bash appuser

# Copy Python dependencies from builder
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=backend-builder /usr/local/bin/ /usr/local/bin/

# Copy backend application
COPY --from=backend-builder --chown=appuser:appuser /app/backend/ ./

# Switch to non-root user
USER appuser

# Expose backend port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Run backend
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# ============================================
# Stage 4: Frontend Runtime
# ============================================
FROM node:20-slim as frontend

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create non-root user
RUN useradd --create-home --shell /bin/bash appuser

# Copy built Next.js app from builder
COPY --from=frontend-builder --chown=appuser:appuser /app/frontend/ ./frontend/

# Switch to non-root user
USER appuser

# Set working directory to frontend
WORKDIR /app/frontend

# Expose frontend port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Run frontend
CMD ["npm", "start"]