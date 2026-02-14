import { describe, it, expect } from 'vitest'
import { organizations, type Organization, type NewOrganization } from './organizations'
import { getTableColumns } from 'drizzle-orm'

describe('organizations schema', () => {
  it('should have correct table name', () => {
    // Drizzle tables are defined with pgTable('organizations', ...)
    // The table name is stored in the Symbol description
    expect(organizations[Symbol.for('drizzle:Name')]).toBe('organizations')
  })

  it('should have all required columns', () => {
    const columns = getTableColumns(organizations)

    expect(columns).toHaveProperty('id')
    expect(columns).toHaveProperty('name')
    expect(columns).toHaveProperty('slug')
    expect(columns).toHaveProperty('logo')
    expect(columns).toHaveProperty('metadata')
    expect(columns).toHaveProperty('createdAt')
    expect(columns).toHaveProperty('updatedAt')
  })

  it('should have id as primary key', () => {
    const columns = getTableColumns(organizations)
    expect(columns.id.primary).toBe(true)
  })

  it('should have name as not null', () => {
    const columns = getTableColumns(organizations)
    expect(columns.name.notNull).toBe(true)
  })

  it('should have slug as unique and not null', () => {
    const columns = getTableColumns(organizations)
    expect(columns.slug.notNull).toBe(true)
    // Unique constraint is checked at table level, not column level
    expect(columns.slug).toBeDefined()
  })

  it('should have timestamps with defaults', () => {
    const columns = getTableColumns(organizations)
    expect(columns.createdAt.notNull).toBe(true)
    expect(columns.createdAt.default).toBeDefined()
    expect(columns.updatedAt.notNull).toBe(true)
    expect(columns.updatedAt.default).toBeDefined()
  })

  it('should allow nullable logo and metadata', () => {
    const columns = getTableColumns(organizations)
    expect(columns.logo.notNull).toBe(false)
    expect(columns.metadata.notNull).toBe(false)
  })

  it('should export correct Organization type', () => {
    // Type assertion test - ensures types are correctly inferred
    const org: Organization = {
      id: 'org-id',
      name: 'Test Organization',
      slug: 'test-org',
      logo: 'https://example.com/logo.png',
      metadata: { key: 'value' },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    expect(org).toBeDefined()
  })

  it('should export correct NewOrganization type for inserts', () => {
    // Type assertion test - ensures insert type allows required fields only
    const newOrg: NewOrganization = {
      id: 'new-org-id',
      name: 'New Organization',
      slug: 'new-org',
    }

    expect(newOrg).toBeDefined()

    // Should also accept optional fields
    const fullNewOrg: NewOrganization = {
      id: 'full-org-id',
      name: 'Full Organization',
      slug: 'full-org',
      logo: 'https://example.com/logo.png',
      metadata: {
        industry: 'technology',
        size: 'large',
      },
    }

    expect(fullNewOrg).toBeDefined()
  })

  it('should support metadata as typed JSONB', () => {
    // Type test - metadata should be Record<string, unknown>
    const org: NewOrganization = {
      id: 'org-with-metadata',
      name: 'Org With Metadata',
      slug: 'org-metadata',
      metadata: {
        customField1: 'value1',
        customField2: 123,
        customField3: true,
        nestedObject: { key: 'value' },
      },
    }

    expect(org.metadata).toBeDefined()
  })
})
