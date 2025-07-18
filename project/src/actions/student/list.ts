import { prisma } from "@/lib/prisma";

export async function listStudents(page: number = 1, limit: number = 10) {
  try {
    const skip = (page - 1) * limit;
    
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        where: {
          deletedAt: null
        }
      }),
      prisma.student.count({
        where: {
          deletedAt: null
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    return { 
      success: true, 
      students, 
      total, 
      totalPages, 
      currentPage: page 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}