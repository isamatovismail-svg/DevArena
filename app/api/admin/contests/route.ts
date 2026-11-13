import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

const contestSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be kebab-case'),
  description: z.string().min(10, 'Description is required'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  isPublished: z.boolean().default(true),
  problemIds: z.array(z.string()).min(1, 'At least one problem is required'),
})

export async function GET() {
  const sessionUser = await getCurrentUser()
  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const contests = await prisma.contest.findMany({
    include: {
      _count: {
        select: {
          contestParticipants: true,
          contestProblems: true,
          submissions: true,
        },
      },
    },
    orderBy: { startTime: 'desc' },
  })

  return NextResponse.json({ contests })
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const validation = contestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { problemIds, startTime, endTime, ...data } = validation.data

    const startDate = new Date(startTime)
    const endDate = new Date(endTime)
    if (endDate <= startDate) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 })
    }

    const contest = await prisma.contest.create({
      data: {
        ...data,
        startTime: startDate,
        endTime: endDate,
      },
    })

    // Attach problems
    for (let i = 0; i < problemIds.length; i++) {
      await prisma.contestProblem.create({
        data: {
          contestId: contest.id,
          problemId: problemIds[i],
          orderIndex: i,
          points: (i + 1) * 100,
        },
      })
    }

    return NextResponse.json({ contest }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Contest slug already in use' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create contest' }, { status: 500 })
  }
}
