import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      imageUrl,
      daysOfWeek,
      startTime,
      endTime,
      capacity,
      location,
      semester,
      modalityId,
      targetAudienceIds,
    } = body;

    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        imageUrl,
        daysOfWeek,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity,
        location,
        semester,
        modalityId,
        classTargetAudiences: {
          create: targetAudienceIds.map((id: string) => ({ targetAudienceId: id })),
        },
      },
      include: {
        classTargetAudiences: true,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar turma', details: error }, { status: 500 });
  }
} 

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        modality: true,
        classTargetAudiences: {
          include: { targetAudience: true }
        }
      }
    });
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar turmas', details: error }, { status: 500 });
  }
}