import { prisma } from "@/lib/prisma";

export async function seedTargetAudiences() {
  await prisma.$connect();

  const audiences = [
    {
      name: "Infantil",
      minAge: 6,
      maxAge: 12,
    },
    {
      name: "Adolescente",
      minAge: 13,
      maxAge: 17,
    },
    {
      name: "Adulto",
      minAge: 18,
      maxAge: 59,
    },
    {
      name: "Idoso",
      minAge: 60,
      maxAge: 120,
    },
  ];

  await prisma.targetAudience.deleteMany();

  for (const audience of audiences) {
    await prisma.targetAudience.create({
      data: audience,
    });
  }
}

if (require.main === module) {
  seedTargetAudiences()
    .then(() => {
      console.log("✅ Target audiences created");
    })
    .catch((e) => {
      console.error("❌ Error creating target audiences:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}