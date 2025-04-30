import {
  PrismaClient,
  Tariffs as PrismaTariffs,
  MonthlyReport as PrismaMonthlyReport,
} from "@prisma/client";
import { startOfMonth, startOfHour } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { BRAZIL_TZ } from "@/modules/shared/utils";

const prisma = new PrismaClient();

class DashboardRepository {
  findTariff = async (): Promise<PrismaTariffs | null> => {
    return await prisma.tariffs.findFirst();
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
}

export default new DashboardRepository();
