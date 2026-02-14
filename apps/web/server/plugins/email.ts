import { initializeMailer } from '@unuxt/email'

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  // Only initialize if SMTP is configured
  if (config.smtpHost && config.smtpUser && config.smtpPass) {
    try {
      initializeMailer({
        host: config.smtpHost,
        port: Number(config.smtpPort) || 587,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass,
        },
        from: {
          name: config.fromName || 'Unuxt',
          email: config.fromEmail || 'noreply@unuxt.com',
        },
      })

      console.log('[EMAIL] Email service initialized successfully')
    } catch (error) {
      console.error('[EMAIL] Failed to initialize email service:', error)
      console.warn('[EMAIL] Email sending will fall back to console logging')
    }
  } else {
    console.warn('[EMAIL] SMTP not configured - emails will be logged to console')
    console.warn('[EMAIL] Set SMTP_HOST, SMTP_USER, and SMTP_PASS to enable email sending')
  }
})
