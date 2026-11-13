import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { judgeSubmission, isJudge0Configured } from '@/services/judgeService'
import type { Language } from '@/types'

export const dynamic = 'force-dynamic'

const submissionSchema = z.object({
  problemId: z.string(),
  code: z.string().min(1, 'Code cannot be empty').max(100000, 'Code too large'),
  language: z.enum(['javascript', 'python', 'java', 'cpp']),
  contestId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Please sign in to submit code' }, { status: 401 })
    }

    const body = await req.json()
    const validation = submissionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { problemId, code, language, contestId } = validation.data

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        testCases: { orderBy: { orderIndex: 'asc' } },
      },
    })

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 })
    }

    // Verify contest timing if this is a contest submission
    if (contestId) {
      const contest = await prisma.contest.findUnique({ where: { id: contestId } })
      if (!contest) {
        return NextResponse.json({ error: 'Contest not found' }, { status: 404 })
      }
      const now = new Date()
      if (now < contest.startTime) {
        return NextResponse.json({ error: 'Contest has not started yet' }, { status: 400 })
      }
      if (now > contest.endTime) {
        return NextResponse.json({ error: 'Contest has ended' }, { status: 400 })
      }
    }

    // Create initial submission record
    const submission = await prisma.submission.create({
      data: {
        userId: sessionUser.id,
        problemId,
        contestId,
        code,
        language,
        status: 'RUNNING',
      },
    })

    // Execute through JudgeService
    const judgeResult = await judgeSubmission(
      code,
      language as Language,
      problem.testCases.map((tc) => ({
        id: tc.id,
        input: tc.input,
        expected: tc.expected,
        isSample: tc.isSample,
      })),
      problem.timeLimit,
      problem.memoryLimit
    )

    // Update submission record with execution results
    const updatedSubmission = await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: judgeResult.status,
        runtime: judgeResult.runtime,
        memory: judgeResult.memory,
        output: judgeResult.output,
        errorMessage: judgeResult.errorMessage,
        testResults: judgeResult.testResults ? JSON.stringify(judgeResult.testResults) : null,
      },
    })

    // If accepted in contest, update user score
    if (contestId && judgeResult.status === 'ACCEPTED') {
      const contestProblem = await prisma.contestProblem.findUnique({
        where: { contestId_problemId: { contestId, problemId } },
      })

      if (contestProblem) {
        await prisma.contestParticipant.upsert({
          where: { contestId_userId: { contestId, userId: sessionUser.id } },
          update: { score: { increment: contestProblem.points } },
          create: {
            contestId,
            userId: sessionUser.id,
            score: contestProblem.points,
          },
        })
      }
    }

    // Check & trigger achievements
    if (judgeResult.status === 'ACCEPTED') {
      await checkAndUnlockAchievements(sessionUser.id, problem.difficulty)
    }

    return NextResponse.json({
      submission: {
        ...updatedSubmission,
        testResults: judgeResult.testResults,
        isDemo: judgeResult.isDemo,
      },
    })
  } catch (error: any) {
    console.error('Error during submission execution:', error)
    return NextResponse.json({ error: 'Failed to process code submission' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const problemId = searchParams.get('problemId')

    const where: any = { userId: sessionUser.id }
    if (problemId) where.problemId = problemId

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        include: {
          problem: {
            select: { title: true, slug: true, difficulty: true, points: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.submission.count({ where }),
    ])

    return NextResponse.json({
      submissions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve submissions' }, { status: 500 })
  }
}

async function checkAndUnlockAchievements(userId: string, difficulty: string) {
  try {
    const acceptedCount = await prisma.submission.count({
      where: { userId, status: 'ACCEPTED' },
    })

    const toUnlock: string[] = []

    if (acceptedCount >= 1) toUnlock.push('first-solve')
    if (acceptedCount >= 10) toUnlock.push('ten-solves')
    if (acceptedCount >= 50) toUnlock.push('fifty-solves')
    if (acceptedCount >= 100) toUnlock.push('hundred-solves')
    if (difficulty === 'HARD') toUnlock.push('hard-solver')

    for (const slug of toUnlock) {
      const achievement = await prisma.achievement.findUnique({ where: { slug } })
      if (achievement) {
        await prisma.userAchievement.upsert({
          where: { userId_achievementId: { userId, achievementId: achievement.id } },
          update: {},
          create: { userId, achievementId: achievement.id },
        })
      }
    }
  } catch (err) {
    console.error('Error auto-unlocking achievements:', err)
  }
}
