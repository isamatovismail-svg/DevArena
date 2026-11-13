import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  userId?: string
  username?: string
  role?: string
}

declare module 'iron-session' {
  interface IronSessionData {
    userId?: string
    username?: string
    role?: string
  }
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || 'devarena-dev-secret-key-change-in-production-32chars',
  cookieName: 'devarena_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  return session
}

export async function getCurrentUser() {
  try {
    const session = await getSession()
    if (!session.userId) return null
    return {
      id: session.userId,
      username: session.username!,
      role: session.role || 'USER',
    }
  } catch (err) {
    return null
  }
}
