# Backend Local Setup Guide

This guide provides a step-by-step walkthrough to help you and your teammates set up the backend locally. It covers creating the `.env` file, initializing the virtual environment using `uv`, running database migrations, and launching the development server.

---

## 1. Create the Environment File (`.env`)

The `.env` file stores configuration settings, secret keys, and database connection strings.

### Steps
1. Navigate to the backend directory:
   ```bash
   cd apps/backend
   ```
2. Copy the template `.env.example` to create your local `.env` file:
   * **Windows PowerShell**:
     ```powershell
     Copy-Item .env.example .env
     ```
   * **Windows Command Prompt (CMD)**:
     ```cmd
     copy .env.example .env
     ```
   * **macOS / Linux**:
     ```bash
     cp .env.example .env
     ```

3. Open `apps/backend/.env` in your text editor.


**the below step is not REQUIRED NOW only the 4th**

4. **Generate and replace secure keys**:
   Generate secure random hexadecimal strings for `SECRET_KEY` and `JWT_SECRET_KEY` by running the following Python command in your terminal:
   ```bash
   python -c "import secrets; print(f'SECRET_KEY={secrets.token_hex(32)}\nJWT_SECRET_KEY={secrets.token_hex(32)}')"
   ```
   Copy the output strings and update `SECRET_KEY` and `JWT_SECRET_KEY` in your `.env`.

5. **Configure your Database connection**:
   Provide your local or cloud PostgreSQL database connection string in the `DATABASE_URL` variable:
   ```env
   DATABASE_URL=postgresql+asyncpg://<username>:<password>@<host>:<port>/<dbname>
   ```

---

## 2. Initialize the Python Virtual Environment (`.venv`)

This project uses **`uv`** for fast package resolution and virtual environment management.

### Steps
1. Install `uv` globally if you haven't already:
   ```bash
   pip install uv
   ```
2. Create the virtual environment:
   ```bash
   uv venv
   ```
3. Activate the virtual environment:
   * **Windows PowerShell**:
     ```powershell
     .venv\Scripts\Activate.ps1
     ```
   * **Windows CMD**:
     ```cmd
     .venv\Scripts\activate.bat
     ```
   * **macOS / Linux**:
     ```bash
     source .venv/bin/activate
     ```
4. Sync locked dependencies into the virtual environment:
   ```bash
   uv sync
   ```

---

## 3. Run Database Migrations

Apply the database migrations to set up the correct schema tables.

### Steps
1. Ensure your virtual environment is active.
2. Run the migrations:
   ```bash
   alembic upgrade head
   ```

---

## 4. Run the Local Development Server

Start the FastAPI hot-reloading server:

```bash
uvicorn app.main:app --reload
```

Once running, the backend is accessible at:
* **Interactive OpenAPI docs**: http://localhost:8000/docs
* **Alternative ReDoc interface**: http://localhost:8000/redoc
