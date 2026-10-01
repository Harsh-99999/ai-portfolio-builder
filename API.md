# REST API

Base URL: `http://localhost:8080`. JSON endpoints use `Content-Type: application/json`. Except for authentication, health, and public portfolio reads, endpoints require `Authorization: Bearer <JWT>`.

## Authentication

`POST /api/auth/register`

```json
{"email":"dev@example.com","password":"at-least-8-characters"}
```

`POST /api/auth/login` accepts the same shape. Both return `{ "token": "...", "email": "dev@example.com" }`. Registration returns HTTP 201 and creates a profile and draft portfolio.

## Authenticated portfolio data

| Method | Path | Behavior |
|---|---|---|
| GET, PUT | `/api/profile` | Read or update fullName, headline, bio, profileImageUrl, location, phone |
| GET, POST | `/api/skills` | List/create `{name, category}` |
| PUT, DELETE | `/api/skills/{id}` | Update/delete only if owned by the caller |
| GET, POST | `/api/projects` | List/create projects with descriptions, URLs, technologies, displayOrder |
| GET, PUT, DELETE | `/api/projects/{id}` | Read/update/delete only if owned by the caller |
| GET, POST | `/api/education` | List/create institution, degree, field, dates, description |
| PUT, DELETE | `/api/education/{id}` | Update/delete only if owned by the caller |
| GET, POST | `/api/experience` | List/create company, position, dates, current role, description |
| PUT, DELETE | `/api/experience/{id}` | Update/delete only if owned by the caller |
| GET, POST | `/api/social-links` | List/create `{platform, url}` |
| PUT, DELETE | `/api/social-links/{id}` | Update/delete only if owned by the caller |
| GET, PUT | `/api/portfolio` | Read or update title, slug, template (`minimal`, `modern`, `developer`) |
| POST | `/api/portfolio/publish` | Publish and set `publishedAt` |
| POST | `/api/portfolio/unpublish` | Hide from public lookup |

## Public and integration routes

| Method | Path | Behavior |
|---|---|---|
| GET | `/api/public/portfolio/{slug}` | Return portfolio data only when that slug is published |
| GET | `/api/github/repos/{username}` | List public, non-fork repositories |
| POST | `/api/github/import` | Body `{ "username": "octocat", "repository": "Hello-World" }`; fetch canonical metadata and create a project draft |
| POST | `/api/ai/generate-about` | Suggest an about section from supplied facts |
| POST | `/api/ai/improve-text` | Suggest an edit to supplied text |
| POST | `/api/ai/project-description` | Suggest a project description |
| POST | `/api/ai/experience-description` | Suggest role wording |
| POST | `/api/ai/professional-summary` | Suggest a professional summary |

AI routes return `{ "suggestion": "..." }`; they never write the suggestion into portfolio data. The frontend must preserve the original until the user accepts and saves a draft.

## Errors

Application errors use this shape:

```json
{
  "timestamp": "2026-10-01T10:00:00Z",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "name: must not be blank",
  "path": "/api/projects"
}
```

Validation errors return 400, duplicate email/slug errors return 409, ownership misses return 404, and upstream integration failures use 502/503 responses. Stack traces and upstream API keys are not returned.
