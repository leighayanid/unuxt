import { baseTemplate } from './base'
import type { SendEmailOptions } from '../mailer'

export interface MagicLinkEmailOptions {
  email: string
  magicUrl: string
  expiresInMinutes?: number
}

export function magicLinkEmail(options: MagicLinkEmailOptions): SendEmailOptions {
  const { email, magicUrl, expiresInMinutes = 15 } = options

  const content = `
    <p>Hi there,</p>
    <p>Click the button below to sign in to your Unuxt account (<strong>${email}</strong>):</p>
    <p>No password needed - just click and you're in!</p>
  `

  const { html, text } = baseTemplate({
    title: 'Sign In to Unuxt',
    preheader: 'Your magic link to sign in',
    content,
    actionUrl: magicUrl,
    actionText: 'Sign In',
    footer: `This link will expire in ${expiresInMinutes} minutes. If you didn't request this, you can safely ignore this email.`,
  })

  return {
    to: email,
    subject: 'Sign In to Unuxt - Magic Link',
    html,
    text,
  }
}
