# Interview notes

Use these notes to explain what is implemented in this repository. Do not describe future integrations as completed work.

## Resume bullets

- Built a full-stack portfolio builder using React, TypeScript, Spring Boot, and PostgreSQL, with editable profile, project, skill, education, experience, and social-link data.
- Implemented stateless JWT authentication with BCrypt password hashing, server-side ownership checks, DTO-based APIs, and centralized validation errors.
- Added server-side GitHub repository lookup/import and Gemini-powered writing suggestions that remain editable before users save them.
- Created three data-independent portfolio presentations, a shareable publishing slug, and a public endpoint that only exposes published portfolios.

## Architecture explanation

**Why a modular monolith?** The first release has one domain and one deployment unit. Controllers, services, repositories, entities, and integration clients keep responsibilities separate without adding distributed-system overhead.

**How is a private project protected?** The JWT filter validates the signature and expiry, then Spring Security makes its subject available as the authenticated principal. Project reads, updates, and deletes query by both project ID and that principal's email.

**Why DTOs?** They keep JPA entities and relationships inside the persistence layer, define stable API contracts, and avoid serializing password hashes or lazy-loaded associations.

**How does publishing work?** A portfolio belongs one-to-one with its account. Its slug and template are settings separate from content. The public lookup queries only a matching published slug; private editing APIs still require a valid token.

**How are AI suggestions handled?** The backend calls Gemini with a server-side key and prompts it to use only supplied facts. The API returns text; the browser presents it as a draft. Saving profile or project content is a separate user action.

**How does GitHub import work?** The browser submits the username and selected repository name. The backend fetches canonical public repository metadata, then creates a project draft from the response. The client does not decide what metadata is trusted.

## Interview questions to practice

1. Where would you move Hibernate `ddl-auto: update` before production? Explain how reviewed Flyway migrations and `validate` reduce accidental schema changes.
2. What are the tradeoffs of storing a bearer token in browser local storage? Discuss XSS exposure, short token lifetimes, and a future HttpOnly cookie design.
3. How would you add refresh-token rotation and account recovery without weakening the current auth model?
4. How would you protect public GitHub lookup from abuse and respect rate limits?
5. How would you make AI generation resilient to timeouts and rate limits while keeping the user's original content safe?
6. Which database indexes would matter as the user and portfolio tables grow? Consider unique email/slug constraints and owner-scoped project lookups.
7. What changes are needed to support multiple portfolios per account or custom domains?

## Current implementation limits

The editor currently persists profile, skills, projects, education, experience, social links, and portfolio settings. Registration/login and ownership rules are implemented. Deployment has a Docker Compose layout but has not been exercised in this environment because Docker is unavailable. Gemini requires a user-provided key. No GitHub OAuth or billing is included.
