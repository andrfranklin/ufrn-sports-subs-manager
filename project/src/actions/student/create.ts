import { prisma } from "@/lib/prisma";

export async function createStudent(data: {
  name: string;
  email: string;
  cpf: string;
  telephone: string;
  birthdate: string;
}) {
  try {
    const student = await prisma.student.create({
      data: {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        telephone: data.telephone,
        birthdate: new Date(data.birthdate),
      },
    });
    return { success: true, student };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
} 