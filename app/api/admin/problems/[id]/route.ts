import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

const updateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  constraints: z.string().optional(),
  inputFormat: z.string().optional(),
  outputFormat: z.string().optional(),
  isPublished: z.boolean().optional(),
  points: z.number().min(10).max(1000).optional(),
  timeLimit: z.number().min(100).max(10000).optional(),
  memoryLimit: z.number().min(16).max(1024).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const validation = updateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const { tags, ...data } = validation.data
    const updateData: any = { ...data }
    if (tags !== undefined) updateData.tags = JSON.stringify(tags)

    const problem = await prisma.problem.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ problem })
  } catch (error) {
    console.error('Update problem error:', error)
    return NextResponse.json({ error: 'Failed to update problem' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionUser = await getCurrentUser()
    if (!sessionUser || sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    await prisma.problem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Problem deleted' })
  } catch (error) {
    console.error('Delete problem error:', error)
    return NextResponse.json({ error: 'Failed to delete problem' }, { status: 500 })
  }
}
