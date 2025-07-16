import { prisma } from "@/lib/prisma";

export async function seedModalities() {
  await prisma.$connect();

  const modalities = [
    {
      name: "Futebol",
      description: "Esporte coletivo jogado com os pés.",
      iconUrl: "/images/modalities/futebol.svg",
    },
    {
      name: "Vôlei",
      description: "Esporte coletivo jogado com as mãos.",
      iconUrl: "/images/modalities/volei.svg",
    },
    {
      name: "Natação",
      description: "Esporte individual praticado na água.",
      iconUrl: "/images/modalities/natacao.svg",
    },
    {
      name: "Ginástica",
      description: "Atividades físicas de alongamento e força.",
      iconUrl: "/images/modalities/ginastica.svg",
    },
    {
      name: "Basquete",
      description: "Esporte coletivo com arremessos à cesta.",
      iconUrl: "/images/modalities/basquete.svg",
    },
  ];

  await prisma.modality.deleteMany();

  for (const modality of modalities) {
    await prisma.modality.create({
      data: modality,
    });
  }
}

if (require.main === module) {
  seedModalities()
    .then(() => {
      console.log("✅ Modalities created");
    })
    .catch((e) => {
      console.error("❌ Error creating modalities:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}