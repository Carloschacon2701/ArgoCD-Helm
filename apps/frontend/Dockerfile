# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/frontend/package.json apps/frontend/package.json
RUN pnpm install --frozen-lockfile=false --filter frontend... --ignore-scripts

COPY apps/frontend apps/frontend

# Vite env vars are baked in at build time, so this must be passed as
# --build-arg (e.g. sourced from apps/frontend/.env) — no default here.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm --filter frontend run build

# --- Runtime stage ---
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
