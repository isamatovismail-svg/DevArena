import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

const problemSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be kebab-case (e.g. sample-problem)'),
  description: z.string().min(10, 'Description is required'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  constraints: z.string().optional(),
  inputFormat: z.string().optional(),
  outputFormat: z.string().optional(),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    explanation: z.string().optional(),
  })).default([]),
  timeLimit: z.number().min(100).max(10000).default(1000),
  memoryLimit: z.number().min(16).max(1024).default(256),
  points: z.number().min(10).max(1000).default(100),
  isPublished: z.boolean().default(true),
})

export async function GET() {
  const sessionUser = await getCurrentUser()
  if (!sessionUser || sessionUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const problems = await prisma.problem.findMany({
    include: {
      _count: {
        select: {
          submissions: true,
          testCases: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ problems })
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const validation = problemSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { examples, tags, ...data } = validation.data

    const problem = await prisma.problem.create({
      data: {
        ...data,
        tags: JSON.stringify(tags),
        examples: JSON.stringify(examples),
      },
    })

    return NextResponse.json({ problem }, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A problem with this slug already exists' }, { status: 409 })
    }
    console.error('Admin create problem error:', error)
    return NextResponse.json({ error: 'Failed to create problem' }, { status: 500 })
  }
}
