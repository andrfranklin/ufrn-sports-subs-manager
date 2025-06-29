import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Starting database seeding...");

  // Importar e executar todos os seeds
  await import("./modality");

  console.log("✅ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 