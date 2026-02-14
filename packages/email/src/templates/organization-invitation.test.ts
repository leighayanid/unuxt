import { describe, it, expect } from 'vitest'
import { organizationInvitationEmail } from './organization-invitation'

describe('organizationInvitationEmail', () => {
  const mockOptions = {
    email: 'newmember@example.com',
    organizationName: 'Acme Corp',
    invitedBy: 'John Doe',
    inviteUrl: 'https://app.example.com/auth/accept-invite/inv_123',
    role: 'member',
  }

  it('should generate email with correct recipient', () => {
    const result = organizationInvitationEmail(mockOptions)

    expect(result.to).toBe('newmember@example.com')
  })

  it('should include organization name in subject', () => {
    const result = organizationInvitationEmail(mockOptions)

    expect(result.subject).toContain('Acme Corp')
    expect(result.subject).toContain('invited to join')
  })

  it('should include organization name in email body', () => {
    const result = organizationInvitationEmail(mockOptions)

    expect(result.html).toContain('Acme Corp')
    expect(result.text).toContain('Acme Corp')
  })

  it('should include inviter name in email body', () => {
    const result = organizationInvitationEmail(mockOptions)

    expect(result.html).toContain('John Doe')
    expect(result.text).toContain('John Doe')
  })

  it('should include role in email body', () => {
    const result = organizationInvitationEmail(mockOptions)

    expect(result.html).toContain('member')
    expect(result.text).toContain('member')
  })

  it('should include invitation URL in email', () => {
    const result = organizationInvitationEmail(mockOptions)

    expect(result.html).toContain('https://app.example.com/auth/accept-invite/inv_123')
    expect(result.text).toContain('https://app.example.com/auth/accept-invite/inv_123')
  })

  it('should include accept invitation button text', () => {
    const result = organizationInvitationEmail(mockOptions)

    expect(result.html).toContain('Accept Invitation')
    expect(result.text).toContain('Accept Invitation')
  })

  it('should include ignore instruction in footer', () => {
    const result = organizationInvitationEmail(mockOptions)

    expect(result.html).toContain('safely ignore this email')
    expect(result.text).toContain('safely ignore this email')
  })

  it('should handle admin role', () => {
    const result = organizationInvitationEmail({
      ...mockOptions,
      role: 'admin',
    })

    expect(result.html).toContain('admin')
    expect(result.text).toContain('admin')
  })

  it('should handle inviter email when name is not provided', () => {
    const result = organizationInvitationEmail({
      ...mockOptions,
      invitedBy: 'inviter@example.com',
    })

    expect(result.html).toContain('inviter@example.com')
    expect(result.text).toContain('inviter@example.com')
  })

  it('should generate both HTML and text versions', () => {
    const result = organizationInvitationEmail(mockOptions)

    expect(result.html).toBeTruthy()
    expect(result.text).toBeTruthy()
    expect(typeof result.html).toBe('string')
    expect(typeof result.text).toBe('string')
  })

  it('should have preheader in HTML version', () => {
    const result = organizationInvitationEmail(mockOptions)

    expect(result.html).toContain("You've been invited to join Acme Corp")
  })
})
