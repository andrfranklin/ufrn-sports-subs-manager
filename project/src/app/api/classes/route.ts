import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name =  searchParams.get('name');
    const semester = searchParams.get('semester');
    const daysOfWeek = searchParams.get('daysOfWeek');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: Prisma.ClassWhereInput = {
      deletedAt: null
    };

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (semester) {
      where.semester = {
        contains: semester,
        mode: 'insensitive',
      };
    }

    if (daysOfWeek && daysOfWeek?.split(',').length) {
      where.daysOfWeek = {
        hasSome: daysOfWeek.toLowerCase().split(','),
      };
    }

    if (startTime) {
      where.startTime = {
        gte: new Date(startTime),
      };
    }

    if (endTime) {
      where.endTime = {
        lte: new Date(endTime),
      };
    }

    const skip = (page - 1) * limit;

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          modality: true,
          classTargetAudiences: {
            include: { targetAudience: true }
          },
          students: {
            where: {
              deletedAt: null
            },
            select: {
              id: true
            }
          }
        }
      }),
      prisma.class.count({
        where
      })
    ]);

    const classesWithStudentCount = classes.map(turma => ({
      ...turma,
      studentCount: turma.students.length
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      turmas: classesWithStudentCount,
      total,
      totalPages,
      currentPage: page
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar turmas', details: error }, { status: 500 });
  }
}