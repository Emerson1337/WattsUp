import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.tariffs.create({
    data: {
      state: "Ceará",
      description:
        "Tarifa de energia elétrica convencional e taxas (TUSD + TE)",
      kWhPrice: 0.722,
      kWhPriceTaxes: 0.2,
      effectiveReadingDay: 20,
      lastReading: new Date("2025-04-20"),
    },
  });

  console.log("Seeding of database finished successfully 🎉");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
