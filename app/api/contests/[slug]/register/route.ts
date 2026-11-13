import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Please sign in to register for contests' }, { status: 401 })
    }

    const contest = await prisma.contest.findUnique({
      where: { slug: params.slug },
    })

    if (!contest) {
      return NextResponse.json({ error: 'Contest not found' }, { status: 404 })
    }

    const now = new Date()
    if (now > contest.endTime) {
      return NextResponse.json({ error: 'Cannot register for a completed contest' }, { status: 400 })
    }

    await prisma.contestParticipant.upsert({
      where: {
        contestId_userId: { contestId: contest.id, userId: sessionUser.id },
      },
      update: {},
      create: {
        contestId: contest.id,
        userId: sessionUser.id,
      },
    })

    // Award contest-participant achievement
    const ach = await prisma.achievement.findUnique({ where: { slug: 'contest-participant' } })
    if (ach) {
      await prisma.userAchievement.upsert({
        where: { userId_achievementId: { userId: sessionUser.id, achievementId: ach.id } },
        update: {},
        create: { userId: sessionUser.id, achievementId: ach.id },
      })
    }

    return NextResponse.json({ success: true, message: 'Successfully registered for contest' })
  } catch (error) {
    console.error('Contest registration error:', error)
    return NextResponse.json({ error: 'Failed to register for contest' }, { status: 500 })
  }
}
