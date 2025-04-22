import {
  PrismaClient,
  PerMinuteReport as PrismaPerMinuteReport,
} from "@prisma/client";
import { getBrazilianUTCDate } from "@/modules/shared/utils/index";

const prisma = new PrismaClient();

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

class TelemetryRepository {
  private readonly oneHourAgo = new Date(Date.now() - ONE_HOUR_IN_MS);

  savePowerPerMinute = async (power: number): Promise<void> => {
    await prisma.perMinuteReport.create({
      data: {
        kW: power,
        createdAt: getBrazilianUTCDate(),
        updatedAt: getBrazilianUTCDate(),
      },
    });
  };

  getPowerFromLastHour = async (): Promise<PrismaPerMinuteReport[]> => {
    return await prisma.perMinuteReport.findMany({
      where: {
        createdAt: {
          gte: this.oneHourAgo,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  saveKWhPerHour = async (powerInKWh: number): Promise<void> => {
    await prisma.hourlyReport.create({
      data: {
        kWh: powerInKWh,
        createdAt: getBrazilianUTCDate(),
        updatedAt: getBrazilianUTCDate(),
      },
    });
  };

  incrementKWhInCurrentMonth = async (powerInKWh: number): Promise<void> => {
    const nowDate = getBrazilianUTCDate();

    const startOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);

    const existing = await prisma.monthlyReport.findFirst({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    if (existing) {
      await prisma.monthlyReport.update({
        where: { id: existing.id },
        data: {
          kWh: {
            increment: powerInKWh,
          },
          updatedAt: getBrazilianUTCDate(),
        },
      });
    } else {
      await prisma.monthlyReport.create({
        data: {
          kWh: powerInKWh,
          createdAt: getBrazilianUTCDate(),
          updatedAt: getBrazilianUTCDate(),
        },
      });
    }
  };

  incrementKWhInCurrentDay = async (powerInKWh: number): Promise<void> => {
    const startOfDay = getBrazilianUTCDate();
    startOfDay.setHours(0, 0, 0, 0);

    const existing = await prisma.dailyReport.findFirst({
      where: {
        createdAt: {
          gte: startOfDay,
        },
      },
    });

    if (existing) {
      await prisma.dailyReport.update({
        where: { id: existing.id },
        data: {
          kWh: {
            increment: powerInKWh,
          },
          updatedAt: getBrazilianUTCDate(),
        },
      });
    } else {
      await prisma.dailyReport.create({
        data: {
          kWh: powerInKWh,
          createdAt: getBrazilianUTCDate(),
          updatedAt: getBrazilianUTCDate(),
        },
      });
    }
  };
}

export default new TelemetryRepository();
