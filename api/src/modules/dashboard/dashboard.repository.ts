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

  private refreshCurrentTime = (): void => {
    this.currentTimeUTC = new Date();
    this.currentTimeInTimezone = toZonedTime(this.currentTimeUTC, this.timezone);
  };

  private convertTimezoneToUTC = (dateInTimezone: Date): Date => {
    return fromZonedTime(dateInTimezone, this.timezone);
  };

  private getStartOfCurrentMonthInUTC = (
    startMonthReadingDay: number
  ): Date => {
    this.refreshCurrentTime();

    const currentHourInTimezone = startOfHour(this.currentTimeInTimezone);
    const currentDayOfMonth = currentHourInTimezone.getDate();

    const startOfMonthInTimezone = startOfDay(
      new Date(
        currentHourInTimezone.getFullYear(),
        currentDayOfMonth >= startMonthReadingDay
          ? currentHourInTimezone.getMonth()
          : currentHourInTimezone.getMonth() - 1,
        startMonthReadingDay
      )
    );

    return this.convertTimezoneToUTC(startOfMonthInTimezone);
  };

  constructor(timezone?: TIMEZONES) {
    if (timezone) this.timezone = timezone;
    this.refreshCurrentTime();
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
    startMonthReadingDay: number
  ): Promise<PrismaMonthlyReport | null> => {
    const startOfCurrentMonthInUTC =
      this.getStartOfCurrentMonthInUTC(startMonthReadingDay);
    const startOfLastMonthInUTC = subMonths(startOfCurrentMonthInUTC, 1);

    return await prisma.monthlyReport.findFirst({
      where: {
        createdAt: {
          gte: startOfLastMonthInUTC,
          lte: startOfCurrentMonthInUTC,
        },
      },
    });
  };

  findCurrentMonthConsumption = async (
    startMonthReadingDay: number
  ): Promise<PrismaMonthlyReport | null> => {
    const startOfCurrentMonthInUTC =
      this.getStartOfCurrentMonthInUTC(startMonthReadingDay);

    return await prisma.monthlyReport.findFirst({
      where: {
        createdAt: {
          gte: startOfCurrentMonthInUTC,
        },
      },
    });
  };

  findCurrentMonthConsumptionPeak = async (
    startMonthReadingDay: number
  ): Promise<PrismaDailyReport | null> => {
    const startOfCurrentMonthInUTC =
      this.getStartOfCurrentMonthInUTC(startMonthReadingDay);

    return await prisma.dailyReport.findFirst({
      where: {
        createdAt: {
          gte: startOfCurrentMonthInUTC,
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
    const startOfCurrentMonthInUTC =
      this.getStartOfCurrentMonthInUTC(startMonthReadingDay);
    const startOfLastMonthInUTC = subMonths(startOfCurrentMonthInUTC, 1);

    return await prisma.dailyReport.findFirst({
      where: {
        createdAt: {
          lt: startOfCurrentMonthInUTC,
          gte: startOfLastMonthInUTC,
        },
      },
      orderBy: {
        kWh: "desc",
      },
    });
  };

  getLast15DaysConsumption = async (): Promise<PrismaDailyReport[] | null> => {
    this.refreshCurrentTime();

    const startOfTodayInTimezone = startOfDay(this.currentTimeInTimezone);
    const startOfFifteenDaysAgoInTimezone = subDays(startOfTodayInTimezone, 15);

    const startOfTodayInUTC = this.convertTimezoneToUTC(startOfTodayInTimezone);
    const startOfFifteenDaysAgoInUTC =
      this.convertTimezoneToUTC(startOfFifteenDaysAgoInTimezone);

    return await prisma.dailyReport.findMany({
      where: {
        createdAt: {
          lte: startOfTodayInUTC,
          gte: startOfFifteenDaysAgoInUTC,
        },
      },
    });
  };

  getLast6MonthsConsumption = async (
    startMonthReadingDay: number
  ): Promise<PrismaMonthlyReport[] | null> => {
    this.refreshCurrentTime();

    const startOfCurrentMonthInUTC =
      this.getStartOfCurrentMonthInUTC(startMonthReadingDay);


    const startOfNextMonthInUTC = addMonths(startOfCurrentMonthInUTC, 1);

    let currentMonthTarget;

    const tariff = await this.findTariff();

    if(!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    if(isAfter(this.currentTimeInTimezone, addDays(tariff.nextReadingDate, 1))) {
      currentMonthTarget = startOfNextMonthInUTC;
    } else {
      currentMonthTarget = startOfCurrentMonthInUTC;
    }
      
    const startOfSixMonthsAgoInUTC = subMonths(startOfCurrentMonthInUTC, 6);

    const last6MonthsEntries = await prisma.monthlyReport.findMany({
      where: {
        createdAt: {
          lte: this.currentTimeUTC,
          gte: startOfSixMonthsAgoInUTC,
        },
      },
    });

    last6MonthsEntries[last6MonthsEntries.length - 1].createdAt = currentMonthTarget;

    return last6MonthsEntries;
  };

  getLast6MonthsConsumptionFromPastYear = async (
    startMonthReadingDay: number
  ): Promise<PrismaMonthlyReport[] | null> => {
    const startOfCurrentMonthInUTC =
      this.getStartOfCurrentMonthInUTC(startMonthReadingDay);

    const startOfCurrentMonthOneYearAgoInUTC = addMonths(
      subYears(startOfCurrentMonthInUTC, 1),
      1
    );
    const startOfSixMonthsBeforeOneYearAgoInUTC = subMonths(
      startOfCurrentMonthOneYearAgoInUTC,
      6
    );

    return await prisma.monthlyReport.findMany({
      where: {
        createdAt: {
          lte: startOfCurrentMonthOneYearAgoInUTC,
          gte: startOfSixMonthsBeforeOneYearAgoInUTC,
        },
      },
    });
  };

  getLastHourHistoryPerMinute = async (): Promise<
    PrismaPerMinuteReport[] | null
  > => {
    this.refreshCurrentTime();

    const oneHourAgoInTimezone = subHours(this.currentTimeInTimezone, 1);

    const currentTimeInUTC = this.currentTimeUTC;
    const oneHourAgoInUTC = this.convertTimezoneToUTC(oneHourAgoInTimezone);

    return await prisma.perMinuteReport.findMany({
      where: {
        createdAt: {
          lte: currentTimeInUTC,
          gte: oneHourAgoInUTC,
        },
      },
    });
  };

  getLastDayHistoryHourly = async (): Promise<PrismaHourlyReport[] | null> => {
    this.refreshCurrentTime();

    const oneDayAgoInTimezone = subDays(this.currentTimeInTimezone, 1);

    const currentTimeInUTC = this.currentTimeUTC;
    const oneDayAgoInUTC = this.convertTimezoneToUTC(oneDayAgoInTimezone);

    return await prisma.hourlyReport.findMany({
      where: {
        createdAt: {
          lte: currentTimeInUTC,
          gte: oneDayAgoInUTC,
        },
      },
    });
  };

  getLastMonthDaily = async (): Promise<PrismaDailyReport[] | null> => {
    this.refreshCurrentTime();

    const oneMonthAgoInTimezone = subMonths(this.currentTimeInTimezone, 1);

    const currentTimeInUTC = this.currentTimeUTC;
    const oneMonthAgoInUTC = this.convertTimezoneToUTC(oneMonthAgoInTimezone);

    return await prisma.dailyReport.findMany({
      where: {
        createdAt: {
          lte: currentTimeInUTC,
          gte: oneMonthAgoInUTC,
        },
      },
    });
  };
}

export default new DashboardRepository();
