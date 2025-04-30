import {
  PrismaClient,
  Tariffs as PrismaTariffs,
  MonthlyReport as PrismaMonthlyReport,
  DailyReport as PrismaDailyReport,
} from "@prisma/client";
import {
  startOfMonth,
  startOfHour,
  startOfDay,
  subDays,
  subMonths,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { BRAZIL_TZ } from "@/modules/shared/utils";

const prisma = new PrismaClient();

class DashboardRepository {
  findTariff = async (): Promise<PrismaTariffs | null> => {
    return await prisma.tariffs.findFirst();
  };

  findLastMonthConsumption = async (): Promise<PrismaMonthlyReport | null> => {
    const nowUTC = startOfHour(new Date());

    // Convert UTC time to Brazil local time
    const nowInBrazil = toZonedTime(nowUTC, BRAZIL_TZ);
    const lastMonthInBrazil = subMonths(startOfMonth(nowInBrazil), 1);

    return await prisma.monthlyReport.findFirst({
      where: {
        createdAt: {
          gte: lastMonthInBrazil,
          lte: startOfMonth(nowInBrazil),
        },
      },
    });
  };

  findCurrentMonthConsumption =
    async (): Promise<PrismaMonthlyReport | null> => {
      const nowUTC = startOfHour(new Date());

      // Convert UTC time to Brazil local time
      const nowInBrazil = toZonedTime(nowUTC, BRAZIL_TZ);
      const startOfMonthInBrazil = startOfMonth(nowInBrazil);

      return await prisma.monthlyReport.findFirst({
        where: {
          createdAt: {
            gte: startOfMonthInBrazil,
          },
        },
      });
    };

  getLast7DaysConsumption = async (): Promise<PrismaDailyReport[] | null> => {
    const nowUTC = startOfHour(new Date());

    // Convert UTC time to Brazil local time
    const nowInBrazil = toZonedTime(nowUTC, BRAZIL_TZ);
    const startOfDayInBrazil = startOfDay(nowInBrazil);
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
}

export default new DashboardRepository();
