# HRMS Portal Backend

## Overview
Backend Foundation for an Enterprise HRMS Portal.

## Tech Stack
- **Python:** 3.13+
- **Framework:** FastAPI
- **Database:** PostgreSQL (via asyncpg), SQLAlchemy (async), Alembic
- **Package Manager:** uv
- **Linting & Formatting:** Ruff, Black, Mypy
- **Testing:** Pytest

## Prerequisites
- Python 3.13+
- [uv](https://docs.astral.sh/uv/)
- Docker & Docker Compose

## Quick Start
1. Clone the repository and navigate to the backend folder.
2. Install dependencies:
   ```bash
   uv sync
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start development services:
   ```bash
   docker compose up -d
   ```
5. Run the application (using `uv run` or by entering the virtual environment):
   ```bash
   uvicorn app.main:app --reload
   ```

## Development Commands
- **Run server:** `uvicorn app.main:app --reload`
- **Test:** `pytest`
- **Lint:** `ruff check .`
- **Format:** `black .`
- **Type-check:** `mypy .`
- **Migrate:** `alembic upgrade head`

## Architecture Overview
The backend follows a standard layered architecture with FastAPI routers, domain services, and repository patterns using SQLAlchemy 2.0.

## Coding Standards
- Max line length is 88 (enforced by Black/Ruff).
- Strict typing with mypy.
- Use `pytest` for all tests (which are located in `tests/`).
