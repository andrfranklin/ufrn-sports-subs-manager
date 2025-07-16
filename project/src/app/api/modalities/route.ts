import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const modalities = await prisma.modality.findMany();
    return NextResponse.json(modalities);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar modalidades' }, { status: 500 });
  }
} 