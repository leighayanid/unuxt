# UNuxt Deployment Plan

## Overview

This document outlines the deployment strategy for the UNuxt monorepo containing:
- **@unuxt/web** - Main Nuxt 4 application (port 3000)
- **@unuxt/docs** - Documentation site using Docus (port 3001)

---

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure all required environment variables are configured:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Auth secret (min 32 chars) |
| `BETTER_AUTH_URL` | Yes | Auth base URL (e.g., https://yourdomain.com) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth secret |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth secret |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |
| `SMTP_HOST` | No | SMTP server hostname |
| `SMTP_PORT` | No | SMTP port |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `FROM_EMAIL` | No | Sender email address |
| `NODE_ENV` | Yes | Set to `production` |

### 2. Generate Auth Secret

```bash
openssl rand -base64 32
```

### 3. Database Ready

- PostgreSQL 16+ instance available
- Connection string tested
- Network access configured (firewall rules)

---

## Deployment Options

### Option A: Docker Compose (Recommended for Self-Hosted)

Best for: VPS, dedicated servers, on-premise deployments.

#### 1. Clone and Configure

```bash
git clone <repo-url> unuxt
cd unuxt
cp .env.example .env
# Edit .env with production values
```

#### 2. Build and Deploy

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f app

# Check health
docker compose ps
```

#### 3. Run Database Migrations

```bash
docker compose exec app pnpm db:migrate
```

#### 4. Enable Nginx (Optional)

Uncomment the nginx service in `docker-compose.yml` and add SSL certificates:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./docker/nginx.conf:/etc/nginx/nginx.conf:ro
    - ./certs:/etc/nginx/certs:ro
  depends_on:
    - app
```

---

### Option B: Docker Single Container

Best for: Kubernetes, Docker Swarm, cloud container services.

#### 1. Build Image

```bash
docker build -f docker/Dockerfile -t unuxt:latest .
```

#### 2. Run Container

```bash
docker run -d \
  --name unuxt \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/unuxt" \
  -e BETTER_AUTH_SECRET="your-secret-here" \
  -e BETTER_AUTH_URL="https://yourdomain.com" \
  -e NODE_ENV="production" \
  unuxt:latest
```

---

### Option C: Vercel Deployment

Best for: Serverless, automatic scaling, zero-ops.

#### 1. Install Vercel CLI

```bash
pnpm add -g vercel
```

#### 2. Create vercel.json

```json
{
  "buildCommand": "pnpm turbo run build --filter=@unuxt/web",
  "outputDirectory": "apps/web/.output",
  "framework": "nuxtjs",
  "installCommand": "pnpm install"
}
```

#### 3. Deploy

```bash
cd apps/web
vercel --prod
```

#### 4. Configure Environment Variables

Set environment variables in Vercel Dashboard > Project Settings > Environment Variables.

**Note:** Requires external PostgreSQL (e.g., Neon, Supabase, Railway).

---

### Option D: Manual Node.js Deployment

Best for: Traditional hosting, PM2-managed deployments.

#### 1. Build Application

```bash
pnpm install
pnpm build
```

#### 2. Start Server

```bash
node apps/web/.output/server/index.mjs
```

#### 3. Use PM2 for Process Management

```bash
# Install PM2
pnpm add -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'unuxt-web',
    script: 'apps/web/.output/server/index.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## CI/CD Pipeline Setup

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  build-and-push:
    needs: lint-and-typecheck
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/Dockerfile
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/unuxt
            docker compose pull
            docker compose up -d
            docker compose exec -T app pnpm db:migrate
```

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `SERVER_HOST` | Production server hostname/IP |
| `SERVER_USER` | SSH username |
| `SERVER_SSH_KEY` | SSH private key |

---

## Database Operations

### Initial Setup

```bash
# Generate migration files from schema changes
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Push schema directly (development only)
pnpm db:push

# Seed demo data
pnpm --filter @unuxt/db db:seed
```

### Backup Strategy

```bash
# Manual backup
pg_dump -h localhost -U postgres -d unuxt > backup_$(date +%Y%m%d).sql

# Restore
psql -h localhost -U postgres -d unuxt < backup_20240101.sql
```

### Docker Backup

```bash
docker compose exec db pg_dump -U postgres unuxt > backup.sql
```

---

## Health Checks

### Application Health

The app exposes health check at startup. Docker Compose includes:

```yaml
healthcheck:
  test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Monitoring Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /` | Application availability |
| `GET /api/health` | API health (implement if needed) |

---

## Security Checklist

- [ ] SSL/TLS certificate configured
- [ ] `BETTER_AUTH_SECRET` is unique and secure (32+ chars)
- [ ] Database not exposed to public internet
- [ ] Firewall rules configured (only 80/443 open)
- [ ] OAuth redirect URIs match production domain
- [ ] CORS configured for production domain
- [ ] Security headers enabled (via Nginx or Nuxt)
- [ ] Rate limiting configured
- [ ] Logs don't contain sensitive data

---

## Rollback Procedure

### Docker Compose

```bash
# Tag current image before update
docker tag unuxt:latest unuxt:previous

# Rollback to previous version
docker compose down
docker tag unuxt:previous unuxt:latest
docker compose up -d
```

### Database Rollback

```bash
# Restore from backup
docker compose exec -T db psql -U postgres -d unuxt < backup.sql
```

---

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Use Nginx, HAProxy, or cloud LB
2. **Session Storage**: Configure Redis for shared sessions
3. **Database**: Use read replicas for heavy read loads

### Vertical Scaling

Recommended minimum specs:
- **Small**: 1 vCPU, 2GB RAM (up to 100 concurrent users)
- **Medium**: 2 vCPU, 4GB RAM (up to 500 concurrent users)
- **Large**: 4 vCPU, 8GB RAM (up to 2000 concurrent users)

---

## Post-Deployment Verification

1. **Homepage loads**: `curl -I https://yourdomain.com`
2. **Auth flow works**: Test login/signup
3. **Database connected**: Create test organization
4. **OAuth configured**: Test social logins
5. **Email delivery**: Test magic link/password reset
6. **SSL valid**: Check certificate expiry

---

## Troubleshooting

### Container won't start

```bash
docker compose logs app
```

### Database connection failed

```bash
# Test connection
docker compose exec app node -e "console.log(process.env.DATABASE_URL)"

# Check database is running
docker compose exec db pg_isready
```

### Build failures

```bash
# Clean rebuild
pnpm clean
pnpm install
pnpm build
```

### Memory issues

Increase Node memory in Dockerfile:
```dockerfile
ENV NODE_OPTIONS="--max-old-space-size=4096"
```
