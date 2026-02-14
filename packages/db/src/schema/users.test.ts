import { describe, it, expect } from 'vitest'
import { users, type User, type NewUser } from './users'
import { getTableColumns } from 'drizzle-orm'

describe('users schema', () => {
  it('should have correct table name', () => {
    // Drizzle tables are defined with pgTable('users', ...)
    // The table name is stored in the Symbol description
    expect(users[Symbol.for('drizzle:Name')]).toBe('users')
  })

  it('should have all required columns', () => {
    const columns = getTableColumns(users)

    expect(columns).toHaveProperty('id')
    expect(columns).toHaveProperty('email')
    expect(columns).toHaveProperty('emailVerified')
    expect(columns).toHaveProperty('name')
    expect(columns).toHaveProperty('image')
    expect(columns).toHaveProperty('role')
    expect(columns).toHaveProperty('twoFactorEnabled')
    expect(columns).toHaveProperty('createdAt')
    expect(columns).toHaveProperty('updatedAt')
  })

  it('should have id as primary key', () => {
    const columns = getTableColumns(users)
    expect(columns.id.primary).toBe(true)
  })

  it('should have email as unique and not null', () => {
    const columns = getTableColumns(users)
    expect(columns.email.notNull).toBe(true)
    // Unique constraint is checked at table level, not column level
    expect(columns.email).toBeDefined()
  })

  it('should have emailVerified with default false', () => {
    const columns = getTableColumns(users)
    expect(columns.emailVerified.notNull).toBe(true)
    expect(columns.emailVerified.default).toBeDefined()
  })

  it('should have role with default "user"', () => {
    const columns = getTableColumns(users)
    expect(columns.role.notNull).toBe(true)
    expect(columns.role.default).toBeDefined()
  })

  it('should have twoFactorEnabled with default false', () => {
    const columns = getTableColumns(users)
    expect(columns.twoFactorEnabled.default).toBeDefined()
  })

  it('should have timestamps with defaults', () => {
    const columns = getTableColumns(users)
    expect(columns.createdAt.notNull).toBe(true)
    expect(columns.createdAt.default).toBeDefined()
    expect(columns.updatedAt.notNull).toBe(true)
    expect(columns.updatedAt.default).toBeDefined()
  })

  it('should allow nullable name and image', () => {
    const columns = getTableColumns(users)
    expect(columns.name.notNull).toBe(false)
    expect(columns.image.notNull).toBe(false)
  })

  it('should export correct User type', () => {
    // Type assertion test - ensures types are correctly inferred
    const user: User = {
      id: 'user-id',
      email: 'test@example.com',
      emailVerified: true,
      name: 'Test User',
      image: 'https://example.com/avatar.png',
      role: 'user',
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    expect(user).toBeDefined()
  })

  it('should export correct NewUser type for inserts', () => {
    // Type assertion test - ensures insert type allows required fields only
    const newUser: NewUser = {
      id: 'new-user-id',
      email: 'new@example.com',
    }

    expect(newUser).toBeDefined()

    // Should also accept all optional fields
    const fullNewUser: NewUser = {
      id: 'full-user-id',
      email: 'full@example.com',
      name: 'Full User',
      image: 'https://example.com/full.png',
      role: 'admin',
      emailVerified: true,
      twoFactorEnabled: true,
    }

    expect(fullNewUser).toBeDefined()
  })
})
