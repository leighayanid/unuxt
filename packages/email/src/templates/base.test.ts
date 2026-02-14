import { describe, it, expect } from 'vitest'
import { baseTemplate } from './base'

describe('baseTemplate', () => {
  it('should generate HTML and text email', () => {
    const result = baseTemplate({
      title: 'Test Email',
      content: '<p>Hello World</p>',
    })

    expect(result).toHaveProperty('html')
    expect(result).toHaveProperty('text')
    expect(typeof result.html).toBe('string')
    expect(typeof result.text).toBe('string')
  })

  it('should include title in both HTML and text', () => {
    const result = baseTemplate({
      title: 'Welcome Email',
      content: '<p>Content here</p>',
    })

    expect(result.html).toContain('Welcome Email')
    expect(result.text).toContain('Welcome Email')
  })

  it('should include action button when provided', () => {
    const result = baseTemplate({
      title: 'Test',
      content: '<p>Test</p>',
      actionUrl: 'https://example.com',
      actionText: 'Click Here',
    })

    expect(result.html).toContain('https://example.com')
    expect(result.html).toContain('Click Here')
    expect(result.text).toContain('https://example.com')
    expect(result.text).toContain('Click Here')
  })

  it('should not include action button when not provided', () => {
    const result = baseTemplate({
      title: 'Test',
      content: '<p>Test</p>',
    })

    expect(result.html).not.toContain('class="button"')
  })

  it('should include custom footer', () => {
    const result = baseTemplate({
      title: 'Test',
      content: '<p>Test</p>',
      footer: 'Custom footer text',
    })

    expect(result.html).toContain('Custom footer text')
    expect(result.text).toContain('Custom footer text')
  })

  it('should include preheader when provided', () => {
    const result = baseTemplate({
      title: 'Test',
      preheader: 'This is a preheader',
      content: '<p>Test</p>',
    })

    expect(result.html).toContain('This is a preheader')
  })

  it('should strip HTML tags from text version', () => {
    const result = baseTemplate({
      title: 'Test',
      content: '<p>Hello <strong>World</strong></p>',
    })

    expect(result.text).toContain('Hello World')
    expect(result.text).not.toContain('<p>')
    expect(result.text).not.toContain('<strong>')
  })

  it('should include current year in footer', () => {
    const result = baseTemplate({
      title: 'Test',
      content: '<p>Test</p>',
    })

    const currentYear = new Date().getFullYear()
    expect(result.html).toContain(currentYear.toString())
    expect(result.text).toContain(currentYear.toString())
  })
})
