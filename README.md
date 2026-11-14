# ArgoCD-Helm

## Books monorepo

A Turborepo monorepo with a NestJS backend and a Vite + React frontend implementing simple Books CRUD (name + description).

```
apps/
  backend/   # NestJS API, Books CRUD backed by Postgres (TypeORM)
  frontend/  # Vite + React UI
```

### Requirements

- Node.js 22+
- pnpm (`corepack enable` will provide it)
- A Postgres instance for local (non-Docker) development

### Setup

```bash
pnpm install
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
cp .env.example .env # only needed for docker-compose variable substitution
```

By default the backend expects Postgres at `localhost:5432` with user/password/db `books`/`books`/`books` (see `apps/backend/.env.example`). Quickest way to get that locally — this repo's Compose file exposes Postgres on host port `5433` (to avoid clashing with a local Postgres install), so set `DB_PORT=5433` in `apps/backend/.env`:

```bash
docker compose up postgres -d
```

### Development

```bash
pnpm dev
```

- Backend: http://localhost:3001 (see `apps/backend/.env.example` for `PORT`, `CORS_ORIGIN`, `DB_*`)
- Frontend: http://localhost:5173 (see `apps/frontend/.env.example` for `VITE_API_URL`)

The backend uses TypeORM with `synchronize: true`, so the `book` table is created/updated automatically from the entity — no manual migrations needed for this simple example.

### Docker

Run the whole stack (Postgres + backend + frontend) with Docker Compose:

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3001
- Postgres: localhost:5433 (mapped from the container's 5432 to avoid clashing with a local Postgres install)

Or build/run each image individually. Both Dockerfiles use the monorepo root as build context (they need the root `package.json`/`pnpm-workspace.yaml`/`turbo.json`) and no longer bake in any env values — the backend reads everything from an env file at runtime, and the frontend's `VITE_API_URL` is a required build arg:

```bash
# Backend (needs a reachable Postgres — edit apps/backend/.env accordingly,
# e.g. DB_HOST=host.docker.internal when Postgres runs on the host)
docker build -f apps/backend/Dockerfile -t books-backend .
docker run --rm -p 3001:3001 --env-file apps/backend/.env books-backend

# Frontend (VITE_API_URL is baked in at build time, so it must be a build arg)
docker build -f apps/frontend/Dockerfile -t books-frontend \
  --build-arg VITE_API_URL=http://localhost:3001 .
docker run --rm -p 8080:80 books-frontend
```

### Notes

- API: `GET/POST /books`, `GET/PATCH/DELETE /books/:id`.
