import { describe, it, expect } from 'vitest'
import {
  emailSchema,
  passwordSchema,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  slugSchema,
  createOrganizationSchema,
  updateOrganizationSchema,
  inviteMemberSchema,
  updateUserSchema,
} from './validation'

describe('emailSchema', () => {
  it('should accept valid email addresses', () => {
    expect(emailSchema.parse('user@example.com')).toBe('user@example.com')
    expect(emailSchema.parse('test.user+tag@domain.co.uk')).toBe('test.user+tag@domain.co.uk')
  })

  it('should reject invalid email addresses', () => {
    expect(() => emailSchema.parse('invalid')).toThrow('Invalid email address')
    expect(() => emailSchema.parse('missing@domain')).toThrow()
    expect(() => emailSchema.parse('@example.com')).toThrow()
  })
})

describe('passwordSchema', () => {
  it('should accept valid passwords', () => {
    const validPassword = 'Password123'
    expect(passwordSchema.parse(validPassword)).toBe(validPassword)
  })

  it('should require minimum 8 characters', () => {
    expect(() => passwordSchema.parse('Pass1')).toThrow('Password must be at least 8 characters')
  })

  it('should reject passwords over 100 characters', () => {
    const longPassword = 'A'.repeat(50) + 'a'.repeat(50) + '1'
    expect(() => passwordSchema.parse(longPassword)).toThrow('Password must be less than 100 characters')
  })

  it('should require at least one uppercase letter', () => {
    expect(() => passwordSchema.parse('password123')).toThrow('Password must contain at least one uppercase letter')
  })

  it('should require at least one lowercase letter', () => {
    expect(() => passwordSchema.parse('PASSWORD123')).toThrow('Password must contain at least one lowercase letter')
  })

  it('should require at least one number', () => {
    expect(() => passwordSchema.parse('PasswordABC')).toThrow('Password must contain at least one number')
  })
})

describe('loginSchema', () => {
  it('should accept valid login credentials', () => {
    const input = { email: 'user@example.com', password: 'anypassword' }
    expect(loginSchema.parse(input)).toEqual(input)
  })

  it('should reject invalid email', () => {
    expect(() => loginSchema.parse({ email: 'invalid', password: 'pass' })).toThrow()
  })

  it('should reject empty password', () => {
    expect(() => loginSchema.parse({ email: 'user@example.com', password: '' })).toThrow('Password is required')
  })
})

describe('registerSchema', () => {
  it('should accept valid registration data', () => {
    const input = {
      email: 'user@example.com',
      password: 'Password123',
      name: 'John Doe',
    }
    expect(registerSchema.parse(input)).toEqual(input)
  })

  it('should reject invalid email', () => {
    expect(() =>
      registerSchema.parse({
        email: 'invalid',
        password: 'Password123',
        name: 'John Doe',
      })
    ).toThrow()
  })

  it('should reject weak password', () => {
    expect(() =>
      registerSchema.parse({
        email: 'user@example.com',
        password: 'weak',
        name: 'John Doe',
      })
    ).toThrow()
  })

  it('should reject names less than 2 characters', () => {
    expect(() =>
      registerSchema.parse({
        email: 'user@example.com',
        password: 'Password123',
        name: 'A',
      })
    ).toThrow('Name must be at least 2 characters')
  })

  it('should reject names over 100 characters', () => {
    expect(() =>
      registerSchema.parse({
        email: 'user@example.com',
        password: 'Password123',
        name: 'A'.repeat(101),
      })
    ).toThrow()
  })
})

describe('forgotPasswordSchema', () => {
  it('should accept valid email', () => {
    const input = { email: 'user@example.com' }
    expect(forgotPasswordSchema.parse(input)).toEqual(input)
  })

  it('should reject invalid email', () => {
    expect(() => forgotPasswordSchema.parse({ email: 'invalid' })).toThrow()
  })
})

describe('resetPasswordSchema', () => {
  it('should accept valid token and password', () => {
    const input = { token: 'valid-token', password: 'NewPassword123' }
    expect(resetPasswordSchema.parse(input)).toEqual(input)
  })

  it('should reject empty token', () => {
    expect(() =>
      resetPasswordSchema.parse({ token: '', password: 'NewPassword123' })
    ).toThrow('Token is required')
  })

  it('should reject weak password', () => {
    expect(() =>
      resetPasswordSchema.parse({ token: 'valid-token', password: 'weak' })
    ).toThrow()
  })
})

describe('slugSchema', () => {
  it('should accept valid slugs', () => {
    expect(slugSchema.parse('my-organization')).toBe('my-organization')
    expect(slugSchema.parse('org123')).toBe('org123')
    expect(slugSchema.parse('test-org-2024')).toBe('test-org-2024')
  })

  it('should reject slugs less than 3 characters', () => {
    expect(() => slugSchema.parse('ab')).toThrow('Slug must be at least 3 characters')
  })

  it('should reject slugs over 50 characters', () => {
    expect(() => slugSchema.parse('a'.repeat(51))).toThrow('Slug must be less than 50 characters')
  })

  it('should reject uppercase letters', () => {
    expect(() => slugSchema.parse('MyOrg')).toThrow('Slug can only contain lowercase letters, numbers, and hyphens')
  })

  it('should reject special characters', () => {
    expect(() => slugSchema.parse('my_org')).toThrow('Slug can only contain lowercase letters, numbers, and hyphens')
    expect(() => slugSchema.parse('my.org')).toThrow()
    expect(() => slugSchema.parse('my org')).toThrow()
  })
})

describe('createOrganizationSchema', () => {
  it('should accept valid organization data', () => {
    const input = {
      name: 'My Organization',
      slug: 'my-org',
      logo: 'https://example.com/logo.png',
    }
    expect(createOrganizationSchema.parse(input)).toEqual(input)
  })

  it('should accept organization without logo', () => {
    const input = {
      name: 'My Organization',
      slug: 'my-org',
    }
    expect(createOrganizationSchema.parse(input)).toEqual(input)
  })

  it('should reject invalid name', () => {
    expect(() =>
      createOrganizationSchema.parse({
        name: 'A',
        slug: 'my-org',
      })
    ).toThrow()
  })

  it('should reject invalid slug', () => {
    expect(() =>
      createOrganizationSchema.parse({
        name: 'My Organization',
        slug: 'ab',
      })
    ).toThrow()
  })

  it('should reject invalid logo URL', () => {
    expect(() =>
      createOrganizationSchema.parse({
        name: 'My Organization',
        slug: 'my-org',
        logo: 'not-a-url',
      })
    ).toThrow()
  })
})

describe('updateOrganizationSchema', () => {
  it('should accept partial updates', () => {
    expect(updateOrganizationSchema.parse({ name: 'New Name' })).toEqual({ name: 'New Name' })
    expect(updateOrganizationSchema.parse({ slug: 'new-slug' })).toEqual({ slug: 'new-slug' })
    expect(updateOrganizationSchema.parse({ logo: 'https://example.com/new.png' })).toEqual({
      logo: 'https://example.com/new.png',
    })
  })

  it('should accept null logo to remove it', () => {
    expect(updateOrganizationSchema.parse({ logo: null })).toEqual({ logo: null })
  })

  it('should accept empty object', () => {
    expect(updateOrganizationSchema.parse({})).toEqual({})
  })

  it('should reject invalid name', () => {
    expect(() => updateOrganizationSchema.parse({ name: 'A' })).toThrow()
  })

  it('should reject invalid slug', () => {
    expect(() => updateOrganizationSchema.parse({ slug: 'ab' })).toThrow()
  })
})

describe('inviteMemberSchema', () => {
  it('should accept valid invitation data', () => {
    const input = {
      email: 'user@example.com',
      role: 'admin' as const,
    }
    expect(inviteMemberSchema.parse(input)).toEqual(input)
  })

  it('should accept member role', () => {
    const input = {
      email: 'user@example.com',
      role: 'member' as const,
    }
    expect(inviteMemberSchema.parse(input)).toEqual(input)
  })

  it('should reject invalid email', () => {
    expect(() =>
      inviteMemberSchema.parse({
        email: 'invalid',
        role: 'admin',
      })
    ).toThrow()
  })

  it('should reject invalid role', () => {
    expect(() =>
      inviteMemberSchema.parse({
        email: 'user@example.com',
        role: 'owner',
      })
    ).toThrow()
  })
})

describe('updateUserSchema', () => {
  it('should accept name update', () => {
    expect(updateUserSchema.parse({ name: 'New Name' })).toEqual({ name: 'New Name' })
  })

  it('should accept image update', () => {
    const input = { image: 'https://example.com/avatar.png' }
    expect(updateUserSchema.parse(input)).toEqual(input)
  })

  it('should accept null image to remove it', () => {
    expect(updateUserSchema.parse({ image: null })).toEqual({ image: null })
  })

  it('should accept empty object', () => {
    expect(updateUserSchema.parse({})).toEqual({})
  })

  it('should reject invalid name', () => {
    expect(() => updateUserSchema.parse({ name: 'A' })).toThrow()
  })

  it('should reject invalid image URL', () => {
    expect(() => updateUserSchema.parse({ image: 'not-a-url' })).toThrow()
  })
})
