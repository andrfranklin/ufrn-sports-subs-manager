import { prisma } from "../../src/lib/prisma";

async function main() {
  const modalidades = await prisma.modality.findMany();
  const publicos = await prisma.targetAudience.findMany();

  if (modalidades.length === 0 || publicos.length === 0) {
    throw new Error("É necessário ter modalidades e públicos-alvo cadastrados antes de rodar o seed de turmas.");
  }

  const turmas = [
    {
      name: "Futebol Segunda e Quarta",
      description: "Turma de futebol para adultos.",
      imageUrl: null,
      daysOfWeek: ["monday", "wednesday"],
      startTime: "18:00",
      endTime: "19:30",
      capacity: 20,
      location: "Quadra 1",
      semester: "2024.1",
      modalityId: modalidades.find((m: any) => m.name === "Futebol")?.id || modalidades[0].id,
      targetAudienceIds: [publicos.find((p: any) => p.name === "Adulto")?.id || publicos[0].id],
    },
    {
      name: "Natação Infantil Terça e Quinta",
      description: "Turma de natação para crianças.",
      imageUrl: null,
      daysOfWeek: ["tuesday", "thursday"],
      startTime: "15:00",
      endTime: "16:00",
      capacity: 12,
      location: "Piscina",
      semester: "2024.1",
      modalityId: modalidades.find((m: any) => m.name === "Natação")?.id || modalidades[0].id,
      targetAudienceIds: [publicos.find((p: any) => p.name === "Infantil")?.id || publicos[0].id],
    },
    {
      name: "Ginástica para Idosos Sexta",
      description: "Turma de ginástica para idosos.",
      imageUrl: null,
      daysOfWeek: ["friday"],
      startTime: "08:00",
      endTime: "09:00",
      capacity: 15,
      location: "Sala 2",
      semester: "2024.1",
      modalityId: modalidades.find((m: any) => m.name === "Ginástica")?.id || modalidades[0].id,
      targetAudienceIds: [publicos.find((p: any) => p.name === "Idoso")?.id || publicos[0].id],
    },
    {
      name: "Vôlei Adolescente Sábado",
      description: "Turma de vôlei para adolescentes.",
      imageUrl: null,
      daysOfWeek: ["saturday"],
      startTime: "10:00",
      endTime: "12:00",
      capacity: 18,
      location: "Quadra 2",
      semester: "2024.1",
      modalityId: modalidades.find((m: any) => m.name === "Vôlei")?.id || modalidades[0].id,
      targetAudienceIds: [publicos.find((p: any) => p.name === "Adolescente")?.id || publicos[0].id],
    },
  ];

  for (const turma of turmas) {
    const created = await prisma.class.create({
      data: {
        name: turma.name,
        description: turma.description,
        imageUrl: turma.imageUrl,
        daysOfWeek: turma.daysOfWeek,
        startTime: new Date(`2024-01-01T${turma.startTime}:00Z`),
        endTime: new Date(`2024-01-01T${turma.endTime}:00Z`),
        capacity: turma.capacity,
        location: turma.location,
        semester: turma.semester,
        modalityId: turma.modalityId,
        classTargetAudiences: {
          create: turma.targetAudienceIds.map((id: string) => ({ targetAudienceId: id })),
        },
      },
    });
    console.log(`Turma criada: ${created.name}`);
  }
}

main()
  .then(() => console.log("Seed de turmas finalizado!"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 