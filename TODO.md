# TODO - Unuxt Development Roadmap

## 🚨 Critical Features (Currently Stubbed)

### 1. Email Sending System ✅ COMPLETED
**Priority: HIGH** - ~~Currently all emails are `console.log` only~~

**Implementation tasks:**
- [x] Create `@unuxt/email` package
- [x] Add nodemailer with SMTP configuration
- [x] Create email templates (HTML + text)
  - [x] Password reset
  - [x] Email verification
  - [x] Magic link
  - [x] Organization invitation
- [x] Update `packages/auth/src/server.ts` to use email service
- [x] Add environment variables to `.env.example`
- [x] Create server plugin to initialize email service
- [x] Add documentation (README.md, CLAUDE.md)

**Files affected:**
- `packages/auth/src/server.ts` (lines 32, 39, 79, 95)
- New: `packages/email/`

**Env vars needed:**
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `FROM_EMAIL`
- `FROM_NAME` (optional)

---

### 2. Invitation Acceptance Flow ✅ COMPLETED
**Priority: HIGH** - ~~Invitations can be sent but acceptance is incomplete~~

**Implementation tasks:**
- [x] Create `/auth/accept-invite/[token]` page
- [x] Uses Better Auth's built-in acceptInvitation API (no custom route needed)
- [x] Secure invitation tokens (handled by Better Auth)
- [x] Token expiration via database schema
- [x] Handle edge cases:
  - [x] Expired tokens
  - [x] Already accepted invitations
  - [x] User already in organization
  - [x] Organization deleted
- [x] Send email with acceptance link
- [x] Auto-accept if user is logged in
- [x] Redirect to org after acceptance
- [x] Add acceptInvitation to useOrganization composable
- [x] Add E2E test placeholders
- [x] Add unit tests for email template

**Files created:**
- `apps/web/app/pages/auth/accept-invite/[token].vue` ✅
- `apps/web/tests/e2e/invitation.spec.ts` ✅
- `packages/email/src/templates/organization-invitation.test.ts` ✅

**Files updated:**
- `packages/auth/src/server.ts` - Updated invitation email URL generation
- `apps/web/app/composables/useOrganization.ts` - Added acceptInvitation method

---

### 3. Documentation Content
**Priority: MEDIUM** - Docs app exists but has minimal content

**Content to add:**
- [ ] Getting Started
  - [ ] Installation guide
  - [ ] Configuration walkthrough
  - [ ] First organization setup
  - [ ] Deployment instructions
- [ ] Features Documentation
  - [ ] Authentication system
  - [ ] Organizations & RBAC
  - [ ] Permissions guide
  - [ ] Profile management
  - [ ] 2FA setup
- [ ] API Reference
  - [ ] API routes documentation
  - [ ] Authentication headers
  - [ ] Response formats
  - [ ] Error codes
- [ ] Development Guide
  - [ ] Project structure
  - [ ] Adding packages
  - [ ] Database migrations
  - [ ] Testing guide (already exists)

**Directory structure:**
```
apps/docs/content/
├── 1.getting-started/
├── 2.features/
├── 3.api/
└── 4.development/
```

---

## 📋 Important Missing Features

### 4. Admin Panel Enhancements
**Priority: MEDIUM**

**Current state:** Basic user list and stats
**To add:**
- [ ] User Management
  - [ ] Ban/unban users
  - [ ] Delete users (with confirmation)
  - [ ] Reset user passwords
  - [ ] View user sessions
  - [ ] Impersonate user (for support)
- [ ] Organization Management
  - [ ] List all organizations
  - [ ] Organization details view
  - [ ] Force delete organizations
  - [ ] Transfer ownership
- [ ] System Settings
  - [ ] Feature flags
  - [ ] Rate limit configuration
  - [ ] Email template customization
- [ ] Audit Logs Viewer
  - [ ] Filter by user, action, date
  - [ ] Export logs to CSV
  - [ ] Search functionality

**Files to create/update:**
- `apps/web/app/pages/admin/organizations.vue`
- `apps/web/app/pages/admin/settings.vue`
- `apps/web/app/pages/admin/audit-logs.vue`
- `apps/web/server/api/admin/organizations.get.ts`
- `apps/web/server/api/admin/user-actions.post.ts`

---

### 5. E2E Test Completion
**Priority: MEDIUM**

**Current state:** Placeholders and skipped tests
**To implement:**
- [ ] Complete auth E2E tests
  - [ ] Full registration flow
  - [ ] Login with valid/invalid credentials
  - [ ] Password reset flow
  - [ ] Magic link flow
  - [ ] Email verification
- [ ] Organization E2E tests
  - [ ] Create organization
  - [ ] Update organization settings
  - [ ] Upload logo
  - [ ] Invite member
  - [ ] Accept invitation
  - [ ] Change member roles
  - [ ] Remove member
  - [ ] Delete organization
- [ ] Admin E2E tests
  - [ ] Access control (non-admin blocked)
  - [ ] User management actions
  - [ ] Stats display

**Files to update:**
- `apps/web/tests/e2e/auth.spec.ts`
- `apps/web/tests/e2e/organization.spec.ts`
- New: `apps/web/tests/e2e/admin.spec.ts`

---

### 6. Audit Logging System
**Priority: MEDIUM** - Important for security and compliance

**Implementation tasks:**
- [ ] Create audit logs schema
- [ ] Add audit log middleware/utility
- [ ] Log critical actions:
  - [ ] User actions (login, logout, password change, 2FA enable/disable)
  - [ ] Organization actions (create, update, delete, member add/remove)
  - [ ] Admin actions (user ban, impersonate, etc.)
- [ ] Create audit log viewer (admin only)
- [ ] Add filtering and search
- [ ] Implement log retention policy
- [ ] Add export functionality

**Files to create:**
- `packages/db/src/schema/audit-logs.ts`
- `packages/utils/src/audit-logger.ts`
- `apps/web/server/utils/audit.ts`
- `apps/web/app/pages/admin/audit-logs.vue`
- `apps/web/server/api/admin/audit-logs.get.ts`

**Schema:**
```typescript
{
  id: string
  userId: string
  action: string        // 'user.login', 'org.create', etc.
  entityType: string    // 'user', 'organization', 'member'
  entityId: string
  metadata: jsonb       // Action-specific data
  ipAddress: string
  userAgent: string
  createdAt: timestamp
}
```

---

## 🎯 Nice-to-Have Enhancements

### 7. API Rate Limiting
**Priority: MEDIUM**

- [ ] Verify Better Auth rate limiting works
- [ ] Add rate limiting to custom API routes
- [ ] Use Redis for distributed rate limiting (optional)
- [ ] Add rate limit headers to responses
- [ ] Create admin UI for rate limit configuration
- [ ] Add rate limit bypass for admins

**Package to add:**
```bash
pnpm add h3-rate-limit
pnpm add ioredis  # if using Redis
```

---

### 8. User Activity Dashboard
**Priority: LOW**

- [ ] Login history with IP and device info
- [ ] Active sessions management
  - [ ] View all active sessions
  - [ ] Revoke individual sessions
  - [ ] Revoke all sessions
- [ ] Organization activity timeline
- [ ] Profile change history
- [ ] Download personal data (GDPR compliance)

**Files to create:**
- `apps/web/app/pages/dashboard/activity.vue`
- `apps/web/app/pages/dashboard/sessions.vue`
- `apps/web/server/api/user/sessions.get.ts`
- `apps/web/server/api/user/sessions/[id].delete.ts`

---

### 9. Organization Analytics
**Priority: LOW**

- [ ] Member growth chart
- [ ] Activity metrics (logins, actions)
- [ ] Invitation acceptance rate
- [ ] Active vs inactive members
- [ ] Export analytics data

**Files to create:**
- `apps/web/app/pages/org/[id]/analytics.vue`
- `apps/web/server/api/org/[id]/analytics.get.ts`

---

### 10. 2FA Backup Codes
**Priority: MEDIUM**

- [ ] Generate 10 backup codes on 2FA enable
- [ ] Store hashed backup codes
- [ ] Allow one-time use of backup codes
- [ ] UI to view/regenerate backup codes
- [ ] Warning when running low on codes

**Files to create:**
- `packages/db/src/schema/backup-codes.ts`
- `apps/web/app/pages/dashboard/settings/backup-codes.vue`
- `apps/web/server/api/user/backup-codes.get.ts`
- `apps/web/server/api/user/backup-codes/regenerate.post.ts`

---

### 11. Advanced Search
**Priority: LOW**

- [ ] Full-text search in admin panel
- [ ] Organization search (by name, slug)
- [ ] User search (by email, name)
- [ ] Consider PostgreSQL full-text search or Algolia
- [ ] Add search filters and sorting

**Implementation options:**
- PostgreSQL `tsvector` and `tsquery`
- Algolia integration
- MeiliSearch (self-hosted)

---

### 12. Webhooks System
**Priority: LOW**

- [ ] Create webhook schema
- [ ] Add webhook configuration UI (org settings)
- [ ] Implement webhook dispatcher
- [ ] Support events:
  - [ ] `member.added`
  - [ ] `member.removed`
  - [ ] `org.updated`
  - [ ] `invitation.sent`
  - [ ] `invitation.accepted`
- [ ] Add retry logic with exponential backoff
- [ ] Webhook signature verification
- [ ] Webhook logs and delivery status

**Files to create:**
- `packages/db/src/schema/webhooks.ts`
- `apps/web/server/utils/webhook-dispatcher.ts`
- `apps/web/app/pages/org/[id]/webhooks.vue`
- `apps/web/server/api/org/[id]/webhooks.{get,post,delete}.ts`

---

### 13. API Documentation
**Priority: LOW**

- [ ] Generate OpenAPI/Swagger spec
- [ ] Add API documentation UI
- [ ] Document all public API routes
- [ ] Add authentication examples
- [ ] Create API client examples

**Package options:**
```bash
pnpm add @scalar/nuxt
# or
pnpm add swagger-jsdoc swagger-ui-express
```

---

### 14. Monitoring & Observability
**Priority: MEDIUM** (important for production)

- [ ] Error tracking with Sentry
- [ ] Structured logging with Pino
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Database query performance tracking
- [ ] Custom metrics dashboard

**Packages to add:**
```bash
pnpm add @sentry/nuxt
pnpm add pino pino-pretty
pnpm add @opentelemetry/api
```

---

## 🎨 UI/UX Improvements

### 15. Missing Pages & Features

**Pages to create:**
- [ ] `/org/[id]/settings` - Dedicated settings page (currently modal)
- [ ] `/org/[id]/members` - Dedicated members management page
- [ ] `/org/[id]/billing` - Billing/subscription management (if needed)
- [ ] `/notifications` - In-app notifications center
- [ ] `/admin/organizations` - Organization management in admin
- [ ] `/settings/security` - Security settings (2FA, sessions, backup codes)

**UI Improvements:**
- [ ] Better empty states
  - [ ] No organizations yet (with CTA)
  - [ ] No members in organization
  - [ ] No pending invitations
  - [ ] No search results
- [ ] Loading skeletons instead of spinners
- [ ] Toast notifications for all actions
- [ ] Confirmation dialogs for destructive actions
- [ ] Keyboard shortcuts (e.g., `/` for search)
- [ ] Dark mode optimization
- [ ] Mobile responsiveness review

---

### 16. Onboarding Flow
**Priority: LOW**

- [ ] Welcome wizard for new users
- [ ] Step 1: Complete profile (name, avatar)
- [ ] Step 2: Enable 2FA (optional but recommended)
- [ ] Step 3: Create first organization
- [ ] Step 4: Invite team members
- [ ] Skip option for each step
- [ ] Progress indicator
- [ ] Onboarding checklist in dashboard

**Files to create:**
- `apps/web/app/pages/onboarding/index.vue`
- `apps/web/app/pages/onboarding/profile.vue`
- `apps/web/app/pages/onboarding/security.vue`
- `apps/web/app/pages/onboarding/organization.vue`
- `apps/web/app/pages/onboarding/team.vue`

---

## 🏗️ Technical Debt & Infrastructure

### 17. Environment Validation
**Priority: HIGH**

- [ ] Runtime environment variable validation
- [ ] Use Zod to validate all env vars at startup
- [ ] Fail fast with clear error messages
- [ ] Document all environment variables
- [ ] Add `.env.example` with all variables

**Files to create:**
- `packages/config/src/env.ts`
- Update: `.env.example`

---

### 18. Database Migrations
**Priority: MEDIUM**

**Current state:** Using `db:push` (development only)
**Production needs:**
- [ ] Generate migrations: `pnpm db:generate`
- [ ] Version control migrations in git
- [ ] Add migration CI check
- [ ] Document migration workflow
- [ ] Add rollback capability
- [ ] Seed data for development

**Workflow:**
1. Change schema in `packages/db/src/schema/`
2. Run `pnpm db:generate` to create migration
3. Review migration SQL
4. Commit migration to git
5. Run `pnpm db:migrate` in production

---

### 19. Performance Optimization
**Priority: MEDIUM**

- [ ] Add Redis for session caching
- [ ] Implement pagination for all lists
  - [ ] User list (admin)
  - [ ] Organization list
  - [ ] Member list
  - [ ] Audit logs
- [ ] Database indexing review
  - [ ] Add indexes for frequently queried columns
  - [ ] Composite indexes for common queries
- [ ] Image optimization (Cloudinary already configured)
- [ ] Lazy loading for heavy components
- [ ] Route-based code splitting
- [ ] API response caching
- [ ] Database connection pooling optimization

**Indexes to consider:**
```sql
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_org_id ON members(organization_id);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

### 20. Security Enhancements
**Priority: HIGH**

- [ ] Add CSRF protection
- [ ] Implement content security policy (CSP)
- [ ] Add security headers (helmet)
- [ ] Rate limiting per user (in addition to IP)
- [ ] Brute force protection for login
- [ ] SQL injection prevention review
- [ ] XSS prevention review
- [ ] Add security.txt file
- [ ] Implement password complexity requirements
- [ ] Add password breach checking (HaveIBeenPwned API)
- [ ] Session timeout configuration
- [ ] Force password change after X days (optional)

**Packages to add:**
```bash
pnpm add @nuxt/security
pnpm add hibp  # Have I Been Pwned API
```

---

## 🚀 Deployment & DevOps

### 21. CI/CD Enhancements
**Priority: MEDIUM**

**Current state:** Basic CI with tests
**To add:**
- [ ] Automated deployments
  - [ ] Deploy to staging on push to `develop`
  - [ ] Deploy to production on push to `main`
- [ ] Database migration automation
- [ ] Docker image caching
- [ ] Multi-stage Docker builds
- [ ] Health check endpoints
- [ ] Rollback capability
- [ ] Blue-green deployment
- [ ] Canary deployments

---

### 22. Development Experience
**Priority: LOW**

- [ ] Add Storybook for component development
- [ ] Improve dev server hot reload
- [ ] Add pre-commit hooks (husky)
  - [ ] Lint staged files
  - [ ] Run type check
  - [ ] Format code
- [ ] Add commit message linting
- [ ] Improve error messages
- [ ] Add dev tools panel
- [ ] Database seeding for development

---

## 📊 Analytics & Insights

### 23. Application Analytics
**Priority: LOW**

- [ ] Add analytics tracking (privacy-friendly)
- [ ] Page view tracking
- [ ] User journey analysis
- [ ] Feature usage metrics
- [ ] Error tracking and reporting
- [ ] Performance metrics
- [ ] Custom event tracking

**Privacy-friendly options:**
- Plausible Analytics
- Umami
- Self-hosted Matomo

---

## 🔄 Integrations

### 24. Third-Party Integrations
**Priority: LOW**

- [ ] Slack notifications
- [ ] Discord webhooks
- [ ] OAuth providers (Twitter, LinkedIn, Microsoft)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] File storage (S3, Google Drive)
- [ ] Payment processing (Stripe, PayPal) - if needed
- [ ] Email marketing (Mailchimp, SendGrid)
- [ ] CRM integration (Salesforce, HubSpot)

---

## 📝 Documentation & Community

### 25. Additional Documentation
**Priority: LOW**

- [ ] Architecture decision records (ADRs)
- [ ] Contributing guidelines
- [ ] Code of conduct
- [ ] Security policy
- [ ] Changelog generation
- [ ] API versioning strategy
- [ ] Migration guides
- [ ] Troubleshooting guide
- [ ] FAQ section

---

## 🎯 Recommended Implementation Order

### Phase 1: Critical Features (Week 1)
1. ✅ Email sending system
2. Invitation acceptance flow
3. Environment validation
4. Security enhancements (CSRF, headers)

### Phase 2: Core Features (Week 2)
5. Audit logging
6. Admin panel enhancements
7. Complete E2E tests
8. Database migrations setup

### Phase 3: User Experience (Week 3)
9. Better empty states
10. Onboarding flow
11. User activity dashboard
12. 2FA backup codes

### Phase 4: Production Readiness (Week 4)
13. Monitoring & observability (Sentry, logging)
14. Performance optimization
15. Documentation content
16. CI/CD enhancements

### Phase 5: Advanced Features (Future)
17. Organization analytics
18. Webhooks system
19. Advanced search
20. API documentation
21. Third-party integrations

---

## 🏁 Quick Wins

These can be done quickly and provide immediate value:

- [ ] Better empty states (1 hour)
- [ ] Loading skeletons (1 hour)
- [ ] Toast notifications (30 min)
- [ ] Dark mode optimization (1-2 hours)
- [ ] `.env.example` documentation (30 min)
- [ ] Security headers (30 min)
- [ ] Database indexes (1 hour)
- [ ] Error pages (404, 500) (1 hour)

---

**Last Updated:** 2025-01-XX
**Total Items:** 100+
**Completed:** 2 (Email sending system, Invitation acceptance flow)
**In Progress:** None
