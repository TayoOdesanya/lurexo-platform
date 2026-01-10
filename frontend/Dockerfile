# syntax=docker/dockerfile:1.6

FROM node:20-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
RUN npm ci

FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json

# Copy only frontend sources needed for Next build
COPY frontend/app ./frontend/app
COPY frontend/lib ./frontend/lib
COPY frontend/public ./frontend/public
COPY frontend/next.config.* ./frontend/
COPY frontend/tsconfig.json ./frontend/
COPY frontend/next-env.d.ts ./frontend/
COPY frontend/eslint.config.* ./frontend/
COPY frontend/postcss.config.* ./frontend/

RUN npm --workspace frontend run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
COPY --from=build /app/frontend/package.json ./frontend/package.json
COPY --from=build /app/frontend/.next ./frontend/.next
COPY --from=build /app/frontend/public ./frontend/public

CMD ["npm", "--workspace", "frontend", "run", "start"]
