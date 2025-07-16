import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const targetAudiences = await prisma.targetAudience.findMany();
    return NextResponse.json(targetAudiences);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar públicos alvo' }, { status: 500 });
  }
} 