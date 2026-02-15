import { z } from 'zod'

/**
 * Environment validation schemas using Zod
 * Validates all required and optional environment variables at runtime
 */

// Database configuration (REQUIRED)
const databaseSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .startsWith('postgresql://', {
      message: 'DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql://',
    })
    .describe('PostgreSQL database connection string'),
})

// Better Auth configuration (REQUIRED)
const authSchema = z.object({
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, {
      message: 'BETTER_AUTH_SECRET must be at least 32 characters for secure encryption',
    })
    .describe('Secret key for Better Auth encryption (min 32 characters)'),
  BETTER_AUTH_URL: z
    .string()
    .url()
    .describe('Application URL for Better Auth callbacks'),
})

// OAuth - Google (OPTIONAL)
const googleOAuthSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
})

// OAuth - GitHub (OPTIONAL)
const githubOAuthSchema = z.object({
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
})

// Cloudinary configuration (OPTIONAL)
const cloudinarySchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
})

// Email/SMTP configuration (OPTIONAL but recommended)
const emailSchema = z.object({
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (val > 0 && val <= 65535), {
      message: 'SMTP_PORT must be a valid port number (1-65535)',
    }),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  FROM_NAME: z.string().optional(),
})

// App settings
const appSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('Node environment'),
})

// Combined schema for all environment variables
const envSchema = databaseSchema
  .merge(authSchema)
  .merge(googleOAuthSchema)
  .merge(githubOAuthSchema)
  .merge(cloudinarySchema)
  .merge(emailSchema)
  .merge(appSchema)

// Type inference
export type Env = z.infer<typeof envSchema>

/**
 * Validates environment variables and returns typed environment object
 * Throws detailed error if validation fails
 *
 * @throws {z.ZodError} If environment variables are invalid
 * @returns {Env} Validated and typed environment variables
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { fieldErrors } = error.flatten()

      // Build detailed error message
      const errorMessages = Object.entries(fieldErrors)
        .map(([field, errors]) => {
          return `  ❌ ${field}: ${errors?.join(', ') || 'Invalid value'}`
        })
        .join('\n')

      const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  ENVIRONMENT VALIDATION FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${errorMessages}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Please check your .env file and ensure all required
   environment variables are set correctly.

📖 See .env.example for reference configuration.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
      console.error(errorMessage)
      process.exit(1)
    }
    throw error
  }
}

/**
 * Validates environment variables and returns success/failure status
 * Useful for health checks and diagnostics
 *
 * @returns {{ success: boolean; errors?: string[] }} Validation result
 */
export function checkEnv(): { success: boolean; errors?: string[] } {
  const result = envSchema.safeParse(process.env)

  if (result.success) {
    return { success: true }
  }

  const { fieldErrors } = result.error.flatten()
  const errors = Object.entries(fieldErrors).map(
    ([field, errors]) => `${field}: ${errors?.join(', ') || 'Invalid value'}`
  )

  return { success: false, errors }
}

/**
 * Checks if specific optional features are configured
 */
export const featureFlags = {
  /**
   * Check if Google OAuth is configured
   */
  hasGoogleOAuth(): boolean {
    return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  },

  /**
   * Check if GitHub OAuth is configured
   */
  hasGitHubOAuth(): boolean {
    return !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
  },

  /**
   * Check if Cloudinary is configured
   */
  hasCloudinary(): boolean {
    return !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )
  },

  /**
   * Check if SMTP email is configured
   */
  hasEmailConfig(): boolean {
    return !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.FROM_EMAIL
    )
  },

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  },

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development'
  },

  /**
   * Check if running in test
   */
  isTest(): boolean {
    return process.env.NODE_ENV === 'test'
  },
}

// Export schemas for advanced usage
export { envSchema, databaseSchema, authSchema, emailSchema }
