# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install production deps only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy Next build output + required files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./ 
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Next.js production server
CMD ["npm", "run", "start"]
