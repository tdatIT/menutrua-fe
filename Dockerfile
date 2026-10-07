# syntax=docker/dockerfile:1.7
# =============================================================================
# MenuTrua FE — multi-stage build
#   1. deps    : install dependencies with Bun (cached, frozen lockfile)
#   2. build   : typecheck + Vite build for the chosen environment
#   3. runtime : unprivileged nginx serving the static SPA
#
# Build:
#   docker build -t menutrua-fe .                                 # production
#   docker build -t menutrua-fe:dev --build-arg APP_ENV=development .  # mock API
# Run:
#   docker run --rm -p 8080:8080 -e API_UPSTREAM=http://api:8080 menutrua-fe
# =============================================================================

ARG BUN_VERSION=1.4.2
ARG NGINX_VERSION=1.29-alpine

# -----------------------------------------------------------------------------
# 1) Dependencies
# -----------------------------------------------------------------------------
FROM oven/bun:${BUN_VERSION}-slim AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# -----------------------------------------------------------------------------
# 2) Build
# -----------------------------------------------------------------------------
FROM oven/bun:${BUN_VERSION}-slim AS build
WORKDIR /app

# Which .env.<mode> file Vite loads: production | development
ARG APP_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run typecheck \
 && bunx --bun vite build --mode "${APP_ENV}"

# -----------------------------------------------------------------------------
# 3) Runtime
# -----------------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runtime

ARG APP_ENV=production
LABEL org.opencontainers.image.title="menutrua-fe" \
      org.opencontainers.image.description="MenuTrua SPA served by nginx" \
      com.menutrua.app-env="${APP_ENV}"

# Backend the /api proxy forwards to. Override at `docker run` time.
ENV API_UPSTREAM=http://menutrua-be:8080 \
    # Lets the nginx entrypoint expose resolv.conf nameservers as
    # ${NGINX_LOCAL_RESOLVERS} so the upstream is resolved lazily.
    NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1

COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
