import {
  PrismaClient,
  PerMinuteReport as PrismaPerMinuteReport,
} from "@prisma/client";
import { getBrazilianUTCDate } from "@/modules/shared/utils/index";
import {
  startOfMinute,
  startOfMonth,
  startOfDay,
  subHours,
  startOfHour,
  isEqual,
} from "date-fns";

const prisma = new PrismaClient();

class TelemetryRepository {
  savePowerPerMinute = async (power: number): Promise<void> => {
    const currentDate = startOfMinute(getBrazilianUTCDate());

    await prisma.perMinuteReport.create({
      data: {
        kW: power,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });
  };

  getPowerFromLastHour = async (): Promise<PrismaPerMinuteReport[]> => {
    const currentDate = getBrazilianUTCDate();
    const pastHour = startOfHour(subHours(currentDate, 1));

    return await prisma.perMinuteReport.findMany({
      where: {
        createdAt: {
          gte: pastHour,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  saveKWhPerHour = async (powerInKWh: number): Promise<void> => {
    const currentDate = startOfMinute(getBrazilianUTCDate());

    await prisma.hourlyReport.create({
      data: {
        kWh: powerInKWh,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });
  };

  incrementKWhInCurrentDay = async (powerInKWh: number): Promise<void> => {
    const currentDate = startOfHour(getBrazilianUTCDate());
    const startOfTheDay = startOfDay(currentDate);

    let dayToIncrement = startOfTheDay;

    if (isEqual(currentDate, startOfTheDay)) {
      dayToIncrement = startOfHour(subHours(currentDate, 1));
    }

    const existing = await prisma.dailyReport.findFirst({
      where: {
        createdAt: {
          gte: startOfTheDay,
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
          updatedAt: dayToIncrement,
        },
      });
    } else {
      await prisma.dailyReport.create({
        data: {
          kWh: powerInKWh,
          createdAt: dayToIncrement,
          updatedAt: dayToIncrement,
        },
      });
    }
  };

  incrementKWhInCurrentMonth = async (powerInKWh: number): Promise<void> => {
    const currentDate = startOfHour(getBrazilianUTCDate());
    const startOfTheMonth = startOfMonth(currentDate);

    const existing = await prisma.monthlyReport.findFirst({
      where: {
        createdAt: {
          gte: startOfTheMonth,
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
          updatedAt: currentDate,
        },
      });
    } else {
      await prisma.monthlyReport.create({
        data: {
          kWh: powerInKWh,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      });
    }
  };
}

export default new TelemetryRepository();
