import {
  PrismaClient,
  PerMinuteReport as PrismaPerMinuteReport,
} from "@prisma/client";
import {
  startOfMinute,
  startOfMonth,
  startOfDay,
  subHours,
  startOfHour,
} from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { BRAZIL_TZ } from "@/modules/shared/utils";

const prisma = new PrismaClient();

class TelemetryRepository {
  savePowerPerMinute = async (power: number): Promise<void> => {
    const currentDate = startOfMinute(new Date());

    await prisma.perMinuteReport.create({
      data: {
        kW: power,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });
  };

  getPowerFromLastHour = async (): Promise<PrismaPerMinuteReport[]> => {
    const currentDate = new Date();
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

  updateLastReadingTariff = async (): Promise<void> => {
    const currentDate = startOfMinute(new Date());

    await prisma.tariffs.updateMany({
      data: {
        lastReading: currentDate,
      },
    });
  };

  saveKWhPerHour = async (powerInKWh: number): Promise<void> => {
    const currentDate = startOfMinute(new Date());

    await prisma.hourlyReport.create({
      data: {
        kWh: powerInKWh,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });
  };

  incrementKWhInCurrentDayBrazilianTZ = async (
    powerInKWh: number
  ): Promise<void> => {
    const nowUTC = startOfHour(new Date());

    // Convert UTC time to Brazil local time
    const nowInBrazil = toZonedTime(nowUTC, BRAZIL_TZ);
    const startOfDayInBrazil = startOfDay(nowInBrazil);

    // Convert that Brazil-local start of day back to UTC (to match DB)
    const reportDay = fromZonedTime(startOfDayInBrazil, BRAZIL_TZ);

    const existing = await prisma.dailyReport.findFirst({
      where: {
        createdAt: reportDay,
      },
    });

    if (existing) {
      await prisma.dailyReport.update({
        where: { id: existing.id },
        data: {
          kWh: {
            increment: powerInKWh,
          },
          updatedAt: nowUTC,
        },
      });
    } else {
      await prisma.dailyReport.create({
        data: {
          kWh: powerInKWh,
          createdAt: reportDay,
          updatedAt: nowUTC,
        },
      });
    }
  };

  incrementKWhInCurrentMonth = async (powerInKWh: number): Promise<void> => {
    const currentDate = startOfHour(new Date());
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
