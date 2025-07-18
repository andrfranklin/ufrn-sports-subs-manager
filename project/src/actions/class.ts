import { prisma } from "@/lib/prisma";

export async function createClass(data: {
  name: string;
  description?: string;
  imageUrl?: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  capacity: number;
  location: string;
  semester: string;
  modalityId: string;
  targetAudienceIds: string[];
}) {
  try {
    const turma = await prisma.class.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        daysOfWeek: data.daysOfWeek,
        startTime: new Date(`1970-01-01T${data.startTime}:00Z`),
        endTime: new Date(`1970-01-01T${data.endTime}:00Z`),
        capacity: Number(data.capacity),
        location: data.location,
        semester: data.semester,
        modalityId: data.modalityId,
        classTargetAudiences: {
          create: data.targetAudienceIds.map((id) => ({ targetAudienceId: id })),
        },
      },
      include: { classTargetAudiences: true },
    });
    return { success: true, turma };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function listClasses() {
  try {
    const turmas = await prisma.class.findMany({
      include: {
        modality: true,
        classTargetAudiences: { include: { targetAudience: true } },
      },
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, turmas };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
} 