# syntax=docker/dockerfile:1.6
# Backend server Dockerfile (Express + Socket.io)
# This is NOT a Next.js app - it's the standalone backend API server
# Build context is root directory, but we only copy server/ files

FROM node:20-slim AS base
WORKDIR /app

# Install dependencies separately to leverage Docker cache
FROM base AS deps
# Copy only server's package.json and lockfile
COPY server/package.json server/package-lock.json* ./
# Ignore postinstall scripts to prevent root package.json postinstall from running
RUN npm install --production=false --ignore-scripts

FROM deps AS build
# Copy only server source files (all TypeScript files and configs)
COPY server/tsconfig.json server/drizzle.config.ts ./
COPY server/*.ts ./
COPY server/db/ ./db/
COPY server/routes/ ./routes/
COPY server/utils/ ./utils/
COPY server/middleware/ ./middleware/
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Only production deps
COPY server/package.json server/package-lock.json* ./
# Ignore postinstall scripts to prevent root package.json postinstall from running
RUN npm install --omit=dev --ignore-scripts

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
