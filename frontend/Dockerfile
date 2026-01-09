# syntax=docker/dockerfile:1.6

# ---- deps (install using root lockfile) ----
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only what's needed for npm to resolve workspaces + lockfile
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json

RUN npm ci

# ---- build (build only the frontend workspace) ----
FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json ./package-lock.json
COPY --from=deps /app/frontend ./frontend
COPY --from=deps /app/backend ./backend

# Copy repo source (frontend code, etc.)
COPY . .

RUN npm --workspace frontend run build

# ---- runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

EXPOSE 3000

# Minimal runtime files
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/frontend/package.json ./frontend/package.json
COPY --from=build /app/frontend/.next ./frontend/.next
COPY --from=build /app/frontend/public ./frontend/public

CMD ["npm", "--workspace", "frontend", "run", "start"]
