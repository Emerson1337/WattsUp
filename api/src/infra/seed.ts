import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.tariffs.create({
    data: {
      state: "Ceará",
      description: "Tarifa de energia elétrica convencional (TSDU + TE)",
      kWhPrice: 0.722,
      kWhPriceWithTaxes: 0.8664,
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
