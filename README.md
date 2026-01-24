# Lurexo

Monorepo with a NestJS backend and a Next.js frontend.

## Local development

Prereqs:
- Node.js 20+
- Postgres (local or remote)

Backend:
1) Copy `backend/.env.example` to `backend/.env` and fill in values.
2) Install deps at repo root:
   - `npm install`
3) Run Prisma generate/migrate:
   - `npm --workspace backend run prisma:generate`
   - `npm --workspace backend run prisma:migrate`
4) Start backend:
   - `npm run dev:backend`

Frontend:
1) Set API base URL (for local dev):
   - `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001`
2) Install deps at repo root (if not already):
   - `npm install`
3) Start frontend:
   - `npm run dev:frontend`

Health check:
- `GET http://localhost:3001/health`

## Azure deployment

Backend (Azure App Service):
- Deploys as a Node app (no container). The workflow in `.github/workflows/deploy-backend.yml`
  builds and zips `backend/dist` + `backend/prisma` + root `node_modules`.
- Configure App Service application settings (or Key Vault references) for:
  `DATABASE_URL`, `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_CONTAINER`,
  `JWT_SECRET`, `JWT_REFRESH_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `SENDGRID_API_KEY`, and any other secrets in `backend/.env.example`.
- Optional: keep `appsettings.json`/`appsettings.Production.json` in `backend/` as defaults;
  environment variables always win.
- Health endpoint for App Service probes: `/health`.

Frontend:
- Current config is Next.js standalone output, intended for Azure App Service (Node).
  The workflow in `.github/workflows/deploy-frontend.yml` builds and deploys the standalone output.
- If you want Azure Static Web Apps, confirm the app can be fully static and switch
  Next.js to `output: "export"` (not enabled by default).

## Build commands

- Backend build: `npm --workspace backend run build`
- Frontend build: `npm --workspace frontend run build`
