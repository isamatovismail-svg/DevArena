import { hashPassword, verifyPassword, isDemoCredentialBlocked } from '@/lib/auth'

describe('Authentication & Password Security', () => {
  it('hashes passwords with bcrypt salt and verifies correctly', async () => {
    const rawPass = 'SuperSecret123!'
    const hash = await hashPassword(rawPass)

    expect(hash).not.toBe(rawPass)
    expect(hash.startsWith('$2')).toBe(true)

    const matches = await verifyPassword(rawPass, hash)
    expect(matches).toBe(true)

    const wrongMatches = await verifyPassword('WrongPassword123', hash)
    expect(wrongMatches).toBe(false)
  })

  it('blocks default demo credentials in production environment', () => {
    // In production, demo accounts with default passwords must be blocked
    expect(isDemoCredentialBlocked('admin@devarena.dev', 'admin123', 'production')).toBe(true)
    expect(isDemoCredentialBlocked('alice@example.com', 'demo123', 'production')).toBe(true)
    expect(isDemoCredentialBlocked('bob@example.com', 'demo123', 'production')).toBe(true)
    expect(isDemoCredentialBlocked('carol@example.com', 'demo123', 'production')).toBe(true)

    // Legitimate production user credentials should NOT be blocked
    expect(isDemoCredentialBlocked('realuser@domain.com', 'SecurePass123!', 'production')).toBe(false)
    expect(isDemoCredentialBlocked('admin@devarena.dev', 'NewCustomPass2024!', 'production')).toBe(false)

    // In development or test, demo credentials are permitted
    expect(isDemoCredentialBlocked('admin@devarena.dev', 'admin123', 'development')).toBe(false)
    expect(isDemoCredentialBlocked('alice@example.com', 'demo123', 'development')).toBe(false)
  })
})
