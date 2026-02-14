/**
 * Base email template with consistent styling
 */
export interface BaseTemplateOptions {
  title: string
  preheader?: string
  content: string
  actionUrl?: string
  actionText?: string
  footer?: string
}

export function baseTemplate(options: BaseTemplateOptions): { html: string; text: string } {
  const {
    title,
    preheader = '',
    content,
    actionUrl,
    actionText,
    footer = 'This is an automated email. Please do not reply.',
  } = options

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 40px;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      margin: 0;
      font-size: 28px;
      color: #18181b;
    }
    h1 {
      margin: 0 0 20px;
      font-size: 24px;
      color: #18181b;
    }
    p {
      margin: 0 0 16px;
      color: #52525b;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #18181b;
      color: white !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e4e4e7;
      color: #71717a;
      font-size: 14px;
    }
    .divider {
      height: 1px;
      background-color: #e4e4e7;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}
  <div class="container">
    <div class="card">
      <div class="logo">
        <h1>Unuxt</h1>
      </div>
      <h1>${title}</h1>
      ${content}
      ${actionUrl && actionText ? `
        <div style="text-align: center;">
          <a href="${actionUrl}" class="button">${actionText}</a>
        </div>
      ` : ''}
      <div class="divider"></div>
      <div class="footer">
        <p>${footer}</p>
        <p>&copy; ${new Date().getFullYear()} Unuxt. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`

  // Generate plain text version
  const text = `
${title}

${content.replace(/<[^>]*>/g, '')}

${actionUrl && actionText ? `${actionText}: ${actionUrl}` : ''}

---
${footer}
© ${new Date().getFullYear()} Unuxt. All rights reserved.
`

  return { html, text: text.trim() }
}
