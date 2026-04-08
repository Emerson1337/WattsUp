import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.tariffs.create({
    data: {
      state: "Ceará",
      description:
        "Tarifa de Uso do Sistema de Distribuição (TUSD). Iluminação pública calculada com base no CIP de Fortaleza.",
      kWhPrice: 0.722,
      kWhPriceTaxes: 0.85,
      kWhTEPrice: 0.2598,
      kWhTUSDPrice: 0.388,
      calibrationFactor: 1.0,
      lastReading: new Date("2025-04-20"),
      nextReadingDate: new Date("2025-05-20"),
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
