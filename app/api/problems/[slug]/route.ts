import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { parseTags, parseExamples } from '@/lib/utils'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const problem = await prisma.problem.findUnique({
      where: { slug: params.slug },
      include: {
        testCases: {
          where: { isSample: true },
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: { submissions: true },
        },
      },
    })

    if (!problem || !problem.isPublished) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    }

    const sessionUser = await getCurrentUser()
    let userStatus: 'SOLVED' | 'ATTEMPTED' | null = null

    if (sessionUser) {
      const userSub = await prisma.submission.findFirst({
        where: { userId: sessionUser.id, problemId: problem.id },
        orderBy: { createdAt: 'desc' },
      })
      if (userSub) {
        userStatus = userSub.status === 'ACCEPTED' ? 'SOLVED' : 'ATTEMPTED'
      }
    }

    return NextResponse.json({
      problem: {
        ...problem,
        tags: parseTags(problem.tags),
        examples: parseExamples(problem.examples),
        userStatus,
        solvedCount: problem._count.submissions,
      },
    })
  } catch (error) {
    console.error('Error fetching problem details:', error)
    return NextResponse.json({ error: 'Failed to retrieve problem details' }, { status: 500 })
  }
}
