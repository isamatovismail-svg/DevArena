import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function GET() {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const [userCount, problemCount, submissionCount, contestCount, recentSubmissions, recentUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.problem.count(),
        prisma.submission.count(),
        prisma.contest.count(),
        prisma.submission.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { username: true } },
            problem: { select: { title: true, slug: true } },
          },
        }),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, username: true, email: true, role: true, createdAt: true },
        }),
      ])

    const acceptedCount = await prisma.submission.count({ where: { status: 'ACCEPTED' } })
    const acceptanceRate =
      submissionCount > 0 ? Math.round((acceptedCount / submissionCount) * 100) : 0

    return NextResponse.json({
      stats: {
        userCount,
        problemCount,
        submissionCount,
        contestCount,
        acceptedCount,
        acceptanceRate,
      },
      recentSubmissions,
      recentUsers,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve admin stats' }, { status: 500 })
  }
}
