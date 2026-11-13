import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { parseTags } from '@/lib/utils'

export async function GET() {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userId = sessionUser.id

    const [user, submissions, achievements, contestCount, upcomingContests, recommendedProblems] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            username: true,
            displayName: true,
            rating: true,
            role: true,
            createdAt: true,
          },
        }),
        prisma.submission.findMany({
          where: { userId },
          include: {
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
        }),
        prisma.userAchievement.findMany({
          where: { userId },
          include: { achievement: true },
          orderBy: { unlockedAt: 'desc' },
          take: 5,
        }),
        prisma.contestParticipant.count({ where: { userId } }),
        prisma.contest.findMany({
          where: { startTime: { gt: new Date() }, isPublished: true },
          orderBy: { startTime: 'asc' },
          take: 3,
          include: {
            _count: { select: { contestParticipants: true, contestProblems: true } },
          },
        }),
        prisma.problem.findMany({
          where: { isPublished: true },
          select: {
            id: true,
            slug: true,
            title: true,
            difficulty: true,
            category: true,
            tags: true,
            points: true,
          },
          take: 5,
          orderBy: { points: 'asc' },
        }),
      ])

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Solved problems calculation
    const acceptedSubs = submissions.filter((s) => s.status === 'ACCEPTED')
    const distinctSolvedMap = new Map<string, string>()
    for (const sub of acceptedSubs) {
      distinctSolvedMap.set(sub.problemId, sub.problem.difficulty)
    }

    let easyCount = 0
    let mediumCount = 0
    let hardCount = 0
    Array.from(distinctSolvedMap.values()).forEach((diff) => {
      if (diff === 'EASY') easyCount++
      else if (diff === 'MEDIUM') mediumCount++
      else if (diff === 'HARD') hardCount++
    })

    const totalSolved = distinctSolvedMap.size
    const totalSubmissions = submissions.length
    const acceptanceRate =
      totalSubmissions > 0
        ? Math.round((acceptedSubs.length / totalSubmissions) * 100)
        : 0

    // Rating rank calculation
    const higherRatingCount = await prisma.user.count({
      where: { rating: { gt: user.rating } },
    })
    const rank = higherRatingCount + 1

    // Build 30-day activity trend
    const activityMap: Record<string, { submissions: number; accepted: number }> = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      activityMap[key] = { submissions: 0, accepted: 0 }
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    for (const s of submissions) {
      const sDate = new Date(s.createdAt)
      if (sDate >= thirtyDaysAgo) {
        const key = sDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        if (activityMap[key]) {
          activityMap[key].submissions++
          if (s.status === 'ACCEPTED') {
            activityMap[key].accepted++
          }
        }
      }
    }

    const activityData = Object.entries(activityMap).map(([date, counts]) => ({
      date,
      ...counts,
    }))

    return NextResponse.json({
      user: {
        ...user,
        rank,
      },
      stats: {
        totalSolved,
        totalSubmissions,
        acceptanceRate,
        rating: user.rating,
        rank,
        contestCount,
        easyCount,
        mediumCount,
        hardCount,
      },
      activityData,
      recentSubmissions: submissions.slice(0, 8),
      recentAchievements: achievements.map((a) => ({
        ...a.achievement,
        unlockedAt: a.unlockedAt,
      })),
      upcomingContests: upcomingContests.map((c) => ({
        ...c,
        participantsCount: c._count.contestParticipants,
        problemsCount: c._count.contestProblems,
      })),
      recommendedProblems: recommendedProblems.map((p) => ({
        ...p,
        tags: parseTags(p.tags),
        isSolved: distinctSolvedMap.has(p.id),
      })),
    })
  } catch (error) {
    console.error('Dashboard data error:', error)
    return NextResponse.json({ error: 'Failed to retrieve dashboard data' }, { status: 500 })
  }
}
