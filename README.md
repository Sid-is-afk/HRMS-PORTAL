
# HRMS Portal

> Enterprise-grade, mobile-first Human Resource Management System built with **React Native (Expo)** and **FastAPI**, designed with scalability, maintainability, and cloud-agnostic deployment in mind.

---

## Overview

HRMS Portal streamlines core HR operations for organizations through a modern mobile application. The project follows a modular architecture, offline-first principles, and clean engineering practices to support long-term growth from MVP to enterprise scale.

## Core Features

- Secure Authentication (JWT + Refresh Tokens)
- Employee Management
- Attendance Tracking
- Leave Management
- Role-Based Access Control (RBAC)
- User Profiles
- Offline Synchronization
- Audit Logging
- Multi-Tenant Architecture
- Cloud-Agnostic Deployment

---

## Tech Stack

### Mobile

- React Native (Expo Development Build)
- JavaScript
- React Navigation
- Zustand
- TanStack Query
- React Hook Form
- Zod
- NativeWind
- MMKV
- Axios

### Backend

- FastAPI
- Python
- SQLAlchemy 2
- Alembic
- PostgreSQL
- Pydantic v2
- JWT
- bcrypt

---

## Project Structure

```text
hrms-portal/
├── mobile/
├── backend/
├── database/
├── infrastructure/
├── docs/
└── scripts/
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| PRD.md | Product requirements |
| Architecture.md | System architecture |
| Schema.md | Database design |
| TRD.md | Technical requirements |
| Flow.md | User & System flows |
| Design.md | Design system |
| Plan.md | Engineering execution plan |
| GitWorkflow.md | Git collaboration guide |

---

## Architecture Principles

- Modular Monolith
- Microservice Ready
- API First
- Offline First
- Security by Default
- Multi-Tenant
- Scalable
- Clean Architecture

---

## Development Workflow

1. Clone the repository.
2. Create a feature branch.
3. Implement the feature.
4. Write or update tests.
5. Open a Pull Request.
6. Complete code review.
7. Merge after CI passes.

Refer to **GitWorkflow.md** for detailed collaboration rules.

---

## Local Setup

### Prerequisites

- Git
- Node.js (LTS)
- Expo CLI
- Python 3.13+
- uv
- PostgreSQL
- Docker (recommended)

### Clone

```bash
git clone <repository-url>
cd hrms-portal
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

### Backend

```bash
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

---

## Quality Standards

- Feature-based architecture
- Conventional Commits
- Pull Request reviews
- Automated testing
- Documentation-first development
- Secure coding practices

---

## Roadmap

### MVP

- Authentication
- Employee Management
- Attendance
- Leave
- Dashboard
- Profile

### Future

- Payroll
- Notifications
- Reports
- Analytics
- AI Insights
- Enterprise Integrations

---

## Contributing

1. Read `GitWorkflow.md`.
2. Follow coding standards.
3. Keep pull requests focused.
4. Update documentation when required.
5. Ensure tests pass before requesting review.

---

## License

This repository is intended for internal development. Add an appropriate open-source or proprietary license before public release.

---

## Acknowledgements

This project follows documentation-driven development. Engineering decisions are captured in the accompanying documentation suite to ensure consistency, traceability, and maintainability throughout the software lifecycle.
 
 Test contribution by  SINCHANA. 