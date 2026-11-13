import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { hashPassword, verifyPassword } from '@/lib/auth'

const updateProfileSchema = z.object({
  displayName: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),
})

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').max(100),
})

export async function PATCH(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()
    const { action } = body

    if (action === 'profile') {
      const validation = updateProfileSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
      }

      const updated = await prisma.user.update({
        where: { id: sessionUser.id },
        data: {
          displayName: validation.data.displayName?.trim(),
          bio: validation.data.bio?.trim(),
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          bio: true,
        },
      })

      return NextResponse.json({ success: true, user: updated })
    }

    if (action === 'password') {
      const validation = updatePasswordSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
      }

      const user = await prisma.user.findUnique({
        where: { id: sessionUser.id },
      })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const valid = await verifyPassword(validation.data.currentPassword, user.passwordHash)
      if (!valid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }

      const newHash = await hashPassword(validation.data.newPassword)
      await prisma.user.update({
        where: { id: sessionUser.id },
        data: { passwordHash: newHash },
      })

      return NextResponse.json({ success: true, message: 'Password updated successfully' })
    }

    return NextResponse.json({ error: 'Invalid settings update action' }, { status: 400 })
  } catch (error) {
    console.error('Settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
