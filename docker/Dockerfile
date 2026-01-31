# Build stage
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

WORKDIR /app

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps ./apps

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build application
RUN pnpm turbo run build --filter=@unuxt/web

# Production stage
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxt

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nuxt:nodejs /app/apps/web/.output ./.output

USER nuxt

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
