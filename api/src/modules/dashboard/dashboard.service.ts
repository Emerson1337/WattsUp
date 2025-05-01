import DashboardRepository from "@/modules/dashboard/dashboard.repository";
import { Tariffs as PrismaTariffs } from "@prisma/client";
import {
  MonthlyForecastResponse,
  MonthlyConsumptionResponse,
} from "@/modules/dashboard/types/index";
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
    MonthlyConsumptionResponse | undefined
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

    const currentMonthPeakConsumption =
      await DashboardRepository.findCurrentMonthConsumptionPeak();

    const currentMonthPeakKWh = currentMonthPeakConsumption?.kWh ?? 0;

    const currentMonthPeakKWhPrice = currentMonthPeakConsumption?.kWh
      ? currentMonthPeakConsumption.kWh * tariff.kWhPrice
      : 0;

    const energyConsumptionPrice =
      currentMonthConsumption.kWh * tariff.kWhPrice;
    const taxesPrice = currentMonthConsumption.kWh * tariff.kWhPriceTaxes;
    const publicLighting = tariff.publicLightingPrice;

    return {
      energyConsumptionPrice,
      taxesPrice,
      publicLighting,
      currentMonthPeakKWh,
      currentMonthPeakKWhPrice,
    };
  };

  getMonthlyForecast = async (): Promise<
    MonthlyForecastResponse | undefined
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

    const currentMonthForecastInKWh =
      consumptionAverageLast7Days * daysLeftToFinishMonth;

    const currentMonthForecast = currentMonthForecastInKWh * tariff.kWhPrice;
    const currentMonthForecastWithTaxes =
      currentMonthForecast * (1 + tariff.kWhPriceTaxes);

    const pastMonthConsumptionInKWh = lastMonthConsumption?.kWh ?? 0;
    const pastMonthConsumption = lastMonthConsumption?.kWh
      ? lastMonthConsumption.kWh * tariff.kWhPrice
      : 0;
    const pastMonthConsumptionWithTaxes =
      pastMonthConsumption * (1 + tariff.kWhPriceTaxes);

    return {
      currentMonthForecastInKWh,
      currentMonthForecast,
      currentMonthForecastWithTaxes,
      pastMonthConsumptionInKWh,
      pastMonthConsumption,
      pastMonthConsumptionWithTaxes,
    };
  };
}

export default new DashboardService();
