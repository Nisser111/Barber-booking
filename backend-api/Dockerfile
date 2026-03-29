# ── Stage 1: dependencies ─────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Stage 2: development ──────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:22-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start:dev"]

# ── Stage 3: build ────────────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── Stage 4: production ───────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
EXPOSE 4000
CMD ["node", "dist/main"]
