import { describe, it, expect } from 'vitest'
import {
  PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  OAUTH_PROVIDERS,
  ROLE_HIERARCHY,
  SESSION_MAX_AGE,
  SESSION_COOKIE_NAME,
  RATE_LIMITS,
  UPLOAD_LIMITS,
  type Permission,
  type OAuthProvider,
  type OrganizationRole,
} from './constants'

describe('PERMISSIONS', () => {
  it('should have organization permissions', () => {
    expect(PERMISSIONS['organization:read']).toBe('View organization details')
    expect(PERMISSIONS['organization:update']).toBe('Update organization settings')
    expect(PERMISSIONS['organization:delete']).toBe('Delete organization')
  })

  it('should have member permissions', () => {
    expect(PERMISSIONS['member:read']).toBe('View members')
    expect(PERMISSIONS['member:invite']).toBe('Invite new members')
    expect(PERMISSIONS['member:remove']).toBe('Remove members')
    expect(PERMISSIONS['member:updateRole']).toBe('Change member roles')
  })

  it('should have invitation permissions', () => {
    expect(PERMISSIONS['invitation:create']).toBe('Create invitations')
    expect(PERMISSIONS['invitation:revoke']).toBe('Revoke invitations')
  })

  it('should have correct number of permissions', () => {
    const permissionCount = Object.keys(PERMISSIONS).length
    expect(permissionCount).toBe(9)
  })
})

describe('DEFAULT_ROLE_PERMISSIONS', () => {
  it('should grant owner all permissions', () => {
    const ownerPermissions = DEFAULT_ROLE_PERMISSIONS.owner
    const allPermissions = Object.keys(PERMISSIONS) as Permission[]

    expect(ownerPermissions).toHaveLength(allPermissions.length)
    expect(ownerPermissions).toEqual(expect.arrayContaining(allPermissions))
  })

  it('should grant admin appropriate permissions', () => {
    const adminPermissions = DEFAULT_ROLE_PERMISSIONS.admin

    expect(adminPermissions).toContain('organization:read')
    expect(adminPermissions).toContain('organization:update')
    expect(adminPermissions).toContain('member:read')
    expect(adminPermissions).toContain('member:invite')
    expect(adminPermissions).toContain('member:remove')
    expect(adminPermissions).toContain('invitation:create')
    expect(adminPermissions).toContain('invitation:revoke')

    // Admin should NOT have delete permission
    expect(adminPermissions).not.toContain('organization:delete')
  })

  it('should grant member read-only permissions', () => {
    const memberPermissions = DEFAULT_ROLE_PERMISSIONS.member

    expect(memberPermissions).toEqual(['organization:read', 'member:read'])
    expect(memberPermissions).toHaveLength(2)
  })

  it('should have all three roles defined', () => {
    expect(DEFAULT_ROLE_PERMISSIONS).toHaveProperty('owner')
    expect(DEFAULT_ROLE_PERMISSIONS).toHaveProperty('admin')
    expect(DEFAULT_ROLE_PERMISSIONS).toHaveProperty('member')
  })

  it('should have hierarchical permissions (owner > admin > member)', () => {
    const ownerCount = DEFAULT_ROLE_PERMISSIONS.owner.length
    const adminCount = DEFAULT_ROLE_PERMISSIONS.admin.length
    const memberCount = DEFAULT_ROLE_PERMISSIONS.member.length

    expect(ownerCount).toBeGreaterThan(adminCount)
    expect(adminCount).toBeGreaterThan(memberCount)
  })
})

describe('OAUTH_PROVIDERS', () => {
  it('should include google and github', () => {
    expect(OAUTH_PROVIDERS).toContain('google')
    expect(OAUTH_PROVIDERS).toContain('github')
  })

  it('should have exactly 2 providers', () => {
    expect(OAUTH_PROVIDERS).toHaveLength(2)
  })

  it('should be readonly array', () => {
    // Type test - ensure OAuthProvider type works correctly
    const provider: OAuthProvider = 'google'
    expect(OAUTH_PROVIDERS).toContain(provider)
  })
})

describe('ROLE_HIERARCHY', () => {
  it('should have roles in ascending order', () => {
    expect(ROLE_HIERARCHY[0]).toBe('member')
    expect(ROLE_HIERARCHY[1]).toBe('admin')
    expect(ROLE_HIERARCHY[2]).toBe('owner')
  })

  it('should have exactly 3 roles', () => {
    expect(ROLE_HIERARCHY).toHaveLength(3)
  })

  it('should be readonly array', () => {
    // Type test - ensure OrganizationRole type works correctly
    const role: OrganizationRole = 'admin'
    expect(ROLE_HIERARCHY).toContain(role)
  })

  it('should allow role comparison by index', () => {
    const memberIndex = ROLE_HIERARCHY.indexOf('member')
    const adminIndex = ROLE_HIERARCHY.indexOf('admin')
    const ownerIndex = ROLE_HIERARCHY.indexOf('owner')

    expect(ownerIndex).toBeGreaterThan(adminIndex)
    expect(adminIndex).toBeGreaterThan(memberIndex)
  })
})

describe('SESSION settings', () => {
  it('should have correct session max age', () => {
    expect(SESSION_MAX_AGE).toBe(30 * 24 * 60 * 60) // 30 days in seconds
    expect(SESSION_MAX_AGE).toBe(2592000)
  })

  it('should have correct session cookie name', () => {
    expect(SESSION_COOKIE_NAME).toBe('unuxt-session')
  })
})

describe('RATE_LIMITS', () => {
  it('should have auth rate limits', () => {
    expect(RATE_LIMITS.auth).toEqual({ window: 60, max: 10 })
  })

  it('should have api rate limits', () => {
    expect(RATE_LIMITS.api).toEqual({ window: 60, max: 100 })
  })

  it('should have upload rate limits', () => {
    expect(RATE_LIMITS.upload).toEqual({ window: 60, max: 20 })
  })

  it('should have all rate limits use 60 second window', () => {
    expect(RATE_LIMITS.auth.window).toBe(60)
    expect(RATE_LIMITS.api.window).toBe(60)
    expect(RATE_LIMITS.upload.window).toBe(60)
  })

  it('should have sensible max values', () => {
    // Auth should be most restrictive
    expect(RATE_LIMITS.auth.max).toBeLessThan(RATE_LIMITS.upload.max)
    expect(RATE_LIMITS.upload.max).toBeLessThan(RATE_LIMITS.api.max)
  })
})

describe('UPLOAD_LIMITS', () => {
  it('should have avatar upload limits', () => {
    expect(UPLOAD_LIMITS.avatar.maxSize).toBe(5 * 1024 * 1024) // 5MB
    expect(UPLOAD_LIMITS.avatar.allowedTypes).toEqual([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ])
  })

  it('should have general upload limits', () => {
    expect(UPLOAD_LIMITS.general.maxSize).toBe(10 * 1024 * 1024) // 10MB
    expect(UPLOAD_LIMITS.general.allowedTypes).toEqual([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ])
  })

  it('should have larger general limit than avatar', () => {
    expect(UPLOAD_LIMITS.general.maxSize).toBeGreaterThan(UPLOAD_LIMITS.avatar.maxSize)
  })

  it('should support common image formats', () => {
    const commonFormats = ['image/jpeg', 'image/png', 'image/webp']

    commonFormats.forEach(format => {
      expect(UPLOAD_LIMITS.avatar.allowedTypes).toContain(format)
      expect(UPLOAD_LIMITS.general.allowedTypes).toContain(format)
    })
  })
})
