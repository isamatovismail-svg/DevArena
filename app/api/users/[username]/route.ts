import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        rating: true,
        role: true,
        createdAt: true,
        _count: {
          select: { submissions: true },
        },
        userAchievements: {
          include: { achievement: true },
          orderBy: { unlockedAt: 'desc' },
        },
        submissions: {
          select: {
            id: true,
            status: true,
            language: true,
            runtime: true,
            memory: true,
            createdAt: true,
            problem: {
              select: {
                title: true,
                slug: true,
                difficulty: true,
                points: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Solved distinct stats
    const allAccepted = await prisma.submission.findMany({
      where: { userId: user.id, status: 'ACCEPTED' },
      select: {
        problemId: true,
        problem: { select: { difficulty: true } },
      },
    })

    const distinctProblemMap = new Map<string, string>()
    for (const a of allAccepted) {
      distinctProblemMap.set(a.problemId, a.problem.difficulty)
    }

    let easyCount = 0
    let mediumCount = 0
    let hardCount = 0

    Array.from(distinctProblemMap.values()).forEach((diff) => {
      if (diff === 'EASY') easyCount++
      else if (diff === 'MEDIUM') mediumCount++
      else if (diff === 'HARD') hardCount++
    })

    const totalSolved = distinctProblemMap.size
    const totalSubmissions = user._count.submissions
    const acceptanceRate =
      totalSubmissions > 0
        ? Math.round((allAccepted.length / totalSubmissions) * 100)
        : 0

    // Compute rank
    const higherRatingCount = await prisma.user.count({
      where: { rating: { gt: user.rating } },
    })
    const rank = higherRatingCount + 1

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        rating: user.rating,
        rank,
        role: user.role,
        createdAt: user.createdAt,
        totalSubmissions,
        solvedCount: totalSolved,
        easyCount,
        mediumCount,
        hardCount,
        acceptanceRate,
        achievements: user.userAchievements.map((ua) => ({
          ...ua.achievement,
          unlockedAt: ua.unlockedAt,
        })),
        recentSubmissions: user.submissions,
      },
    })
  } catch (error) {
    console.error('User profile error:', error)
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 })
  }
}
