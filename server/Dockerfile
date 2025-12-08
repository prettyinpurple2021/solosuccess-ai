# syntax=docker/dockerfile:1.6

FROM node:20-slim AS base
WORKDIR /app

# Install dependencies separately to leverage Docker cache
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --production=false

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Only production deps
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]

