import DashboardRepository from "@/modules/dashboard/dashboard.repository";
import { Tariffs as PrismaTariffs } from "@prisma/client";
import {
  addDays,
  addMonths,
  isSameMonth,
  differenceInDays,
  startOfMonth,
} from "date-fns";

class DashboardService {
  getTariffs = async (): Promise<PrismaTariffs | undefined> => {
    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      return undefined;
    }

    return tariff;
  };

  getMonthlyConsumption = async (): Promise<
    | {
        energyConsumption: number;
        taxes: number;
        publicLighting: number;
      }
    | undefined
  > => {
    const currentMonthConsumption =
      await DashboardRepository.findCurrentMonthConsumption();
    if (!currentMonthConsumption) {
      throw new Error("Consumo mensal não encontrado.");
    }

    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    const energyConsumption = currentMonthConsumption.kWh * tariff.kWhPrice;
    const taxes = currentMonthConsumption.kWh * tariff.kWhPriceTaxes;
    const publicLighting = tariff.publicLightingPrice;

    return {
      energyConsumption,
      taxes,
      publicLighting,
    };
  };

  getMonthlyForecast = async (): Promise<
    | {
        currentMonthForecast: number;
        pastMonthConsumption: number;
      }
    | undefined
  > => {
    const currentDate = new Date();

    const last7DaysConsumption =
      await DashboardRepository.getLast7DaysConsumption();

    if (!last7DaysConsumption) {
      throw new Error("Consumo diário não encontrado.");
    }

    const lastMonthConsumption =
      await DashboardRepository.findLastMonthConsumption();

    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    const consumptionAverageLast7Days =
      last7DaysConsumption.reduce((acc, day) => acc + day.kWh, 0) /
      last7DaysConsumption.length;

    const nextReadingDate = isSameMonth(tariff.lastReading, currentDate)
      ? addDays(
          startOfMonth(addMonths(currentDate, 1)),
          tariff.effectiveReadingDay
        )
      : addDays(startOfMonth(currentDate), tariff.effectiveReadingDay);

    const daysLeftToFinishMonth = differenceInDays(
      nextReadingDate,
      tariff.lastReading
    );

    const currentMonthForecast =
      consumptionAverageLast7Days * daysLeftToFinishMonth;

    const pastMonthConsumption = lastMonthConsumption?.kWh
      ? lastMonthConsumption.kWh * tariff.kWhPrice
      : 0;

    return {
      currentMonthForecast,
      pastMonthConsumption,
    };
  };
}

export default new DashboardService();
