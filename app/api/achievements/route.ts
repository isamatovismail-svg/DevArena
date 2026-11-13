import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function GET() {
  try {
    const sessionUser = await getCurrentUser()
    const allAchievements = await prisma.achievement.findMany({
      orderBy: { points: 'asc' },
    })

    let unlockedMap: Record<string, Date> = {}
    if (sessionUser) {
      const userAchs = await prisma.userAchievement.findMany({
        where: { userId: sessionUser.id },
      })
      for (const ua of userAchs) {
        unlockedMap[ua.achievementId] = ua.unlockedAt
      }
    }

    const achievements = allAchievements.map((a) => ({
      ...a,
      isUnlocked: Boolean(unlockedMap[a.id]),
      unlockedAt: unlockedMap[a.id] || null,
    }))

    return NextResponse.json({
      achievements,
      totalCount: allAchievements.length,
      unlockedCount: Object.keys(unlockedMap).length,
    })
  } catch (error) {
    console.error('Achievements error:', error)
    return NextResponse.json({ error: 'Failed to retrieve achievements' }, { status: 500 })
  }
}
