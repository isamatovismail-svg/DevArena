import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')))

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          rating: true,
          role: true,
          createdAt: true,
          _count: {
            select: { submissions: true },
          },
        },
        orderBy: [{ rating: 'desc' }, { createdAt: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count(),
    ])

    // Query distinct accepted counts
    const userIds = users.map((u) => u.id)
    const acceptedGroups = await prisma.submission.groupBy({
      by: ['userId'],
      where: {
        userId: { in: userIds },
        status: 'ACCEPTED',
      },
      _count: { _all: true },
    })

    const solvedMap: Record<string, number> = {}
    for (const g of acceptedGroups) {
      solvedMap[g.userId] = g._count._all
    }

    const leaderboard = users.map((u, idx) => ({
      ...u,
      rank: (page - 1) * limit + idx + 1,
      solvedCount: solvedMap[u.id] || 0,
    }))

    return NextResponse.json({
      leaderboard,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Failed to retrieve leaderboard' }, { status: 500 })
  }
}
