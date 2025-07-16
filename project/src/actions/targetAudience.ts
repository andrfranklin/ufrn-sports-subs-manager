import { prisma } from "@/lib/prisma";

export async function listTargetAudiences() {
  try {
    const audiences = await prisma.targetAudience.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, audiences };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
} 