import DashboardRepository from "@/modules/dashboard/dashboard.repository";
import { Tariffs as PrismaTariffs } from "@prisma/client";
import { LastSemesterHistoryResponse } from "@/modules/dashboard/types/index";
import {
  MonthlyForecastResponse,
  MonthlyConsumptionResponse,
} from "@/modules/dashboard/types/index";
import {
  addDays,
  addMonths,
  isSameMonth,
  differenceInDays,
  subYears,
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

    const currentMonthConsumptionPeak =
      await DashboardRepository.findCurrentMonthConsumptionPeak();

    const lastMonthConsumptionPeak =
      await DashboardRepository.findLastMonthConsumptionPeak();

    const currentMonthPeakKWh = currentMonthConsumptionPeak?.kWh ?? 0;
    const lastMonthPeakKWh = lastMonthConsumptionPeak?.kWh ?? 0;

    const currentMonthPeakKWhPrice = currentMonthConsumptionPeak?.kWh
      ? currentMonthConsumptionPeak.kWh * tariff.kWhPrice
      : 0;
    const lastMonthPeakKWhPrice = lastMonthConsumptionPeak?.kWh
      ? lastMonthConsumptionPeak.kWh * tariff.kWhPrice
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
      lastMonthPeakKWh,
      lastMonthPeakKWhPrice,
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

  getLast6MonthsHistory = async (): Promise<
    LastSemesterHistoryResponse | undefined
  > => {
    const last6MonthsConsumption =
      await DashboardRepository.getLast6MonthsConsumption();

    if (!last6MonthsConsumption)
      throw new Error("Consumo mensal não encontrado.");

    const last6MonthsConsumptionFromPastYear =
      await DashboardRepository.getLast6MonthsConsumptionFromPastYear();

    const history: LastSemesterHistoryResponse["history"] =
      last6MonthsConsumption.map((consumption) => ({
        month: consumption.createdAt,
        currentKWh: consumption.kWh,
      }));

    last6MonthsConsumptionFromPastYear?.forEach((pastYearConsumption) => {
      const indexForInsertion = history.findIndex((item) =>
        isSameMonth(item.month, pastYearConsumption.createdAt)
      );

      if (indexForInsertion === -1) return;

      history[indexForInsertion].pastYearKWh = pastYearConsumption.kWh;
    });

    return {
      history,
    };
  };
}

export default new DashboardService();
