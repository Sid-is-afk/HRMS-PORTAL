# Stage 1: Builder
FROM python:3.13-slim as builder

# Prevent python from writing pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install uv for rapid dependency installation
RUN pip install --no-cache-dir uv

# Copy only dependency definitions first to leverage docker caching
COPY pyproject.toml uv.lock ./

# Install project dependencies system-wide (using system flag in uv)
RUN uv pip install --system --no-cache -r pyproject.toml

# Stage 2: Runtime
FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-privileged system user for executing backend code
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -m -s /bin/bash appuser

# Copy installed system packages and binaries from builder stage
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy app code and set owner permissions
COPY --chown=appuser:appgroup . .

# Set execution context to the non-root app user
USER appuser

EXPOSE 8000

# Native python healthcheck ensuring no external tools (curl/wget) are required in runtime
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/v1/health/live')"

# Launch uvicorn with multi-worker scaling for production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
