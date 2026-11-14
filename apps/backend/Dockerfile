# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/backend/package.json apps/backend/package.json
RUN pnpm install --frozen-lockfile=false --filter backend... --ignore-scripts

COPY apps/backend apps/backend
RUN pnpm --filter backend run build

# --- Runtime stage ---
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

COPY --from=build /app/apps/backend/package.json ./package.json
COPY --from=build /app/apps/backend/dist ./dist
RUN pnpm install --prod --frozen-lockfile=false --ignore-scripts

# PORT, CORS_ORIGIN and DB_* are provided at runtime via an env file
# (see apps/backend/.env.example), not baked into the image.
EXPOSE 3001

CMD ["node", "dist/main.js"]
