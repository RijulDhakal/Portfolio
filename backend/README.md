# Portfolio CMS — Backend

ASP.NET Core Web API + PostgreSQL + EF Core + JWT for the Rijul Dhakal portfolio. The public site and `/admin` CMS are served by the Next.js frontend in `frontend/`; this API provides all data.

## Architecture

```
Portfolio.Api             ASP.NET Core Web API (controllers, JWT, Serilog, Swagger)
Portfolio.Application     Services, DTOs, validators, business logic
Portfolio.Domain          Entities, enums, roles
Portfolio.Infrastructure  EF Core DbContext, storage providers, seeder
tests/Portfolio.Tests     Integration tests (Testcontainers)
```

## Prerequisites

- .NET SDK 10.0+
- PostgreSQL 16+ (or Docker for `docker-compose up postgres`)

## Quick Start

```bash
cd backend

# 1. Start PostgreSQL (option A: Docker)
docker compose up -d postgres

# 2. Configure environment
cp .env.example .env
# set JWT_SECRET (openssl rand -base64 64), optionally ADMIN_EMAIL/ADMIN_PASSWORD

# 3. Run (applies migrations + seeds on first boot)
dotnet run --project src/Portfolio.Api
```

The API listens on `http://localhost:5261` (Development). Swagger UI: `http://localhost:5261/swagger`.

Default admin (only on first seed): `admin@rijuldhakal.com` / `Admin@123!` — change the password or set `ADMIN_EMAIL`/`ADMIN_PASSWORD` before first run.

## Configuration (env vars)

| Variable | Description |
|---|---|
| `DATABASE_CONNECTION_STRING` | PostgreSQL connection string |
| `JWT_SECRET` | Symmetric signing key (≥ 32 bytes, base64) |
| `JWT_ISSUER` / `JWT_AUDIENCE` | Token issuer/audience |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins (`Cors:AllowedOrigins:0` etc. in config) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin credentials |
| `STORAGE_PROVIDER` | `local` (default) or `s3` |
| `STORAGE_BUCKET` / `STORAGE_ENDPOINT` / `STORAGE_CREDENTIALS_*` | S3 options |

All values map to the config sections in `appsettings.json` (`Jwt`, `Media`, `Storage`, `Cors`) using `__` as the section separator (e.g. `JWT__SECRET`).

## EF Migrations

```bash
dotnet ef migrations add <Name> \
  --project src/Portfolio.Infrastructure \
  --startup-project src/Portfolio.Api
dotnet ef database update \
  --project src/Portfolio.Infrastructure \
  --startup-project src/Portfolio.Api
```

Migrations also run automatically on startup (`MigrateAsync` inside the seeder).

## API Overview

Public (`/api/v1`): `hero`, `about`, `skills`, `services`, `projects`, `projects/{slug}`, `experiences`, `educations`, `social-links`, `settings`, `contact` (POST).

Auth (`/api/v1/auth`): `login`, `refresh`, `logout`, `me`. Short-lived access token (15 min) + rotating refresh token (14 days, SHA-256 stored, reuse detection revokes all sessions).

Admin (`/api/v1/admin`, `[Authorize]`): content CRUD (`hero`, `about`, `settings`, `skills`, `services`, `projects`, `experiences`, `educations`, `social-links`), media upload/replace/delete/metadata, messages (list/read/delete), `dashboard/stats`.

All responses use `{ "success": bool, "message": string|null, "data": T|null, "errors": string[]|null }`.

## Storage

- `local` (default): files stored under `uploads/`, served at `/uploads/*`.
- `s3`: files stored in the configured bucket; URLs point to the object storage endpoint.

The database stores metadata and URLs only — blobs never touch PostgreSQL.

## Docker

```bash
docker compose up --build   # postgres + api
```

API: `http://localhost:8080`. Set `JWT_SECRET` and `FRONTEND_URL` in your environment (`.env`).

## Tests

```bash
dotnet test
```

Integration tests use Testcontainers PostgreSQL, so Docker must be running.

## Notes

- The Next.js frontend (repo root `frontend/`) is intentionally separate; the CMS lives there under `/admin` and consumes this API.
- Seed data mirrors the original hardcoded frontend content (skills with orbit positions, services, projects, experience, education, social links).
