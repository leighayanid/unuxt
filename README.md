# Unuxt - Universal Nuxt 4 Starter Template

A production-ready Nuxt 4 starter template with authentication, organizations, and more.

## Features

- **Nuxt 4** with latest features and compatibility
- **Nuxt UI v4** for beautiful, accessible components
- **Better Auth** for authentication (email/password, OAuth, magic links, 2FA)
- **Organizations** with RBAC (roles and permissions)
- **Profile Management** with avatar uploads
- **Email System** with beautiful HTML templates (password reset, verification, invitations)
- **Security First**
  - Environment validation with Zod
  - Security headers (CSP, HSTS, X-Frame-Options, etc.)
  - CSRF protection
  - Rate limiting (150 req/min)
  - Password breach checking (Have I Been Pwned)
  - Strong password requirements
- **Theme Management** (dark/light mode, custom colors)
- **Cloudinary** for image uploads
- **PostgreSQL** with Drizzle ORM
- **Testing** with Vitest + Playwright E2E
- **Docker** ready for deployment
- **Turborepo** monorepo structure

## Tech Stack

- **Framework:** Nuxt 4
- **UI:** Nuxt UI v4, Tailwind CSS v4
- **Auth:** Better Auth
- **Database:** PostgreSQL, Drizzle ORM
- **Utilities:** VueUse, Motion Vue
- **Build:** Turborepo, pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for database)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/unuxt.git
cd unuxt
```

2. Install dependencies:

```bash
pnpm install
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Start the database:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

5. Run database migrations:

```bash
pnpm db:push
```

6. Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000`

## Project Structure

```
unuxt/
├── apps/
│   └── web/                    # Main Nuxt 4 application
├── packages/
│   ├── ui/                     # Shared UI components layer
│   ├── db/                     # Drizzle ORM schema
│   ├── auth/                   # Better Auth configuration
│   ├── types/                  # Shared TypeScript types
│   ├── utils/                  # Shared utilities
│   └── config/                 # ESLint, TypeScript configs
├── docker/                     # Docker configuration
├── docker-compose.yml          # Production Docker setup
├── docker-compose.dev.yml      # Development Docker setup
└── turbo.json                  # Turborepo configuration
```

## Scripts

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm dev:web          # Start only the web app

# Build
pnpm build            # Build all packages and apps

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Drizzle Studio

# Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm typecheck        # Run TypeScript checks
```

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth secret (min 32 chars)
- `GOOGLE_CLIENT_ID/SECRET` - Google OAuth
- `GITHUB_CLIENT_ID/SECRET` - GitHub OAuth
- `CLOUDINARY_*` - Cloudinary credentials

## Deployment

### Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual

```bash
# Build
pnpm build

# Start
node apps/web/.output/server/index.mjs
```

## License

MIT
