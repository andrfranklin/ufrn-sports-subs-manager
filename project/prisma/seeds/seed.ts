import { prisma } from "@/lib/prisma";
import { seedModalities } from './modality';
import { seedTargetAudiences } from './targetAudience';

async function main() {
  console.log("🌱 Starting database seeding...");

  await seedModalities();
  await seedTargetAudiences();

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