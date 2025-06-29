import { prisma } from "@/lib/prisma";

//npx tsx ./prisma/seeds/modality.ts

async function modalities() {
  const modalities = [
    {
      name: "teste 1",
    },
    {
      name: "teste 2",
    },
    {
      name: "teste 3",
    },
  ];

  for (const modality of modalities) {
    await prisma.modality.create({
      data: modality,
    });
  }
}

modalities()
  .then(async () => {
    console.log("Modalities created");
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });