# backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only backend package files first (better caching)
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci

# Copy backend source
COPY backend/ ./

# Generate Prisma client (now schema is at ./prisma/schema.prisma)
RUN npx prisma generate

# Build NestJS
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/backend
ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy built output + prisma schema + generated prisma client bits
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
CMD ["node", "dist/main.js"]
