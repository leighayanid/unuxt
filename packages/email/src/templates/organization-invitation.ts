import { baseTemplate } from './base'
import type { SendEmailOptions } from '../mailer'

export interface OrganizationInvitationOptions {
  email: string
  organizationName: string
  invitedBy: string
  inviteUrl: string
  role: string
}

export function organizationInvitationEmail(
  options: OrganizationInvitationOptions
): SendEmailOptions {
  const { email, organizationName, invitedBy, inviteUrl, role } = options

  const content = `
    <p>Hi there,</p>
    <p><strong>${invitedBy}</strong> has invited you to join <strong>${organizationName}</strong> on Unuxt.</p>
    <p>You've been invited as a <strong>${role}</strong>.</p>
    <p>Click the button below to accept the invitation and get started:</p>
  `

  const { html, text } = baseTemplate({
    title: `Join ${organizationName}`,
    preheader: `You've been invited to join ${organizationName}`,
    content,
    actionUrl: inviteUrl,
    actionText: 'Accept Invitation',
    footer: 'If you don\'t want to accept this invitation, you can safely ignore this email.',
  })

  return {
    to: email,
    subject: `You're invited to join ${organizationName} - Unuxt`,
    html,
    text,
  }
}
