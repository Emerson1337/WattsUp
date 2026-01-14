import {
  PrismaClient,
  Tariffs as PrismaTariffs,
  MonthlyReport as PrismaMonthlyReport,
  DailyReport as PrismaDailyReport,
  PerMinuteReport as PrismaPerMinuteReport,
  HourlyReport as PrismaHourlyReport,
} from "@prisma/client";
import {
  startOfHour,
  startOfDay,
  subDays,
  subYears,
  subHours,
  subMonths,
  addMonths,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { BRAZIL_TZ } from "@/modules/shared/utils";
import { TIMEZONES } from "@/modules/shared/utils";

const prisma = new PrismaClient();

class DashboardRepository {
  private nowDateInTZ = () => toZonedTime(new Date(), BRAZIL_TZ);

  // Determine the start of the current "month" (e.g: starting on the 20th)
  private getStartOfTheMonthInTZ = (startMonthReadingDay: number) => {
    const currentDate = startOfHour(this.nowDateInTZ());

    // Determine the start of the current "month" (e.g: starting on the 20th)
    if (currentDate.getDate() >= startMonthReadingDay) {
      // If today is after the start month reading day, return the start of the month
      return startOfDay(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          startMonthReadingDay
        )
      );
    }

    // If today is before the start month reading day, return the start of the previous month (the actual current month)
    return startOfDay(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        startMonthReadingDay
      )
    );
  };

  constructor(timezone?: TIMEZONES) {
    if (timezone) this.nowDateInTZ = () => toZonedTime(new Date(), timezone);
  }

  findTariff = async (): Promise<PrismaTariffs | null> => {
    return await prisma.tariffs.findFirst();
  };

  updateTariff = async (
    id: string,
    tariff: Partial<PrismaTariffs>
  ): Promise<PrismaTariffs | null> => {
    return await prisma.tariffs.update({
      where: { id },
      data: {
        effectiveReadingDay: tariff.effectiveReadingDay,
        lastReading: tariff.lastReading,
        kWhPrice: tariff.kWhPrice,
        kWhPriceTaxes: tariff.kWhPriceTaxes,
        kWhTEPrice: tariff.kWhTEPrice,
        kWhTUSDPrice: tariff.kWhTUSDPrice,
        description: tariff.description,
        state: tariff.state,
      },
    });
  };

  findLastMonthConsumption = async (
    startMonthReadingDay: number
  ): Promise<PrismaMonthlyReport | null> => {
    const startOfCurrentMonth =
      this.getStartOfTheMonthInTZ(startMonthReadingDay);

    const lastMonth = subMonths(startOfCurrentMonth, 1);

    return await prisma.monthlyReport.findFirst({
      where: {
        createdAt: {
          gte: lastMonth,
          lte: startOfCurrentMonth,
        },
      },
    });
  };

  findCurrentMonthConsumption = async (
    startMonthReadingDay: number
  ): Promise<PrismaMonthlyReport | null> => {
    const startOfCurrentMonth =
      this.getStartOfTheMonthInTZ(startMonthReadingDay);

    return await prisma.monthlyReport.findFirst({
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
    });
  };

  findCurrentMonthConsumptionPeak = async (
    startMonthReadingDay: number
  ): Promise<PrismaDailyReport | null> => {
    const startOfCurrentMonth =
      this.getStartOfTheMonthInTZ(startMonthReadingDay);

    return await prisma.dailyReport.findFirst({
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
      orderBy: {
        kWh: "desc",
      },
    });
  };

  findLastMonthConsumptionPeak = async (
    startMonthReadingDay: number
  ): Promise<PrismaDailyReport | null> => {
    const startOfCurrentMonth =
      this.getStartOfTheMonthInTZ(startMonthReadingDay);

    const startOfLastMonth = subMonths(startOfCurrentMonth, 1);

    return await prisma.dailyReport.findFirst({
      where: {
        createdAt: {
          lt: startOfCurrentMonth,
          gte: startOfLastMonth,
        },
      },
      orderBy: {
        kWh: "desc",
      },
    });
  };

  getLast15DaysConsumption = async (): Promise<PrismaDailyReport[] | null> => {
    const startOfDayInBrazil = startOfDay(this.nowDateInTZ());
    const sevenDaysBeforeInBrazil = subDays(startOfDayInBrazil, 15);

    return await prisma.dailyReport.findMany({
      where: {
        createdAt: {
          lte: startOfDayInBrazil,
          gte: sevenDaysBeforeInBrazil,
        },
      },
    });
  };

  getLast6MonthsConsumption = async (
    startMonthReadingDay: number
  ): Promise<PrismaMonthlyReport[] | null> => {
    const startOfCurrentMonth =
      this.getStartOfTheMonthInTZ(startMonthReadingDay);
    const lastSixMonths = subMonths(startOfCurrentMonth, 6);

    return await prisma.monthlyReport.findMany({
      where: {
        createdAt: {
          lte: this.nowDateInTZ(),
          gte: lastSixMonths,
        },
      },
    });
  };

  getLast6MonthsConsumptionFromPastYear = async (
    startMonthReadingDay: number
  ): Promise<PrismaMonthlyReport[] | null> => {
    const startOfCurrentMonth =
      this.getStartOfTheMonthInTZ(startMonthReadingDay);

    const currentMonthDateInPastYear = addMonths(
      subYears(startOfCurrentMonth, 1),
      1
    );
    const lastSixMonthsInPastYear = subMonths(currentMonthDateInPastYear, 6);

    return await prisma.monthlyReport.findMany({
      where: {
        createdAt: {
          lte: currentMonthDateInPastYear,
          gte: lastSixMonthsInPastYear,
        },
      },
    });
  };

  getLastHourHistoryPerMinute = async (): Promise<
    PrismaPerMinuteReport[] | null
  > => {
    const lastHour = subHours(this.nowDateInTZ(), 1);

    return await prisma.perMinuteReport.findMany({
      where: {
        createdAt: {
          lte: this.nowDateInTZ(),
          gte: lastHour,
        },
      },
    });
  };

  getLastDayHistoryHourly = async (): Promise<PrismaHourlyReport[] | null> => {
    const lastDay = subDays(this.nowDateInTZ(), 1);

    return await prisma.hourlyReport.findMany({
      where: {
        createdAt: {
          lte: this.nowDateInTZ(),
          gte: lastDay,
        },
      },
    });
  };

  getLastMonthDaily = async (): Promise<PrismaDailyReport[] | null> => {
    const lastDay = subMonths(this.nowDateInTZ(), 1);

    return await prisma.dailyReport.findMany({
      where: {
        createdAt: {
          lte: this.nowDateInTZ(),
          gte: lastDay,
        },
      },
    });
  };
}

export default new DashboardRepository();
