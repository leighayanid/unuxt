# @unuxt/email

Email sending package for Unuxt with beautiful HTML templates.

## Features

- 📧 SMTP integration via Nodemailer
- 🎨 Beautiful HTML email templates
- 📱 Responsive email design
- 📝 Plain text fallbacks
- 🔒 Secure SMTP configuration
- ⚡ Async/await API

## Installation

This package is part of the Unuxt monorepo and doesn't need separate installation.

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
SMTP_HOST=smtp.example.com       # Your SMTP server
SMTP_PORT=587                     # Usually 587 for TLS
SMTP_USER=your-email@example.com  # SMTP username
SMTP_PASS=your-password           # SMTP password
FROM_EMAIL=noreply@example.com    # From email address
FROM_NAME=Unuxt                   # From name (optional)
```

### Common SMTP Providers

**Gmail**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password  # Not your regular password!
```

**SendGrid**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun**
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-smtp-password
```

**AWS SES**
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

### Initialization

The email service is automatically initialized in `apps/web/server/plugins/email.ts` when the Nuxt app starts.

## Usage

### Using Pre-built Templates

```typescript
import { sendEmail, resetPasswordEmail } from '@unuxt/email'

// Send password reset email
const emailOptions = resetPasswordEmail({
  email: 'user@example.com',
  resetUrl: 'https://app.com/reset?token=abc123',
  expiresInMinutes: 60,
})

await sendEmail(emailOptions)
```

### Available Templates

#### Password Reset
```typescript
import { resetPasswordEmail } from '@unuxt/email'

const email = resetPasswordEmail({
  email: 'user@example.com',
  resetUrl: 'https://app.com/reset?token=abc',
  expiresInMinutes: 60, // Optional, defaults to 60
})
```

#### Email Verification
```typescript
import { verifyEmailTemplate } from '@unuxt/email'

const email = verifyEmailTemplate({
  email: 'user@example.com',
  verifyUrl: 'https://app.com/verify?token=abc',
})
```

#### Magic Link
```typescript
import { magicLinkEmail } from '@unuxt/email'

const email = magicLinkEmail({
  email: 'user@example.com',
  magicUrl: 'https://app.com/magic?token=abc',
  expiresInMinutes: 15, // Optional, defaults to 15
})
```

#### Organization Invitation
```typescript
import { organizationInvitationEmail } from '@unuxt/email'

const email = organizationInvitationEmail({
  email: 'newmember@example.com',
  organizationName: 'Acme Corp',
  invitedBy: 'John Doe',
  inviteUrl: 'https://app.com/invite?token=abc',
  role: 'member',
})
```

### Custom Emails

Use the base template for custom emails:

```typescript
import { sendEmail } from '@unuxt/email'
import { baseTemplate } from '@unuxt/email/templates/base'

const { html, text } = baseTemplate({
  title: 'Welcome to Unuxt',
  preheader: 'Thanks for joining us',
  content: `
    <p>Hi there,</p>
    <p>Welcome to our platform!</p>
  `,
  actionUrl: 'https://app.com/get-started',
  actionText: 'Get Started',
  footer: 'Questions? Reply to this email.',
})

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to Unuxt',
  html,
  text,
})
```

## API Reference

### `initializeMailer(config: EmailConfig)`

Initialize the email transporter. Called automatically on server startup.

```typescript
interface EmailConfig {
  host: string
  port: number
  secure?: boolean  // true for 465, false for other ports
  auth: {
    user: string
    pass: string
  }
  from: {
    name: string
    email: string
  }
}
```

### `sendEmail(options: SendEmailOptions)`

Send an email.

```typescript
interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text: string
}
```

### `verifyConnection()`

Verify SMTP connection. Returns `true` if successful.

```typescript
const isConnected = await verifyConnection()
```

## Template Customization

All templates use the base template which includes:
- Responsive design
- Dark mode support (via email client)
- Consistent branding
- Call-to-action buttons
- Plain text fallbacks

To customize the base template, edit `src/templates/base.ts`.

## Development

### Testing Emails

In development, if SMTP is not configured, emails will be logged to the console with the full URL.

### Using a Test SMTP Service

For development, consider using:
- [Mailtrap](https://mailtrap.io/) - Email testing tool
- [Ethereal](https://ethereal.email/) - Fake SMTP service

Example with Ethereal:
```bash
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-user
SMTP_PASS=your-ethereal-pass
```

## Error Handling

The email service includes automatic fallbacks:
- If SMTP fails in development, URLs are logged to console
- All email functions include try/catch with logging
- Connection verification on startup

## Security

- Never commit SMTP credentials to git
- Use environment variables for all sensitive data
- Use app-specific passwords for Gmail
- Consider using dedicated email services (SendGrid, Mailgun) for production
- Enable 2FA on your email provider account

## Troubleshooting

### Emails not sending

1. Check SMTP configuration in `.env`
2. Verify SMTP credentials
3. Check server logs for errors
4. Test connection: look for "[EMAIL] Email service initialized successfully" in logs
5. For Gmail, ensure you're using an [app-specific password](https://support.google.com/accounts/answer/185833)

### Gmail "Less secure app" error

Gmail no longer supports "less secure apps". You must use an app-specific password:
1. Enable 2FA on your Google account
2. Generate an app-specific password
3. Use that password in `SMTP_PASS`

### Connection timeout

- Check firewall settings
- Verify SMTP port (usually 587 or 465)
- Try different SMTP port if one doesn't work
- Some ISPs block port 25

## License

MIT
