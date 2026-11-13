import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { parseTags } from '@/lib/utils'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const contest = await prisma.contest.findUnique({
      where: { slug: params.slug },
      include: {
        contestProblems: {
          include: {
            problem: {
              select: {
                id: true,
                slug: true,
                title: true,
                difficulty: true,
                tags: true,
                points: true,
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
        contestParticipants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                rating: true,
              },
            },
          },
          orderBy: [{ score: 'desc' }, { registeredAt: 'asc' }],
          take: 20,
        },
        _count: {
          select: { contestParticipants: true },
        },
      },
    })

    if (!contest || !contest.isPublished) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 })
    }

    const now = new Date()
    let status: 'UPCOMING' | 'ACTIVE' | 'PAST' = 'UPCOMING'
    if (now >= contest.startTime && now <= contest.endTime) status = 'ACTIVE'
    else if (now > contest.endTime) status = 'PAST'

    const sessionUser = await getCurrentUser()
    let isRegistered = false
    let userScore = 0
    let userRank: number | null = null

    if (sessionUser) {
      const participant = await prisma.contestParticipant.findUnique({
        where: {
          contestId_userId: { contestId: contest.id, userId: sessionUser.id },
        },
      })
      if (participant) {
        isRegistered = true
        userScore = participant.score
        const higherCount = await prisma.contestParticipant.count({
          where: { contestId: contest.id, score: { gt: participant.score } },
        })
        userRank = higherCount + 1
      }
    }

    return NextResponse.json({
      contest: {
        ...contest,
        status,
        isRegistered,
        userScore,
        userRank,
        problems: contest.contestProblems.map((cp) => ({
          ...cp.problem,
          orderIndex: cp.orderIndex,
          points: cp.points,
          tags: parseTags(cp.problem.tags),
        })),
        leaderboard: contest.contestParticipants.map((p, idx) => ({
          ...p,
          rank: idx + 1,
        })),
      },
    })
  } catch (error) {
    console.error('Contest detail error:', error)
    return NextResponse.json({ error: 'Failed to retrieve contest details' }, { status: 500 })
  }
}
