import { test, expect } from '@playwright/test'

test.describe('Health API', () => {
  test('should return ok status from health endpoint', async ({ request }) => {
    const response = await request.get('/api/health')

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toHaveProperty('status', 'ok')
    expect(data).toHaveProperty('timestamp')
  })

  test('should return valid timestamp', async ({ request }) => {
    const response = await request.get('/api/health')
    const data = await response.json()

    // Timestamp should be ISO format
    const timestamp = new Date(data.timestamp)
    expect(timestamp.toString()).not.toBe('Invalid Date')

    // Timestamp should be recent (within last minute)
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    expect(diff).toBeLessThan(60 * 1000) // Less than 60 seconds
  })

  test('should handle multiple concurrent requests', async ({ request }) => {
    const requests = Array.from({ length: 5 }, () => request.get('/api/health'))

    const responses = await Promise.all(requests)

    responses.forEach(response => {
      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)
    })
  })
})
