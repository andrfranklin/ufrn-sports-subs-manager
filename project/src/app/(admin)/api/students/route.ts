import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const aluno = await prisma.student.create({
      data: {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        telefone: data.telefone,
        dataNascimento: new Date(data.dataNascimento),
      },
    });
    return NextResponse.json(aluno, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cadastrar aluno.' }, { status: 400 });
  }
}