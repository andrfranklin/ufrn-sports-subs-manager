import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: classId } = await params;

    const classExists = await prisma.class.findUnique({
      where: { id: classId }
    });

    if (!classExists) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    const students = await prisma.student.findMany({
      where: { 
        classId,
        deletedAt: null
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      students,
      total: students.length
    });
  } catch (error) {
    console.error('Erro ao buscar alunos da turma:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar alunos da turma', details: error },
      { status: 500 }
    );
  }
} 