import { baseTemplate } from './base'
import type { SendEmailOptions } from '../mailer'

export interface ResetPasswordEmailOptions {
  email: string
  resetUrl: string
  expiresInMinutes?: number
}

export function resetPasswordEmail(options: ResetPasswordEmailOptions): SendEmailOptions {
  const { email, resetUrl, expiresInMinutes = 60 } = options

  const content = `
    <p>Hi there,</p>
    <p>We received a request to reset your password for your Unuxt account associated with <strong>${email}</strong>.</p>
    <p>Click the button below to reset your password:</p>
  `

  const { html, text } = baseTemplate({
    title: 'Reset Your Password',
    preheader: 'Reset your Unuxt account password',
    content,
    actionUrl: resetUrl,
    actionText: 'Reset Password',
    footer: `This link will expire in ${expiresInMinutes} minutes. If you didn't request this, you can safely ignore this email.`,
  })

  return {
    to: email,
    subject: 'Reset Your Password - Unuxt',
    html,
    text,
  }
}
