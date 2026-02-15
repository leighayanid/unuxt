import { checkPasswordBreachCached, validatePassword } from '@unuxt/utils'

/**
 * Server-side password validation with breach checking
 * Use this in registration and password reset endpoints
 *
 * @param password - The password to validate
 * @param checkBreaches - Whether to check for breaches (default: true in production)
 * @returns Validation result with breach information
 *
 * @example
 * ```typescript
 * // In a registration API route
 * export default defineEventHandler(async (event) => {
 *   const { password } = await readBody(event)
 *
 *   const validation = await validatePasswordWithBreachCheck(password)
 *
 *   if (!validation.isValid) {
 *     throw createError({
 *       statusCode: 400,
 *       message: validation.errors.join(', ')
 *     })
 *   }
 *
 *   if (validation.isBreached) {
 *     throw createError({
 *       statusCode: 400,
 *       message: 'This password has been exposed in data breaches. Please choose a different password.'
 *     })
 *   }
 *
 *   // Continue with registration...
 * })
 * ```
 */
export async function validatePasswordWithBreachCheck(
  password: string,
  checkBreaches = process.env.NODE_ENV === 'production'
) {
  // Skip breach checking in development/test for faster iterations
  // But always check in production for security
  return await validatePassword(password, checkBreaches)
}

/**
 * Quick password breach check (with caching)
 * @param password - The password to check
 * @returns Breach check result
 */
export async function checkPasswordForBreaches(password: string) {
  return await checkPasswordBreachCached(password)
}
