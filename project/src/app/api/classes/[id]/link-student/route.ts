import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: classId } = params;
    const { studentId } = await request.json();

    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!classExists) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    const studentExists = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!studentExists) {
      return NextResponse.json(
        { error: 'Aluno não encontrado' },
        { status: 404 }
      );
    }

    if (studentExists.classId && studentExists.classId !== classId) {
      return NextResponse.json(
        { error: 'Aluno já está vinculado a outra turma' },
        { status: 400 }
      );
    }

    const currentStudents = await prisma.student.count({
      where: { classId }
    });

    if (currentStudents >= classExists.capacity) {
      return NextResponse.json(
        { error: 'Turma está com capacidade máxima' },
        { status: 400 }
      );
    }

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { classId },
      include: {
        class: {
          include: {
            modality: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Aluno vinculado com sucesso',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Erro ao vincular aluno:', error);
    return NextResponse.json(
      { error: 'Erro ao vincular aluno', details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: classId } = params;
    const { studentId } = await request.json();

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { classId: null }
    });

    return NextResponse.json({
      success: true,
      message: 'Aluno desvinculado com sucesso',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Erro ao desvincular aluno:', error);
    return NextResponse.json(
      { error: 'Erro ao desvincular aluno', details: error },
      { status: 500 }
    );
  }
} 