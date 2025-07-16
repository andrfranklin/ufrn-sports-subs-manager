import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const day = searchParams.get('day');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');

  if (!location || !day || !startTime || !endTime) {
    return NextResponse.json({ conflict: false });
  }

  const classes = await prisma.class.findMany({
    where: {
      location,
      daysOfWeek: { has: day },
    },
  });

  const newStart = new Date(`2024-01-01T${startTime}:00.000Z`).getTime();
  const newEnd = new Date(`2024-01-01T${endTime}:00.000Z`).getTime();

  const conflict = classes.some((c) => {
    const cStart = new Date(c.startTime).getTime();
    const cEnd = new Date(c.endTime).getTime();
    return newStart < cEnd && newEnd > cStart;
  });

  return NextResponse.json({ conflict });
} 