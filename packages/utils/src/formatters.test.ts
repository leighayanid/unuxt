import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  slugify,
  truncate,
  getInitials,
  formatBytes,
} from './formatters'

describe('formatDate', () => {
  it('should format Date objects', () => {
    const date = new Date('2024-03-15T10:30:00Z')
    const result = formatDate(date)
    expect(result).toMatch(/Mar 1[45], 2024/) // Account for timezone differences
  })

  it('should format date strings', () => {
    const result = formatDate('2024-03-15T10:30:00Z')
    expect(result).toMatch(/Mar 1[45], 2024/)
  })

  it('should accept custom format options', () => {
    const date = new Date('2024-03-15T10:30:00Z')
    const result = formatDate(date, { month: 'long', day: '2-digit' })
    expect(result).toMatch(/March/)
  })
})

describe('formatDateTime', () => {
  it('should format Date objects with time', () => {
    const date = new Date('2024-03-15T10:30:00Z')
    const result = formatDateTime(date)
    expect(result).toMatch(/Mar 1[45], 2024/)
    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })

  it('should format date strings with time', () => {
    const result = formatDateTime('2024-03-15T10:30:00Z')
    expect(result).toMatch(/Mar 1[45], 2024/)
    expect(result).toMatch(/\d{1,2}:\d{2}/)
  })

  it('should accept custom format options', () => {
    const date = new Date('2024-03-15T10:30:00Z')
    const result = formatDateTime(date, { hour12: false })
    expect(result).toBeDefined()
  })
})

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return "just now" for very recent dates', () => {
    const now = new Date('2024-03-15T10:30:00Z')
    vi.setSystemTime(now)

    const recent = new Date('2024-03-15T10:29:50Z')
    expect(formatRelativeTime(recent)).toBe('just now')
  })

  it('should format minutes ago', () => {
    const now = new Date('2024-03-15T10:30:00Z')
    vi.setSystemTime(now)

    const fiveMinutesAgo = new Date('2024-03-15T10:25:00Z')
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago')
  })

  it('should format hours ago', () => {
    const now = new Date('2024-03-15T10:30:00Z')
    vi.setSystemTime(now)

    const twoHoursAgo = new Date('2024-03-15T08:30:00Z')
    expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago')
  })

  it('should format days ago', () => {
    const now = new Date('2024-03-15T10:30:00Z')
    vi.setSystemTime(now)

    const threeDaysAgo = new Date('2024-03-12T10:30:00Z')
    expect(formatRelativeTime(threeDaysAgo)).toBe('3d ago')
  })

  it('should format months ago', () => {
    const now = new Date('2024-03-15T10:30:00Z')
    vi.setSystemTime(now)

    const twoMonthsAgo = new Date('2024-01-15T10:30:00Z')
    expect(formatRelativeTime(twoMonthsAgo)).toBe('2mo ago')
  })

  it('should format years ago', () => {
    const now = new Date('2024-03-15T10:30:00Z')
    vi.setSystemTime(now)

    const twoYearsAgo = new Date('2022-03-15T10:30:00Z')
    expect(formatRelativeTime(twoYearsAgo)).toBe('2y ago')
  })

  it('should handle string dates', () => {
    const now = new Date('2024-03-15T10:30:00Z')
    vi.setSystemTime(now)

    expect(formatRelativeTime('2024-03-15T10:25:00Z')).toBe('5m ago')
  })
})

describe('slugify', () => {
  it('should convert text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should replace spaces with hyphens', () => {
    expect(slugify('My Organization Name')).toBe('my-organization-name')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world')
  })

  it('should handle multiple spaces', () => {
    expect(slugify('Hello    World')).toBe('hello-world')
  })

  it('should handle underscores', () => {
    expect(slugify('hello_world_test')).toBe('hello-world-test')
  })

  it('should trim leading and trailing hyphens', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world')
    expect(slugify('-hello-world-')).toBe('hello-world')
  })

  it('should handle empty strings', () => {
    expect(slugify('')).toBe('')
  })

  it('should handle already-valid slugs', () => {
    expect(slugify('already-valid-slug')).toBe('already-valid-slug')
  })
})

describe('truncate', () => {
  it('should truncate text longer than specified length', () => {
    expect(truncate('This is a long text', 10)).toBe('This is a...')
  })

  it('should not truncate text shorter than specified length', () => {
    expect(truncate('Short', 10)).toBe('Short')
  })

  it('should not truncate text equal to specified length', () => {
    expect(truncate('Exactly10!', 10)).toBe('Exactly10!')
  })

  it('should trim whitespace before adding ellipsis', () => {
    expect(truncate('Hello World', 7)).toBe('Hello W...')
  })

  it('should handle empty strings', () => {
    expect(truncate('', 10)).toBe('')
  })
})

describe('getInitials', () => {
  it('should get initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('should get initials from single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('should get initials from three-part name', () => {
    expect(getInitials('John Paul Jones')).toBe('JP')
  })

  it('should handle null', () => {
    expect(getInitials(null)).toBe('?')
  })

  it('should handle undefined', () => {
    expect(getInitials(undefined)).toBe('?')
  })

  it('should handle empty string', () => {
    expect(getInitials('')).toBe('?')
  })

  it('should convert to uppercase', () => {
    expect(getInitials('john doe')).toBe('JD')
  })

  it('should limit to 2 characters', () => {
    expect(getInitials('John Paul Jones Smith')).toBe('JP')
  })
})

describe('formatBytes', () => {
  it('should format 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 Bytes')
  })

  it('should format bytes', () => {
    expect(formatBytes(500)).toBe('500 Bytes')
  })

  it('should format kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(2048)).toBe('2 KB')
  })

  it('should format megabytes', () => {
    expect(formatBytes(1024 * 1024)).toBe('1 MB')
    expect(formatBytes(5 * 1024 * 1024)).toBe('5 MB')
  })

  it('should format gigabytes', () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB')
    expect(formatBytes(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB')
  })

  it('should format terabytes', () => {
    expect(formatBytes(1024 * 1024 * 1024 * 1024)).toBe('1 TB')
  })

  it('should handle custom decimal places', () => {
    expect(formatBytes(1536, 0)).toBe('2 KB')
    expect(formatBytes(1536, 3)).toBe('1.5 KB')
  })

  it('should handle fractional values with default decimals', () => {
    expect(formatBytes(1536)).toBe('1.5 KB')
  })
})
