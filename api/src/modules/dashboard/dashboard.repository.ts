import {
  PrismaClient,
  Tariffs as PrismaTariffs,
  MonthlyReport as PrismaMonthlyReport,
  DailyReport as PrismaDailyReport,
  PerMinuteReport as PrismaPerMinuteReport,
} from "@prisma/client";
import {
  startOfMonth,
  startOfHour,
  startOfDay,
  subDays,
  subYears,
  subHours,
  subMonths,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { BRAZIL_TZ } from "@/modules/shared/utils";
import { TIMEZONES } from "@/modules/shared/utils";

const prisma = new PrismaClient();

class DashboardRepository {
  private nowDateInTZ = toZonedTime(new Date(), BRAZIL_TZ);

  constructor(timezone?: TIMEZONES) {
    if (timezone) this.nowDateInTZ = toZonedTime(new Date(), timezone);
  }

  findTariff = async (): Promise<PrismaTariffs | null> => {
    return await prisma.tariffs.findFirst();
  };

  findLastMonthConsumption = async (): Promise<PrismaMonthlyReport | null> => {
    const lastMonth = subMonths(startOfMonth(this.nowDateInTZ), 1);

    return await prisma.monthlyReport.findFirst({
      where: {
        createdAt: {
          gte: lastMonth,
          lte: startOfMonth(this.nowDateInTZ),
        },
      },
    });
  };

  findCurrentMonthConsumption =
    async (): Promise<PrismaMonthlyReport | null> => {
      const startOfCurrentMonth = startOfMonth(this.nowDateInTZ);

      return await prisma.monthlyReport.findFirst({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
          },
        },
      });
    };

  findCurrentMonthConsumptionPeak =
    async (): Promise<PrismaDailyReport | null> => {
      const startOfCurrentMonth = startOfMonth(this.nowDateInTZ);

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

  findLastMonthConsumptionPeak =
    async (): Promise<PrismaDailyReport | null> => {
      const startOfCurrentMonth = startOfMonth(this.nowDateInTZ);
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

  getLast7DaysConsumption = async (): Promise<PrismaDailyReport[] | null> => {
    const startOfDayInBrazil = startOfDay(this.nowDateInTZ);
    const sevenDaysBeforeInBrazil = subDays(startOfDayInBrazil, 7);

    return await prisma.dailyReport.findMany({
      where: {
        createdAt: {
          lte: startOfDayInBrazil,
          gte: sevenDaysBeforeInBrazil,
        },
      },
    });
  };

  getLast6MonthsConsumption = async (): Promise<
    PrismaMonthlyReport[] | null
  > => {
    const currentMonthDate = startOfMonth(this.nowDateInTZ);
    const lastSixMonths = subMonths(currentMonthDate, 6);

    return await prisma.monthlyReport.findMany({
      where: {
        createdAt: {
          lte: this.nowDateInTZ,
          gte: lastSixMonths,
        },
      },
    });
  };

  getLast6MonthsConsumptionFromPastYear = async (): Promise<
    PrismaMonthlyReport[] | null
  > => {
    const currentMonthDateInPastYear = subYears(
      startOfMonth(this.nowDateInTZ),
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
    const lastHour = subHours(this.nowDateInTZ, 1);

    return await prisma.perMinuteReport.findMany({
      where: {
        createdAt: {
          lte: this.nowDateInTZ,
          gte: lastHour,
        },
      },
    });
  };
}

export default new DashboardRepository();
