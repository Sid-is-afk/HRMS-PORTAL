# Stage 1: Builder
FROM python:3.13-slim as builder
WORKDIR /app
COPY pyproject.toml .
RUN pip install uv
RUN uv pip install --system -r pyproject.toml

# Stage 2: Runtime
FROM python:3.13-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
