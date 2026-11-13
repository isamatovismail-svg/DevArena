import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('status') // 'upcoming' | 'active' | 'past' | null

    const now = new Date()
    const where: any = { isPublished: true }

    if (filter === 'upcoming') {
      where.startTime = { gt: now }
    } else if (filter === 'active') {
      where.startTime = { lte: now }
      where.endTime = { gte: now }
    } else if (filter === 'past') {
      where.endTime = { lt: now }
    }

    const contests = await prisma.contest.findMany({
      where,
      include: {
        _count: {
          select: {
            contestParticipants: true,
            contestProblems: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
    })

    const formatted = contests.map((c) => {
      let status: 'UPCOMING' | 'ACTIVE' | 'PAST' = 'UPCOMING'
      if (now >= c.startTime && now <= c.endTime) status = 'ACTIVE'
      else if (now > c.endTime) status = 'PAST'

      return {
        ...c,
        status,
        participantsCount: c._count.contestParticipants,
        problemsCount: c._count.contestProblems,
      }
    })

    return NextResponse.json({ contests: formatted })
  } catch (error) {
    console.error('Contests error:', error)
    return NextResponse.json({ error: 'Failed to retrieve contests' }, { status: 500 })
  }
}
