import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const modalities = await prisma.modality.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(modalities)
  } catch (error) {
    console.error('Error fetching modalities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const modality = await prisma.modality.create({
      data: {
        name
      }
    })

    return NextResponse.json(modality, { status: 201 })
  } catch (error) {
    console.error('Error creating modality:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 