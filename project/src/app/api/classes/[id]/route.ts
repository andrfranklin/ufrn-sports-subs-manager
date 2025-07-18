import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const turma = await prisma.class.findUnique({
      where: { id },
      include: {
        modality: true,
        classTargetAudiences: {
          include: { targetAudience: true }
        }
      }
    });

    if (!turma) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(turma);
  } catch (error) {
    console.error('Erro ao buscar turma:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar turma', details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.student.updateMany({
      where: { classId: id },
      data: { classId: null }
    });

    await prisma.classTargetAudience.deleteMany({
      where: { classId: id }
    });

    await prisma.class.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return NextResponse.json({ success: true, message: 'Turma deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar turma:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar turma', details: error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

    const updatedClass = await prisma.class.update({
      where: { id },
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
      },
      include: {
        modality: true,
        classTargetAudiences: {
          include: { targetAudience: true }
        }
      }
    });

    if (targetAudienceIds) {
      await prisma.classTargetAudience.deleteMany({
        where: { classId: id }
      });

      if (targetAudienceIds.length > 0) {
        await prisma.classTargetAudience.createMany({
          data: targetAudienceIds.map((targetAudienceId: string) => ({
            classId: id,
            targetAudienceId
          }))
        });
      }
    }

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error('Erro ao atualizar turma:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar turma', details: error },
      { status: 500 }
    );
  }
} 