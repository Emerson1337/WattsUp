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
  isAfter,
  addDays,
} from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { BRAZIL_TZ } from "@/modules/shared/utils";
import { TIMEZONES } from "@/modules/shared/utils";

const prisma = new PrismaClient();

class DashboardRepository {
  private timezone: string = BRAZIL_TZ;
  private currentTimeUTC: Date = new Date();
  private currentTimeInTimezone: Date = toZonedTime(new Date(), this.timezone);

  constructor(timezone?: TIMEZONES) {
    if (timezone) this.timezone = timezone;
    this.refreshCurrentTime();
  }

  private refreshCurrentTime = (): void => {
    this.currentTimeUTC = new Date();
    this.currentTimeInTimezone = toZonedTime(
      this.currentTimeUTC,
      this.timezone
    );
  };

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
        nextReadingDate: tariff.nextReadingDate,
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
    effectiveReadingDate: Date
  ): Promise<PrismaMonthlyReport | null> => {
    const startOfCurrentMonth = effectiveReadingDate;
    const startOfLastMonth = subMonths(startOfCurrentMonth, 1);

    return await prisma.monthlyReport.findFirst({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: startOfCurrentMonth,
        },
      },
    });
  };

  findCurrentMonthConsumption = async (
    effectiveReadingDate: Date
  ): Promise<PrismaMonthlyReport | null> => {
    const startOfCurrentMonth = effectiveReadingDate;

    return await prisma.monthlyReport.findFirst({
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
        },
      },
    });
  };

  findCurrentMonthConsumptionPeak = async (
    effectiveReadingDate: Date
  ): Promise<PrismaDailyReport | null> => {
    const startOfCurrentMonth = effectiveReadingDate;

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
    effectiveReadingDate: Date
  ): Promise<PrismaDailyReport | null> => {
    const startOfCurrentMonth = effectiveReadingDate;
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
    this.refreshCurrentTime();

    const startOfToday = startOfDay(this.currentTimeUTC);
    const startOfFifteenDaysAgo = subDays(startOfToday, 15);

    return await prisma.dailyReport.findMany({
      where: {
        createdAt: {
          lte: startOfToday,
          gte: startOfFifteenDaysAgo,
        },
      },
    });
  };

  getLast6MonthsConsumption = async (
    effectiveReadingDate: Date
  ): Promise<PrismaMonthlyReport[] | null> => {
    this.refreshCurrentTime();

    const startOfCurrentMonth = effectiveReadingDate;
    let currentMonthTarget;

    const tariff = await this.findTariff();

    if (!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    const startOfNextMonth = tariff.nextReadingDate;

    if (isAfter(this.currentTimeInTimezone, addDays(tariff.lastReading, 1))) {
      currentMonthTarget = startOfNextMonth;
    } else {
      currentMonthTarget = startOfCurrentMonth;
    }

    const startOfSixMonthsAgo = subMonths(startOfCurrentMonth, 6);

    const last6MonthsEntries = await prisma.monthlyReport.findMany({
      where: {
        createdAt: {
          lte: this.currentTimeUTC,
          gte: startOfSixMonthsAgo,
        },
      },
    });

    if (!last6MonthsEntries.length) {
      return [];
    }

    last6MonthsEntries[last6MonthsEntries.length - 1].createdAt =
      currentMonthTarget;

    return last6MonthsEntries;
  };

  getLast6MonthsConsumptionFromPastYear = async (
    effectiveReadingDate: Date
  ): Promise<PrismaMonthlyReport[] | null> => {
    this.refreshCurrentTime();

    const startOfCurrentMonth = effectiveReadingDate;
    let currentMonthTarget;

    const tariff = await this.findTariff();

    if (!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    const startOfCurrentMonthOneYearAgo = addMonths(
      subYears(startOfCurrentMonth, 1),
      1
    );
    const startOfNextMonthOneYearAgo = addMonths(
      subYears(tariff.nextReadingDate, 1),
      1
    );
    const lastReadingOneYearAgo = subYears(tariff.lastReading, 1);

    if (
      isAfter(this.currentTimeInTimezone, addDays(lastReadingOneYearAgo, 1))
    ) {
      currentMonthTarget = startOfNextMonthOneYearAgo;
    } else {
      currentMonthTarget = startOfCurrentMonthOneYearAgo;
    }

    const startOfSixMonthsBeforeOneYearAgo = subMonths(
      startOfCurrentMonthOneYearAgo,
      6
    );

    const last6MonthsEntries = await prisma.monthlyReport.findMany({
      where: {
        createdAt: {
          lte: startOfCurrentMonthOneYearAgo,
          gte: startOfSixMonthsBeforeOneYearAgo,
        },
      },
    });

    if (!last6MonthsEntries.length) {
      return [];
    }

    last6MonthsEntries[last6MonthsEntries.length - 1].createdAt =
      currentMonthTarget;

    return last6MonthsEntries;
  };

  getLastHourHistoryPerMinute = async (): Promise<
    PrismaPerMinuteReport[] | null
  > => {
    this.refreshCurrentTime();

    const oneHourAgo = subHours(this.currentTimeUTC, 1);

    const currentTimeInUTC = this.currentTimeUTC;

    return await prisma.perMinuteReport.findMany({
      where: {
        createdAt: {
          lte: currentTimeInUTC,
          gte: oneHourAgo,
        },
      },
    });
  };

  getLastDayHistoryHourly = async (): Promise<PrismaHourlyReport[] | null> => {
    this.refreshCurrentTime();

    const oneDayAgo = subDays(this.currentTimeUTC, 1);

    const currentTimeInUTC = this.currentTimeUTC;

    return await prisma.hourlyReport.findMany({
      where: {
        createdAt: {
          lte: currentTimeInUTC,
          gte: oneDayAgo,
        },
      },
    });
  };

  getLastMonthDaily = async (): Promise<PrismaDailyReport[] | null> => {
    this.refreshCurrentTime();

    const oneMonthAgo = subMonths(this.currentTimeUTC, 1);

    return await prisma.dailyReport.findMany({
      where: {
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });
  };
}

export default new DashboardRepository();
