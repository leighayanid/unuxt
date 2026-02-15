import { pwnedPassword } from 'hibp'

/**
 * Password breach check result
 */
export interface BreachCheckResult {
  isBreached: boolean
  breachCount: number | null
  error?: string
}

/**
 * Checks if a password has been exposed in known data breaches
 * Uses the Have I Been Pwned (HIBP) API with k-anonymity model
 * (only sends first 5 characters of SHA-1 hash to protect privacy)
 *
 * @param password - The password to check
 * @returns Promise with breach information
 *
 * @example
 * ```typescript
 * const result = await checkPasswordBreach('mypassword123')
 * if (result.isBreached) {
 *   console.log(`Password found in ${result.breachCount} breaches!`)
 * }
 * ```
 */
export async function checkPasswordBreach(
  password: string
): Promise<BreachCheckResult> {
  try {
    // pwnedPassword returns the number of times the password appears in breaches
    // Returns 0 if not found
    const count = await pwnedPassword(password)

    return {
      isBreached: count > 0,
      breachCount: count > 0 ? count : null,
    }
  } catch (error) {
    // Network error or API issue - fail open (allow the password)
    // but log the error for monitoring
    console.error('[SECURITY] Failed to check password breach:', error)

    return {
      isBreached: false,
      breachCount: null,
      error:
        error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Validates a password and checks for breaches
 * Combines complexity validation with breach checking
 *
 * @param password - The password to validate
 * @param checkBreaches - Whether to check for breaches (default: true)
 * @returns Promise with validation result and breach information
 *
 * @example
 * ```typescript
 * const result = await validatePassword('MyP@ssw0rd123')
 * if (!result.isValid) {
 *   console.log('Password does not meet complexity requirements')
 * }
 * if (result.isBreached) {
 *   console.log('Password has been exposed in data breaches')
 * }
 * ```
 */
export async function validatePassword(
  password: string,
  checkBreaches = true
): Promise<BreachCheckResult & { isValid: boolean; errors: string[] }> {
  const errors: string[] = []
  let isValid = true

  // Check complexity requirements
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
    isValid = false
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
    isValid = false
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
    isValid = false
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
    isValid = false
  }

  if (!/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
    errors.push('Password must contain at least one special character')
    isValid = false
  }

  // Check for breaches if enabled
  let breachResult: BreachCheckResult = {
    isBreached: false,
    breachCount: null,
  }

  if (checkBreaches && isValid) {
    breachResult = await checkPasswordBreach(password)
  }

  return {
    isValid,
    errors,
    ...breachResult,
  }
}

/**
 * Rate limiting for password breach checks
 * Prevents abuse of the HIBP API
 */
const breachCheckCache = new Map<string, BreachCheckResult>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

/**
 * Checks password breach with caching to prevent duplicate API calls
 * @param password - The password to check
 * @returns Promise with breach information
 */
export async function checkPasswordBreachCached(
  password: string
): Promise<BreachCheckResult> {
  // Use first 10 characters of password as cache key (for privacy)
  const cacheKey = password.slice(0, 10)

  // Check cache
  const cached = breachCheckCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // Perform check
  const result = await checkPasswordBreach(password)

  // Cache result
  breachCheckCache.set(cacheKey, result)

  // Clear cache after TTL
  setTimeout(() => {
    breachCheckCache.delete(cacheKey)
  }, CACHE_TTL)

  return result
}
