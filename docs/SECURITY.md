# Security Features

This document outlines the security features implemented in Unuxt.

## Environment Validation

All environment variables are validated at server startup using Zod schemas. The application will fail fast with clear error messages if required variables are missing or invalid.

**Location:** `packages/config/src/env.ts`

### Features

- ✅ Type-safe environment variables with TypeScript inference
- ✅ Automatic validation on server startup
- ✅ Clear, formatted error messages for missing/invalid variables
- ✅ Feature flags to check if optional features are configured
- ✅ Comprehensive test coverage

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string (validated format)
- `BETTER_AUTH_SECRET` - Must be at least 32 characters
- `BETTER_AUTH_URL` - Valid URL for the application

### Feature Flags

```typescript
import { featureFlags } from '@unuxt/config/env'

// Check if optional features are configured
if (featureFlags.hasGoogleOAuth()) {
  // Google OAuth is configured
}

if (featureFlags.hasEmailConfig()) {
  // SMTP is configured, send emails
}

if (featureFlags.isProduction()) {
  // Running in production mode
}
```

## Security Headers

The application uses the `nuxt-security` module to apply comprehensive security headers.

**Configuration:** `apps/web/nuxt.config.ts`

### Enabled Features

#### Content Security Policy (CSP)
- Prevents XSS attacks with strict script/style policies
- Allows Cloudinary images for user avatars and org logos
- Nonce-based script execution
- `upgrade-insecure-requests` enabled

#### CSRF Protection
- Enabled for POST, PUT, PATCH, DELETE requests
- Excludes `/api/auth/**` (Better Auth has its own CSRF protection)
- Automatic token validation

#### Rate Limiting
- **Global:** 150 requests per minute per IP
- **Auth endpoints:** 5 failed attempts = 15 minute cooldown (Better Auth)
- Configurable in `nuxt.config.ts`

#### Security Headers Applied
- `Strict-Transport-Security` - HSTS with 180-day max-age
- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS filter
- `Referrer-Policy: no-referrer` - No referrer information
- `Permissions-Policy` - Restricts camera, geolocation, microphone
- `Cross-Origin-*` headers - Prevents cross-origin attacks

#### CORS
- Same-origin policy by default
- Configurable via `nuxt.config.ts`

## Password Security

Enhanced password validation with complexity requirements and breach checking.

**Location:** `packages/utils/src/validation.ts`, `packages/utils/src/security.ts`

### Password Requirements

All passwords must meet these requirements:

- ✅ Minimum 8 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ✅ At least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)

### Password Strength Checker

```typescript
import { checkPasswordStrength } from '@unuxt/utils'

const result = checkPasswordStrength('MyP@ssw0rd123')
// {
//   strength: 'strong',  // 'weak' | 'fair' | 'good' | 'strong'
//   score: 5,            // 0-4
//   feedback: [],        // Array of improvement suggestions
//   isValid: true        // Meets all requirements
// }
```

### Have I Been Pwned Integration

Passwords are checked against the Have I Been Pwned (HIBP) database to prevent the use of compromised passwords.

**Features:**
- ✅ k-anonymity model (only sends first 5 characters of SHA-1 hash)
- ✅ Automatic caching (1 hour TTL) to prevent duplicate API calls
- ✅ Graceful fallback on API errors
- ✅ Enabled in production, optional in development

**Usage:**

```typescript
import { checkPasswordBreach, validatePassword } from '@unuxt/utils'

// Check for breaches only
const breachResult = await checkPasswordBreach('password123')
if (breachResult.isBreached) {
  console.log(`Found in ${breachResult.breachCount} breaches!`)
}

// Full validation with breach check
const validation = await validatePassword('MyP@ssw0rd123', true)
if (!validation.isValid) {
  console.error(validation.errors)
}
if (validation.isBreached) {
  console.error('Password has been compromised!')
}
```

**Server-side helper:**

```typescript
// In API routes
import { validatePasswordWithBreachCheck } from '~/server/utils/password-validation'

export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)

  const validation = await validatePasswordWithBreachCheck(password)

  if (!validation.isValid) {
    throw createError({
      statusCode: 400,
      message: validation.errors.join(', ')
    })
  }

  if (validation.isBreached) {
    throw createError({
      statusCode: 400,
      message: 'This password has been exposed in data breaches'
    })
  }

  // Continue with registration/password reset...
})
```

## Security Best Practices

### Input Validation
- ✅ All user input validated on server-side
- ✅ Zod schemas for type-safe validation
- ✅ SQL injection prevention via Drizzle ORM parameterized queries
- ✅ XSS prevention via CSP headers and Vue's automatic escaping

### Authentication
- ✅ Better Auth with secure session management
- ✅ CSRF protection on auth endpoints
- ✅ Rate limiting on login attempts
- ✅ 2FA support with TOTP
- ✅ Magic link authentication
- ✅ Secure password reset flow

### Authorization
- ✅ Role-based access control (RBAC)
- ✅ Organization-based permissions
- ✅ Middleware for route protection
- ✅ API route authentication checks

### Data Protection
- ✅ HTTPS enforced in production
- ✅ Secure session cookies (httpOnly, secure, sameSite)
- ✅ Environment variables never exposed to client
- ✅ Database credentials stored securely

### Monitoring
- ✅ Environment validation on startup
- ✅ Clear error messages for security issues
- ✅ Feature flags for optional security features

## Updating Security Configuration

### Adjusting CSP

If you need to add third-party scripts or styles, update the CSP in `apps/web/nuxt.config.ts`:

```typescript
security: {
  headers: {
    contentSecurityPolicy: {
      'script-src': [
        "'self'",
        'https://trusted-cdn.com',  // Add trusted sources
        // ...
      ],
    },
  },
}
```

### Changing Rate Limits

Update rate limiting in `apps/web/nuxt.config.ts`:

```typescript
security: {
  rateLimiter: {
    tokensPerInterval: 200,  // Increase to 200 requests
    interval: 60000,         // per minute
  },
}
```

### Disabling Features

To disable specific security features (not recommended for production):

```typescript
security: {
  csrf: {
    enabled: false,  // Disable CSRF (NOT RECOMMENDED)
  },
}
```

## Security Checklist

Before deploying to production, ensure:

- [ ] `BETTER_AUTH_SECRET` is at least 32 characters and unique
- [ ] `DATABASE_URL` uses SSL connection (`?sslmode=require`)
- [ ] All required environment variables are set
- [ ] SMTP is configured for email notifications
- [ ] HTTPS is enforced (Let's Encrypt, Cloudflare, etc.)
- [ ] Database backups are configured
- [ ] Rate limiting is appropriate for your use case
- [ ] Security headers are enabled (default)
- [ ] Password breach checking is enabled (default in production)
- [ ] CSP is configured correctly for your third-party integrations

## Reporting Security Issues

If you discover a security vulnerability, please email security@yourapp.com (replace with your security contact).

Do NOT create a public GitHub issue for security vulnerabilities.

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Nuxt Security Module](https://nuxt-security.vercel.app/)
- [Have I Been Pwned](https://haveibeenpwned.com/)
- [Better Auth Documentation](https://better-auth.com/)
- [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
