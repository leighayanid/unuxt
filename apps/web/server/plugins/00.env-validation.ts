import { validateEnv, checkEnv, featureFlags } from '@unuxt/config/env'

/**
 * Server plugin to validate environment variables on startup
 * Runs before other plugins (00. prefix ensures it runs first)
 */
export default defineNitroPlugin(() => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔍 Validating environment variables...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Validate environment variables (will exit if validation fails)
  validateEnv()

  console.log('✅ Required environment variables validated successfully')

  // Check optional features
  const features = []
  if (featureFlags.hasGoogleOAuth()) features.push('Google OAuth')
  if (featureFlags.hasGitHubOAuth()) features.push('GitHub OAuth')
  if (featureFlags.hasCloudinary()) features.push('Cloudinary')
  if (featureFlags.hasEmailConfig()) features.push('Email/SMTP')

  if (features.length > 0) {
    console.log(`📦 Optional features enabled: ${features.join(', ')}`)
  } else {
    console.log('ℹ️  No optional features configured')
  }

  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
})
