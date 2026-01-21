import DashboardRepository from "@/modules/dashboard/dashboard.repository";
import { Tariffs as PrismaTariffs } from "@prisma/client";
import { LastSemesterHistoryResponse } from "@/modules/dashboard/types/index";
import { isSameMonthNoYear, BRAZIL_TZ } from "@/modules/shared/utils";
import {
  MonthlyForecastResponse,
  MonthlyConsumptionResponse,
  LastHourHistoryResponse,
  LastDayHistoryResponse,
  LastMonthHistoryResponse,
} from "@/modules/dashboard/types";
import {
  addDays,
  addMonths,
  isSameMonth,
  differenceInDays,
  startOfMonth,
  getDate,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

class DashboardService {
  private getReadingDayFromTariff = (tariff: PrismaTariffs): number => {
    const nextReadingDateInTimezone = toZonedTime(
      tariff.nextReadingDate,
      BRAZIL_TZ
    );
    return getDate(nextReadingDateInTimezone);
  };

  getTariffs = async (): Promise<PrismaTariffs | undefined> => {
    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      return undefined;
    }

    return tariff;
  };

  updateTariff = async (
    id: string,
    tariff: Partial<PrismaTariffs>
  ): Promise<PrismaTariffs | undefined> => {
    const updatedTariff = await DashboardRepository.updateTariff(id, tariff);

    if (!updatedTariff) {
      throw new Error("Tarifa não encontrada.");
    }

    return updatedTariff;
  };

  getMonthlyConsumption = async (): Promise<
    MonthlyConsumptionResponse | undefined
  > => {
    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    const effectiveReadingDay = this.getReadingDayFromTariff(tariff);

    const currentMonthConsumption =
      await DashboardRepository.findCurrentMonthConsumption(
        effectiveReadingDay
      );

    const currentMonthConsumptionPeak =
      await DashboardRepository.findCurrentMonthConsumptionPeak(
        effectiveReadingDay
      );

    const lastMonthConsumptionPeak =
      await DashboardRepository.findLastMonthConsumptionPeak(
        effectiveReadingDay
      );

    const currentMonthPeakKWh = currentMonthConsumptionPeak?.kWh ?? 0;
    const lastMonthPeakKWh = lastMonthConsumptionPeak?.kWh ?? 0;

    const currentMonthPeakKWhPrice = currentMonthConsumptionPeak?.kWh
      ? currentMonthConsumptionPeak.kWh * tariff.kWhPriceTaxes
      : 0;
    const lastMonthPeakKWhPrice = lastMonthConsumptionPeak?.kWh
      ? lastMonthConsumptionPeak.kWh * tariff.kWhPriceTaxes
      : 0;

    const energyConsumptionPrice =
      (currentMonthConsumption?.kWh ?? 0) * tariff.kWhTEPrice;
    const tusdPrice = (currentMonthConsumption?.kWh ?? 0) * tariff.kWhTUSDPrice;
    const extraTaxes =
      (currentMonthConsumption?.kWh ?? 0) * tariff.kWhPriceTaxes -
      (energyConsumptionPrice + tusdPrice);

    return {
      energyConsumptionPrice,
      energyConsumptionInKWh: currentMonthConsumption?.kWh ?? 0,
      tusdPrice,
      extraTaxes,
      currentMonthPeak: {
        date: currentMonthConsumptionPeak?.createdAt,
        currentMonthPeakKWh,
        currentMonthPeakKWhPrice,
      },
      lastMonthPeak: {
        date: lastMonthConsumptionPeak?.createdAt,
        lastMonthPeakKWh,
        lastMonthPeakKWhPrice,
      },
    };
  };

  getMonthlyForecast = async (): Promise<
    MonthlyForecastResponse | undefined
  > => {
    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    const effectiveReadingDay = this.getReadingDayFromTariff(tariff);

    const last15DaysConsumption =
      await DashboardRepository.getLast15DaysConsumption();

    if (!last15DaysConsumption) {
      throw new Error("Consumo diário não encontrado.");
    }

    const lastMonthConsumption =
      await DashboardRepository.findLastMonthConsumption(effectiveReadingDay);

    const consumptionAverageLast15Days =
      last15DaysConsumption.reduce((acc, day) => acc + day.kWh, 0) /
      last15DaysConsumption.length;

    const daysLeftToFinishMonth = differenceInDays(
      tariff.nextReadingDate,
      new Date()
    );

    const currentMonthConsumption =
      await DashboardRepository.findCurrentMonthConsumption(
        effectiveReadingDay
      );

    const currentKwhConsumption = currentMonthConsumption?.kWh ?? 0;

    const currentMonthForecastInKWh =
      consumptionAverageLast15Days * daysLeftToFinishMonth +
      currentKwhConsumption;

    const currentMonthForecast = currentMonthForecastInKWh * tariff.kWhPrice;
    const currentMonthForecastWithTaxes =
      currentMonthForecastInKWh * tariff.kWhPriceTaxes;

    const pastMonthConsumptionInKWh = lastMonthConsumption?.kWh ?? 0;
    const pastMonthConsumption = pastMonthConsumptionInKWh * tariff.kWhPrice;
    const pastMonthConsumptionWithTaxes =
      pastMonthConsumptionInKWh * tariff.kWhPriceTaxes;

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
    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    const effectiveReadingDay = this.getReadingDayFromTariff(tariff);

    const last6MonthsConsumption =
      await DashboardRepository.getLast6MonthsConsumption(effectiveReadingDay);
    
    if (!last6MonthsConsumption)
      throw new Error("Consumo mensal não encontrado.");

    const last6MonthsConsumptionFromPastYear =
      await DashboardRepository.getLast6MonthsConsumptionFromPastYear(
        effectiveReadingDay
      );

    const history: LastSemesterHistoryResponse["history"] =
      last6MonthsConsumption.map((consumption) => ({
        month: consumption.createdAt,
        currentKWh: consumption.kWh,
      }));

    last6MonthsConsumptionFromPastYear?.forEach((pastYearConsumption) => {
      const indexForInsertion = history.findIndex((item) =>
        isSameMonthNoYear(item.month, pastYearConsumption.createdAt)
      );

      if (indexForInsertion === -1) return;

      history[indexForInsertion].pastYearKWh = pastYearConsumption.kWh;
    });

    return {
      history,
    };
  };

  getLastHourHistory = async (): Promise<
    LastHourHistoryResponse | undefined
  > => {
    const lastHourPerMinuteConsumption =
      await DashboardRepository.getLastHourHistoryPerMinute();

    if (!lastHourPerMinuteConsumption)
      throw new Error("Consumo não encontrado.");

    const history = lastHourPerMinuteConsumption.map((consumption) => ({
      minute: consumption.createdAt,
      KW: consumption.kW,
    }));

    return {
      history,
    };
  };

  getLastDayHistory = async (): Promise<LastDayHistoryResponse | undefined> => {
    const lastDayHourlyConsumption =
      await DashboardRepository.getLastDayHistoryHourly();

    if (!lastDayHourlyConsumption) throw new Error("Consumo não encontrado.");

    const history = lastDayHourlyConsumption.map((consumption) => ({
      hour: consumption.createdAt,
      KWh: consumption.kWh,
    }));

    return {
      history,
    };
  };

  getLastMonthHistory = async (): Promise<
    LastMonthHistoryResponse | undefined
  > => {
    const lastMonthDailyConsumption =
      await DashboardRepository.getLastMonthDaily();

    if (!lastMonthDailyConsumption) throw new Error("Consumo não encontrado.");

    const history = lastMonthDailyConsumption.map((consumption) => ({
      day: consumption.createdAt,
      KWh: consumption.kWh,
    }));

    return {
      history,
    };
  };
}

export default new DashboardService();
