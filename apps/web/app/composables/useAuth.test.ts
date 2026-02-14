import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from './useAuth'
import { ref, computed } from 'vue'

// Mock Nuxt app
const mockAuthClient = {
  useSession: vi.fn(),
  signIn: {
    email: vi.fn(),
    social: vi.fn(),
    magicLink: vi.fn(),
  },
  signUp: {
    email: vi.fn(),
  },
  signOut: vi.fn(),
  updateUser: vi.fn(),
  forgetPassword: vi.fn(),
  resetPassword: vi.fn(),
  verifyEmail: vi.fn(),
  sendVerificationEmail: vi.fn(),
}

global.useNuxtApp = vi.fn(() => ({
  $authClient: mockAuthClient,
}))

global.computed = computed
global.navigateTo = vi.fn()

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('computed properties', () => {
    it('should return null user when no session', () => {
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { user } = useAuth()

      expect(user.value).toBeNull()
    })

    it('should return user from session', () => {
      const mockUser = { id: '1', email: 'test@example.com', role: 'user' }
      mockAuthClient.useSession.mockReturnValue(
        ref({ data: { user: mockUser, session: {} } })
      )

      const { user } = useAuth()

      expect(user.value).toEqual(mockUser)
    })

    it('should indicate authenticated when session exists', () => {
      mockAuthClient.useSession.mockReturnValue(
        ref({ data: { session: { id: 'session-1' } } })
      )

      const { isAuthenticated } = useAuth()

      expect(isAuthenticated.value).toBe(true)
    })

    it('should indicate not authenticated when no session', () => {
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { isAuthenticated } = useAuth()

      expect(isAuthenticated.value).toBe(false)
    })

    it('should detect global admin role', () => {
      mockAuthClient.useSession.mockReturnValue(
        ref({ data: { user: { role: 'admin' } } })
      )

      const { isGlobalAdmin } = useAuth()

      expect(isGlobalAdmin.value).toBe(true)
    })

    it('should not detect admin for regular users', () => {
      mockAuthClient.useSession.mockReturnValue(
        ref({ data: { user: { role: 'user' } } })
      )

      const { isGlobalAdmin } = useAuth()

      expect(isGlobalAdmin.value).toBe(false)
    })

    it('should indicate loading state', () => {
      mockAuthClient.useSession.mockReturnValue(ref({ isPending: true }))

      const { isLoading } = useAuth()

      expect(isLoading.value).toBe(true)
    })
  })

  describe('login', () => {
    it('should sign in with email and password', async () => {
      const mockData = { user: { id: '1' }, session: { id: 'session-1' } }
      mockAuthClient.signIn.email.mockResolvedValue({ data: mockData, error: null })
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { login } = useAuth()
      const result = await login('test@example.com', 'password123')

      expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result).toEqual(mockData)
    })

    it('should throw error on failed login', async () => {
      mockAuthClient.signIn.email.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      })
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { login } = useAuth()

      await expect(login('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials')
    })
  })

  describe('social login', () => {
    it('should login with Google', async () => {
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { loginWithGoogle } = useAuth()
      await loginWithGoogle()

      expect(mockAuthClient.signIn.social).toHaveBeenCalledWith({
        provider: 'google',
        callbackURL: '/dashboard',
      })
    })

    it('should login with GitHub', async () => {
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { loginWithGitHub } = useAuth()
      await loginWithGitHub()

      expect(mockAuthClient.signIn.social).toHaveBeenCalledWith({
        provider: 'github',
        callbackURL: '/dashboard',
      })
    })
  })

  describe('magic link', () => {
    it('should send magic link', async () => {
      const mockData = { success: true }
      mockAuthClient.signIn.magicLink.mockResolvedValue({ data: mockData, error: null })
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { loginWithMagicLink } = useAuth()
      const result = await loginWithMagicLink('test@example.com')

      expect(mockAuthClient.signIn.magicLink).toHaveBeenCalledWith({
        email: 'test@example.com',
        callbackURL: '/dashboard',
      })
      expect(result).toEqual(mockData)
    })

    it('should throw error on failed magic link', async () => {
      mockAuthClient.signIn.magicLink.mockResolvedValue({
        data: null,
        error: { message: 'Email sending failed' },
      })
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { loginWithMagicLink } = useAuth()

      await expect(loginWithMagicLink('test@example.com')).rejects.toThrow('Email sending failed')
    })
  })

  describe('register', () => {
    it('should register new user', async () => {
      const mockData = { user: { id: '1' } }
      mockAuthClient.signUp.email.mockResolvedValue({ data: mockData, error: null })
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { register } = useAuth()
      const result = await register('test@example.com', 'Password123', 'Test User')

      expect(mockAuthClient.signUp.email).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      })
      expect(result).toEqual(mockData)
    })

    it('should throw error on failed registration', async () => {
      mockAuthClient.signUp.email.mockResolvedValue({
        data: null,
        error: { message: 'Email already exists' },
      })
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { register } = useAuth()

      await expect(register('test@example.com', 'Password123', 'Test')).rejects.toThrow(
        'Email already exists'
      )
    })
  })

  describe('logout', () => {
    it('should sign out and navigate to home', async () => {
      mockAuthClient.signOut.mockResolvedValue({ data: null, error: null })
      mockAuthClient.useSession.mockReturnValue(ref({ data: { session: {} } }))

      const { logout } = useAuth()
      await logout()

      expect(mockAuthClient.signOut).toHaveBeenCalled()
      expect(global.navigateTo).toHaveBeenCalledWith('/')
    })
  })

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockData = { user: { id: '1', name: 'New Name' } }
      mockAuthClient.updateUser.mockResolvedValue({ data: mockData, error: null })
      mockAuthClient.useSession.mockReturnValue(ref({ data: { user: { id: '1' } } }))

      const { updateProfile } = useAuth()
      const result = await updateProfile({ name: 'New Name' })

      expect(mockAuthClient.updateUser).toHaveBeenCalledWith({ name: 'New Name' })
      expect(result).toEqual(mockData)
    })
  })

  describe('password reset', () => {
    it('should send forgot password email', async () => {
      const mockData = { success: true }
      mockAuthClient.forgetPassword.mockResolvedValue({ data: mockData, error: null })
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { forgotPassword } = useAuth()
      const result = await forgotPassword('test@example.com')

      expect(mockAuthClient.forgetPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        redirectTo: '/auth/reset-password',
      })
      expect(result).toEqual(mockData)
    })

    it('should reset password with token', async () => {
      const mockData = { success: true }
      mockAuthClient.resetPassword.mockResolvedValue({ data: mockData, error: null })
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { resetPassword } = useAuth()
      const result = await resetPassword('token-123', 'NewPassword123')

      expect(mockAuthClient.resetPassword).toHaveBeenCalledWith({
        token: 'token-123',
        newPassword: 'NewPassword123',
      })
      expect(result).toEqual(mockData)
    })
  })

  describe('email verification', () => {
    it('should verify email with token', async () => {
      const mockData = { success: true }
      mockAuthClient.verifyEmail.mockResolvedValue({ data: mockData, error: null })
      mockAuthClient.useSession.mockReturnValue(ref({ data: null }))

      const { verifyEmail } = useAuth()
      const result = await verifyEmail('verify-token')

      expect(mockAuthClient.verifyEmail).toHaveBeenCalledWith({ token: 'verify-token' })
      expect(result).toEqual(mockData)
    })

    it('should resend verification email', async () => {
      const mockData = { success: true }
      mockAuthClient.sendVerificationEmail.mockResolvedValue({ data: mockData, error: null })
      mockAuthClient.useSession.mockReturnValue(
        ref({ data: { user: { email: 'test@example.com' } } })
      )

      const { resendVerificationEmail } = useAuth()
      const result = await resendVerificationEmail()

      expect(mockAuthClient.sendVerificationEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
        callbackURL: '/auth/login',
      })
      expect(result).toEqual(mockData)
    })
  })
})
