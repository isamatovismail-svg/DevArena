import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { getCurrentUser } from './session'
import { redirect } from 'next/navigation'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function isDemoCredentialBlocked(
  email: string,
  password: string,
  env: string = process.env.NODE_ENV || 'development'
): boolean {
  if (env !== 'production') return false
  const DEMO_EMAILS = ['admin@devarena.dev', 'alice@example.com', 'bob@example.com', 'carol@example.com']
  const DEMO_PASSWORDS = ['admin123', 'demo123']
  return DEMO_EMAILS.includes(email.toLowerCase()) && DEMO_PASSWORDS.includes(password)
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }
  return user
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      role: true,
      rating: true,
      rank: true,
      createdAt: true,
    },
  })
}
