export {
  initializeMailer,
  getMailer,
  sendEmail,
  verifyConnection,
  type EmailConfig,
  type SendEmailOptions,
} from './mailer'

export { resetPasswordEmail, type ResetPasswordEmailOptions } from './templates/reset-password'
export { verifyEmailTemplate, type VerifyEmailOptions } from './templates/verify-email'
export { magicLinkEmail, type MagicLinkEmailOptions } from './templates/magic-link'
export {
  organizationInvitationEmail,
  type OrganizationInvitationOptions,
} from './templates/organization-invitation'
