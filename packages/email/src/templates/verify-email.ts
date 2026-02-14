import { baseTemplate } from './base'
import type { SendEmailOptions } from '../mailer'

export interface VerifyEmailOptions {
  email: string
  verifyUrl: string
}

export function verifyEmailTemplate(options: VerifyEmailOptions): SendEmailOptions {
  const { email, verifyUrl } = options

  const content = `
    <p>Welcome to Unuxt!</p>
    <p>Thanks for signing up. We're excited to have you on board!</p>
    <p>To complete your registration, please verify your email address by clicking the button below:</p>
  `

  const { html, text } = baseTemplate({
    title: 'Verify Your Email',
    preheader: 'Complete your Unuxt registration',
    content,
    actionUrl: verifyUrl,
    actionText: 'Verify Email Address',
    footer: 'If you didn\'t create an account with Unuxt, you can safely ignore this email.',
  })

  return {
    to: email,
    subject: 'Verify Your Email - Unuxt',
    html,
    text,
  }
}
