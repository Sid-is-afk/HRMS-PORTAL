# Operations Runbook - Enterprise HRMS Portal

This document outlines standard procedures for monitoring, logs, startup, and runtime operations.

---

## 1. Application Architecture & Services
The platform runs as a two-tier containerized architecture:
1. **Compute (FastAPI/ASGI)**: Serves API traffic on Port 8000.
2. **Caching & Lock Store (Redis)**: Handles token blacklists and idempotency checks on Port 6379.
3. **Database (Neon PostgreSQL)**: External managed database.

## 2. Server Startup and Lifecycle
To start the production service using docker-compose:
```bash
docker compose -f docker-compose.prod.yml up -d
```

### Startup Sequence
1. Start the Redis cache service and run its health checks.
2. Once Redis is healthy, start the backend container instances.
3. Run Alembic migrations as a pre-start script (inside container runtime or deployment runner):
   ```bash
   alembic upgrade head
   ```

## 3. Structured Logging & Log Analysis
The application produces structured JSON logs. Key properties in every log record include:
- `asctime`: The timestamp of the log event.
- `levelname`: Log severity (`INFO`, `WARNING`, `ERROR`, `CRITICAL`).
- `message`: Text message.
- `correlation_id`: The request-scoped correlation/trace ID tracking the request lifecycle (defaults to `-` for system logs).

To inspect logs from docker-compose:
```bash
docker compose -f docker-compose.prod.yml logs -f backend
```

## 4. Health Checks and Monitoring
The application exposes standard endpoints under `/api/v1/health` prefix:
- **Liveness**: `/api/v1/health/live` (checks if web server is responsive, returns `{"status": "alive"}`).
- **Readiness**: `/api/v1/health/ready` (queries database connection status, returns `{"status": "ready", "database": "connected"}`).
- **Version**: `/api/v1/health/version` (reports app environment metadata).
