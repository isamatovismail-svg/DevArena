import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const contest = await prisma.contest.findUnique({
      where: { slug: params.slug },
    })

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 })
    }

    const participants = await prisma.contestParticipant.findMany({
      where: { contestId: contest.id },
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
    })

    const ranked = participants.map((p, idx) => ({
      ...p,
      rank: idx + 1,
    }))

    return NextResponse.json({ leaderboard: ranked })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve contest leaderboard' }, { status: 500 })
  }
}
