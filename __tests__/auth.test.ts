import { hashPassword, verifyPassword } from '@/lib/auth'

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
})
