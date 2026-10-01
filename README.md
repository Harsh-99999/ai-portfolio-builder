# Foliocraft — AI Portfolio Builder

A full-stack portfolio builder for developers and students. Create a profile, organize projects and skills, import public GitHub repositories, request optional AI writing suggestions, choose a visual template, and publish a shareable portfolio.

## Stack

- Frontend: React, TypeScript, Vite, React Router, TanStack Query, Zod, Lucide
- Backend: Java 21, Spring Boot, Spring Security, JWT, Bean Validation, JPA/Hibernate
- Database: PostgreSQL
- Integrations: Gemini GenerateContent API and GitHub public REST API

## Run locally

1. Start PostgreSQL with `docker compose up -d postgres`.
2. In `backend`, run `mvn spring-boot:run`.
3. In `frontend`, run `npm install` once, then `npm run dev`.
4. Open `http://localhost:5173`. The backend is at `http://localhost:8080`.

For local AI use, set `GEMINI_API_KEY` in the backend process environment (for example, `$env:GEMINI_API_KEY="your-key"` in PowerShell before starting Maven). GitHub lookup works without a token for modest development use. Docker Compose reads the root `.env` file automatically.

The local database defaults are `portfolio` / `portfolio` in `docker-compose.yml`. They are for local development only. Production uses Flyway migrations and schema validation with credentials supplied through the hosting platform.

## Run the stack in Docker

Set `JWT_SECRET` in `.env` to a long random value, then run `docker compose up --build`. The app is available at `http://localhost:5173`, the API at `http://localhost:8080`, and PostgreSQL is persisted in a named Docker volume.

The frontend build uses `VITE_API_URL` (default `http://localhost:8080`). For deployment, set it to the public HTTPS API URL and set `FRONTEND_ORIGIN` to the exact hosted frontend origin.

## Free demo deployment (Render + Neon)

`render.yaml` describes a free Render static site and a free Docker web service. It uses Neon for PostgreSQL so the database does not expire with Render's 30-day free database limit. The production Spring profile applies the Flyway baseline migration and then validates the schema. Create a Neon project, then connect this repository to Render as a Blueprint and provide `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, and `GEMINI_API_KEY` in Render's secret prompts. `DATABASE_URL` must use JDBC form, for example `jdbc:postgresql://<Neon-host>/<database>?sslmode=require`; keep its username and password in their separate variables. Render generates `JWT_SECRET` and wires the frontend URL to backend CORS and the API URL to the frontend build.

This zero-cost configuration is for a public demo: Render free web services spin down after 15 minutes of inactivity and can take about a minute to wake. Neon Free has usage and storage limits. Upgrade the backend and database plans before relying on the deployment for production workloads or important user data. Never commit `.env` or paste secrets into `render.yaml`.

## Main routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Product landing page |
| `/register`, `/login` | Public | Account creation and login |
| `/dashboard` | JWT | Portfolio overview and publishing controls |
| `/dashboard/profile` | Dashboard navigation | Profile editor |
| `/dashboard/preview` | JWT | Portfolio preview; profile, project, and section edits appear before saving |
| `/portfolio/:slug` | Public | Published portfolio page |

Dashboard sections are navigated from the sidebar. Private APIs require `Authorization: Bearer <token>`; public portfolio reads only return published portfolios.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET/PUT /api/profile`
- `GET/POST/PUT/DELETE /api/skills[/{id}]`
- `GET/POST/PUT/DELETE /api/projects[/{id}]`
- `GET/POST/PUT/DELETE /api/education[/{id}]`
- `GET/POST/PUT/DELETE /api/experience[/{id}]`
- `GET/POST/PUT/DELETE /api/social-links[/{id}]`
- `GET/PUT /api/portfolio`, `POST /api/portfolio/publish`, `POST /api/portfolio/unpublish`
- `GET /api/public/portfolio/{slug}`
- `GET /api/github/repos/{username}`, `POST /api/github/import`
- `POST /api/ai/generate-about`, `/improve-text`, `/project-description`, `/experience-description`, `/professional-summary`
- `GET /api/health` and `/actuator/health`

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | JDBC PostgreSQL URL |
| `DATABASE_USERNAME`, `DATABASE_PASSWORD` | Database credentials |
| `JWT_SECRET` | HMAC signing secret; production requires at least 32 bytes |
| `JWT_EXPIRATION_MINUTES` | Token lifetime, defaults to 1440 |
| `FRONTEND_ORIGIN` | Exact allowed browser origin for CORS |
| `GEMINI_API_KEY` | Server-side Gemini key; never expose it to the browser |
| `GEMINI_MODEL` | Gemini model name; defaults to `gemini-3.8-flash` |
| `GITHUB_TOKEN` | Optional server-side token to raise GitHub API limits |
| `VITE_API_URL` | Frontend build-time API base URL |
| `SPRING_PROFILES_ACTIVE` | Set to `prod` to enable production startup checks and schema validation |

## Deployment readiness

The `prod` Spring profile requires `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, a 32-byte-or-longer `JWT_SECRET`, and the exact hosted `FRONTEND_ORIGIN`. It changes Hibernate from automatic schema updates to validation, so deployment will fail safely if the database schema is not prepared. Versioned Flyway migrations are included under `backend/src/main/resources/db/migration`. The Render Blueprint wires `VITE_API_URL` to the deployed API URL and configures the production database and secret variables. The included Compose stack remains intended for local development and does not configure HTTPS or production-grade database backups.

## Current boundaries

AI results are suggestions. The user must edit or accept them before saving. AI prompts explicitly ask the model not to invent facts, outcomes, or metrics. GitHub import fetches the chosen public repository on the server and imports its metadata as a project draft. The initial auth implementation uses stateless JWTs; logout clears the browser token, while issued tokens expire according to configuration.
