# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Unuxt is a production-ready Nuxt 4 starter template with authentication, organizations, and RBAC. It's a Turborepo monorepo using pnpm workspaces with strict TypeScript.

**Tech Stack:** Nuxt 4, Better Auth, Drizzle ORM (PostgreSQL), Nuxt UI v4, Tailwind CSS v4, Vitest, Playwright

## Common Commands

### Development
```bash
pnpm dev              # Start all apps (web on :3000, docs on :3001)
pnpm dev:web          # Start only web app
pnpm docs:dev         # Start only docs app
```

### Database
```bash
pnpm db:push          # Push schema changes (development)
pnpm db:generate      # Generate migration files
pnpm db:migrate       # Run migrations (production)
pnpm db:studio        # Open Drizzle Studio (database GUI)
```

### Testing
```bash
pnpm test                              # Run all tests via Turborepo
pnpm test:watch                        # Watch mode for TDD
pnpm test:ui                           # Interactive test UI
pnpm test:coverage                     # Generate coverage reports

# Package-specific tests
pnpm --filter @unuxt/utils test        # Test utilities package
pnpm --filter @unuxt/web test          # Test web app (unit tests)
pnpm --filter @unuxt/web test:e2e      # Run Playwright E2E tests
pnpm --filter @unuxt/web test:e2e:ui   # Playwright with UI debugger
```

### Quality
```bash
pnpm lint             # ESLint all packages
pnpm lint:fix         # Auto-fix ESLint issues
pnpm typecheck        # TypeScript check all packages
pnpm build            # Build all packages and apps
```

## Architecture

### Monorepo Structure

```
packages/
├── auth/          # Better Auth configuration (server + client)
├── db/            # Drizzle ORM schemas and client
├── utils/         # Shared utilities, validators, constants
├── types/         # Shared TypeScript types
├── config/        # ESLint, TypeScript base configs
└── ui/            # Nuxt layer for shared UI components

apps/
├── web/           # Main Nuxt 4 app (customer-facing)
└── docs/          # Docus-based documentation (Nuxt 4)
```

### Key Architectural Patterns

#### 1. Better Auth Integration

- **Server:** `packages/auth/src/server.ts` exports the auth instance
- **Client:** `packages/auth/src/client.ts` exports createClient function
- **Plugins:** Organization (RBAC), Two-Factor, Magic Link
- **Database Adapter:** Uses Drizzle with shared schemas from `@unuxt/db`

**Auth flow:**
1. Better Auth API route: `apps/web/server/api/auth/[...all].ts` (handles all auth endpoints)
2. Client-side auth: Injected via plugin at `apps/web/plugins/auth.client.ts`
3. Session management: `useAuth()` composable auto-imports session state
4. Route protection: Middleware in `apps/web/middleware/` (auth.global.ts, admin.ts, org.ts)

#### 2. Database Layer (Drizzle ORM)

- **Schemas:** All in `packages/db/src/schema/` (users, auth, organizations, members)
- **Client:** Single db instance exported from `packages/db/src/client.ts`
- **Migrations:** Run `pnpm db:push` in development, `pnpm db:migrate` in production
- **Better Auth Integration:** Auth schemas defined in `packages/db/src/schema/auth.ts`

**Schema organization:**
- `users.ts` - Core user table (extends Better Auth user)
- `auth.ts` - Better Auth tables (sessions, accounts, verifications, twoFactors)
- `organizations.ts` - Organization table with slug-based routing
- `members.ts` - Organization membership with roles (owner, admin, member)

#### 3. Organization & RBAC System

**Three-tier role hierarchy:**
- `owner` - Full control, can delete org
- `admin` - Manage members, invitations (cannot delete org)
- `member` - Read-only access

**Permission system:**
- Permissions defined in `packages/utils/src/constants.ts` (PERMISSIONS, DEFAULT_ROLE_PERMISSIONS)
- Check permissions: `usePermissions()` composable
- Organization context: `useOrganization()` composable tracks active org
- Route protection: `middleware/org.ts` validates org membership

**Organization flow:**
1. User creates org → becomes owner
2. Owner/admin invites members → invitation record created in database
3. Email sent with invitation link: `/auth/accept-invite/[invitationId]`
4. Invited user clicks link:
   - If not logged in: Prompted to sign in or create account (redirects back after auth)
   - If logged in: Auto-accepts invitation and redirects to organization
5. Member record created with specified role
6. Access controlled by membership + role + permissions

**Invitation acceptance:**
- Page: `apps/web/app/pages/auth/accept-invite/[token].vue`
- Uses Better Auth's `acceptInvitation` API
- Handles edge cases: expired, already accepted, invalid tokens
- Composable: `useOrganization().acceptInvitation(invitationId)`

#### 4. Nuxt App Structure (`apps/web`)

**SSR Configuration (nuxt.config.ts):**
- Dashboard, org, admin routes: `ssr: false` (client-side only)
- Public pages (landing, auth): SSR enabled for SEO
- Protected routes use middleware for auth checks

**Route structure:**
```
/                    # Landing page (SSR)
/auth/*              # Auth pages (login, register, magic-link, etc.)
/dashboard/*         # User dashboard (client-only)
/org/*               # Organization management (client-only)
/admin/*             # Global admin panel (client-only, role-gated)
```

**Auto-imports:**
- Composables from `app/composables/` (useAuth, useOrganization, usePermissions, useTheme)
- Components from `app/components/` with pathPrefix: false
- Better Auth client via `$authClient` from plugin
- Nuxt auto-imports (useState, useRouter, navigateTo, etc.)

#### 5. Testing Infrastructure

**Test Organization:**
- Tests colocated with source: `src/file.ts` → `src/file.test.ts`
- E2E tests: `apps/web/tests/e2e/*.spec.ts`
- Test setup: `apps/web/tests/setup.ts` (mocks Nuxt auto-imports)

**Coverage targets:**
- @unuxt/utils: 90% (pure functions)
- @unuxt/db: 70% (schema validation)
- @unuxt/auth: 50% (configuration)
- apps/web: 60% (app complexity)

**Testing patterns:**
- Unit tests: Mock external dependencies (Better Auth, DB, h3)
- Component tests: Simplified due to Nuxt UI complexity (use E2E instead)
- API route tests: Documented patterns (complex mocking, prefer E2E)
- E2E tests: Playwright for full user flows (auth, org management)

**Running specific tests:**
```bash
# Run single test file
pnpm --filter @unuxt/utils test src/validation.test.ts

# Run E2E test file
pnpm --filter @unuxt/web test:e2e tests/e2e/auth.spec.ts

# Debug mode
pnpm --filter @unuxt/web test:e2e:debug
```

## Important Patterns & Conventions

### 1. Email Sending

**Email package:** `@unuxt/email` - Nodemailer with HTML templates

**Setup:**
1. Configure SMTP in `.env`:
```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
FROM_EMAIL=noreply@example.com
FROM_NAME=Unuxt
```

2. Email service auto-initializes on server startup via `apps/web/server/plugins/email.ts`

**Available templates:**
- `resetPasswordEmail()` - Password reset with expiring link
- `verifyEmailTemplate()` - Email verification
- `magicLinkEmail()` - Passwordless login
- `organizationInvitationEmail()` - Org invites

**Usage in Better Auth:**
All auth emails are automatically sent via `packages/auth/src/server.ts`. Falls back to console logging if SMTP not configured (development mode).

**Testing emails:**
- Use Mailtrap or Ethereal for dev testing
- Gmail requires app-specific password (not regular password)
- Check server logs for "[EMAIL] Email service initialized successfully"

### 2. Environment Variables

**Required for development:**
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Min 32 chars for auth encryption
- `BETTER_AUTH_URL` - App URL (http://localhost:3000 in dev)

**Optional (OAuth):**
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

**Optional (Features):**
- `CLOUDINARY_*` - Image uploads (conditional module loading)
- `SMTP_*` - Email sending (currently console.log stubs)

**Environment files:**
- `.env` - Development (git-ignored)
- `.env.example` - Template with all variables
- `.env.test` - Test environment template

### 2. Adding New Database Tables

1. Create schema file in `packages/db/src/schema/your-table.ts`
2. Export from `packages/db/src/schema/index.ts`
3. Run `pnpm db:push` to sync with database
4. Create migration: `pnpm db:generate` (optional for production)

**Schema conventions:**
- Use `text("id").primaryKey()` for IDs
- Include `createdAt` and `updatedAt` timestamps with `.$onUpdate(() => new Date())`
- Use `notNull()` for required fields
- Define relations in same file as table

### 3. Adding New API Routes

**Server routes in** `apps/web/server/api/`:
```typescript
// server/api/your-route.get.ts
import { auth } from '@unuxt/auth/server'
import { db } from '@unuxt/db'

export default defineEventHandler(async (event) => {
  // 1. Verify session
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // 2. Query database
  const data = await db.query.yourTable.findMany()

  // 3. Return response
  return { data }
})
```

**Patterns:**
- Auth routes: `auth/[...all].ts` (handled by Better Auth)
- Organization routes: Check membership in middleware/handler
- Admin routes: Check `user.role === 'admin'`
- Use h3 utilities: `getRouterParam()`, `readBody()`, `createError()`

### 4. Protected Routes & Middleware

**Global middleware** (`middleware/auth.global.ts`):
- Runs on every route
- Redirects to `/auth/login` if auth required and not logged in

**Route-specific middleware:**
- `middleware/org.ts` - Validates org membership
- `middleware/admin.ts` - Requires global admin role

**Apply in pages:**
```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['org'], // Apply org middleware
  layout: 'dashboard',
})
</script>
```

### 5. Composable Patterns

**Key composables:**
- `useAuth()` - Session, user, login/logout methods
- `useOrganization()` - Active org, switch org, org list
- `usePermissions()` - Check permissions for current user in org
- `useTheme()` - Dark mode toggle, color mode

**Composable conventions:**
- Auto-imported from `app/composables/`
- Return reactive refs and computed values
- Use Nuxt's `useState()` for cross-component state
- Handle loading/error states internally

### 6. Turborepo Task Orchestration

**Task dependencies:**
- `build` depends on `^build` (dependencies build first)
- `test` depends on `^build` (packages built before testing)
- Caching enabled for: `build`, `lint`, `typecheck`, `test`
- No cache for: `dev`, `db:*` tasks

**Cache optimization:**
- Inputs: All source files, configs, package.json
- Outputs: `.nuxt/`, `.output/`, `dist/`, `coverage/`
- Environment vars affect cache: `DATABASE_URL`, `BETTER_AUTH_*`, etc.

**Filter syntax:**
```bash
pnpm --filter @unuxt/web build      # Build single package
pnpm --filter "./packages/*" test   # Test all packages
pnpm --filter "...@unuxt/web" build # Build web + dependencies
```

## Database Schema Reference

### Users & Auth
- `users` - Core user table (id, email, name, image, role, 2FA)
- `sessions` - Better Auth sessions
- `accounts` - OAuth provider accounts
- `verifications` - Email verification tokens
- `twoFactors` - TOTP secrets

### Organizations
- `organizations` - Org table (id, name, slug, logo, metadata)
- `members` - User-org membership (userId, organizationId, role)
- `invitations` - Pending invitations (email, organizationId, role, status)

**Key relationships:**
- User → Members → Organizations (many-to-many)
- Organization → Members → Users (with role)
- Organization → Invitations (one-to-many)

## Gotchas & Important Notes

1. **Better Auth client initialization:** The client is created in a plugin and injected as `$authClient`. Don't create new instances.

2. **Database migrations:** Use `pnpm db:push` in development, but generate migrations (`pnpm db:generate`) before deploying to production.

3. **Organization slug routing:** Slugs are unique and used in URLs (`/org/[slug]`). Enforce validation from `@unuxt/utils/validation` (slugSchema).

4. **Email sending:** Implemented via `@unuxt/email` package with Nodemailer. Configure SMTP in `.env` (see `packages/email/README.md`). Falls back to console.log if SMTP not configured.

5. **Cloudinary module:** Conditionally loaded based on env var. App works without it (upload features disabled).

6. **SSR route rules:** Dashboard/org/admin routes are client-only. Don't expect `$fetch` calls to these routes during SSR.

7. **Test mocking:** Nuxt auto-imports must be mocked in test setup (`apps/web/tests/setup.ts`). Complex component tests are better as E2E.

8. **Role hierarchy:** Owner > Admin > Member. Only owners can delete orgs. Check role hierarchy in `packages/utils/src/constants.ts` (ROLE_HIERARCHY).

9. **Middleware execution order:** Global middleware runs first (auth.global.ts), then route-specific middleware (org.ts, admin.ts).

10. **Nuxt 4 compatibility mode:** Set in nuxt.config.ts. Some features may differ from Nuxt 3 docs.

## Documentation

- **Testing Guide:** `docs/TESTING.md` - Comprehensive testing patterns and examples
- **README:** Project setup, installation, basic usage
- **Deployment:** See README for Docker and manual deployment instructions
