import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

export interface EmailConfig {
  host: string
  port: number
  secure?: boolean
  auth: {
    user: string
    pass: string
  }
  from: {
    name: string
    email: string
  }
}

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text: string
}

let transporter: Transporter | null = null

/**
 * Initialize the email transporter
 * Call this once at app startup with your SMTP configuration
 */
export function initializeMailer(config: EmailConfig) {
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure ?? config.port === 465,
    auth: config.auth,
  })

  return transporter
}

/**
 * Get the current transporter instance
 * Throws if mailer hasn't been initialized
 */
export function getMailer(): Transporter {
  if (!transporter) {
    throw new Error(
      'Email transporter not initialized. Call initializeMailer() first.'
    )
  }
  return transporter
}

/**
 * Send an email using the configured transporter
 */
export async function sendEmail(
  options: SendEmailOptions,
  from?: { name: string; email: string }
): Promise<void> {
  const mailer = getMailer()

  const fromAddress = from
    ? `"${from.name}" <${from.email}>`
    : process.env.FROM_EMAIL || 'noreply@unuxt.com'

  await mailer.sendMail({
    from: fromAddress,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  })
}

/**
 * Verify SMTP connection
 * Useful for testing configuration
 */
export async function verifyConnection(): Promise<boolean> {
  try {
    const mailer = getMailer()
    await mailer.verify()
    return true
  } catch (error) {
    console.error('Email connection verification failed:', error)
    return false
  }
}
