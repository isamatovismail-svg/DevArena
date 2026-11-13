import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { parseTags } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const difficulty = searchParams.get('difficulty')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')

    const where: any = { isPublished: true }

    if (difficulty && difficulty !== 'ALL') {
      where.difficulty = difficulty.toUpperCase()
    }
    if (category && category !== 'ALL') {
      where.category = category
    }
    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ]
    }

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          category: true,
          tags: true,
          points: true,
          timeLimit: true,
          memoryLimit: true,
          _count: { select: { submissions: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.problem.count({ where }),
    ])

    // Check user's solve status
    const sessionUser = await getCurrentUser()
    const userStatuses: Record<string, 'SOLVED' | 'ATTEMPTED'> = {}

    if (sessionUser) {
      const userSubmissions = await prisma.submission.findMany({
        where: {
          userId: sessionUser.id,
          problemId: { in: problems.map((p) => p.id) },
        },
        select: { problemId: true, status: true },
      })

      for (const sub of userSubmissions) {
        if (sub.status === 'ACCEPTED') {
          userStatuses[sub.problemId] = 'SOLVED'
        } else if (!userStatuses[sub.problemId]) {
          userStatuses[sub.problemId] = 'ATTEMPTED'
        }
      }
    }

    const problemsFormatted = problems.map((p) => ({
      ...p,
      tags: parseTags(p.tags),
      solvedCount: p._count.submissions,
      userStatus: userStatuses[p.id] || null,
    }))

    const filtered = tag && tag !== 'ALL'
      ? problemsFormatted.filter((p) => p.tags.includes(tag))
      : problemsFormatted

    return NextResponse.json({
      problems: filtered,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching problems:', error)
    return NextResponse.json({ error: 'Failed to retrieve problems' }, { status: 500 })
  }
}
