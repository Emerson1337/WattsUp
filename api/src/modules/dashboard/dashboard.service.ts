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
  private applyCalibration = (
    value: number,
    factor: number,
    calibrate: boolean
  ): number => {
    return calibrate ? value * factor : value;
  };

  private getReadingDayFromTariff = (tariff: PrismaTariffs): number => {
    const nextReadingDateInTimezone = toZonedTime(
      tariff.nextReadingDate,
      BRAZIL_TZ
    );
    return getDate(nextReadingDateInTimezone);
  };

  private getLastEffectiveReadingDay = (tariff: PrismaTariffs): number => {
    const lastReadingDateInTimezone = toZonedTime(
      tariff.lastReading,
      BRAZIL_TZ
    );
    return getDate(lastReadingDateInTimezone);
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

  getMonthlyConsumption = async (
    calibrate: boolean = false
  ): Promise<MonthlyConsumptionResponse | undefined> => {
    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    const factor = tariff.calibrationFactor ?? 1.0;
    const effectiveReadingDate = tariff.lastReading;

    const currentMonthConsumption =
      await DashboardRepository.findCurrentMonthConsumption(
        effectiveReadingDate
      );

    const currentMonthConsumptionPeak =
      await DashboardRepository.findCurrentMonthConsumptionPeak(
        effectiveReadingDate
      );

    const lastMonthConsumptionPeak =
      await DashboardRepository.findLastMonthConsumptionPeak(
        effectiveReadingDate
      );

    const rawMonthKWh = currentMonthConsumption?.kWh ?? 0;
    const monthKWh = this.applyCalibration(rawMonthKWh, factor, calibrate);

    const currentMonthPeakKWh = this.applyCalibration(
      currentMonthConsumptionPeak?.kWh ?? 0,
      factor,
      calibrate
    );
    const lastMonthPeakKWh = this.applyCalibration(
      lastMonthConsumptionPeak?.kWh ?? 0,
      factor,
      calibrate
    );

    const currentMonthPeakKWhPrice = currentMonthConsumptionPeak?.kWh
      ? currentMonthPeakKWh * tariff.kWhPriceTaxes
      : 0;
    const lastMonthPeakKWhPrice = lastMonthConsumptionPeak?.kWh
      ? lastMonthPeakKWh * tariff.kWhPriceTaxes
      : 0;

    const energyConsumptionPrice = monthKWh * tariff.kWhTEPrice;
    const tusdPrice = monthKWh * tariff.kWhTUSDPrice;
    const extraTaxes =
      monthKWh * tariff.kWhPriceTaxes - (energyConsumptionPrice + tusdPrice);

    return {
      energyConsumptionPrice,
      energyConsumptionInKWh: monthKWh,
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

  getMonthlyForecast = async (
    calibrate: boolean = false
  ): Promise<MonthlyForecastResponse | undefined> => {
    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    const factor = tariff.calibrationFactor ?? 1.0;
    const effectiveReadingDate = tariff.lastReading;

    const last15DaysConsumption =
      await DashboardRepository.getLast15DaysConsumption();

    if (!last15DaysConsumption) {
      throw new Error("Consumo diário não encontrado.");
    }

    const lastMonthConsumption =
      await DashboardRepository.findLastMonthConsumption(tariff.lastReading);

    const consumptionAverageLast15Days =
      last15DaysConsumption.reduce((acc, day) => acc + day.kWh, 0) /
      last15DaysConsumption.length;

    const daysLeftToFinishMonth = differenceInDays(
      tariff.nextReadingDate,
      new Date()
    );

    const currentMonthConsumption =
      await DashboardRepository.findCurrentMonthConsumption(
        effectiveReadingDate
      );

    const currentKwhConsumption = this.applyCalibration(
      currentMonthConsumption?.kWh ?? 0,
      factor,
      calibrate
    );

    const calibratedAverage = this.applyCalibration(
      consumptionAverageLast15Days,
      factor,
      calibrate
    );

    const currentMonthForecastInKWh =
      calibratedAverage * daysLeftToFinishMonth + currentKwhConsumption;

    const currentMonthForecast = currentMonthForecastInKWh * tariff.kWhPrice;
    const currentMonthForecastWithTaxes =
      currentMonthForecastInKWh * tariff.kWhPriceTaxes;

    const pastMonthConsumptionInKWh = this.applyCalibration(
      lastMonthConsumption?.kWh ?? 0,
      factor,
      calibrate
    );
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

  getLast6MonthsHistory = async (
    calibrate: boolean = false
  ): Promise<LastSemesterHistoryResponse | undefined> => {
    const tariff = await DashboardRepository.findTariff();

    if (!tariff) {
      throw new Error("Tarifa não encontrada.");
    }

    const factor = tariff.calibrationFactor ?? 1.0;
    const effectiveReadingDate = tariff.lastReading;

    const last6MonthsConsumption =
      await DashboardRepository.getLast6MonthsConsumption(effectiveReadingDate);

    if (!last6MonthsConsumption)
      throw new Error("Consumo mensal não encontrado.");

    const last6MonthsConsumptionFromPastYear =
      await DashboardRepository.getLast6MonthsConsumptionFromPastYear(
        effectiveReadingDate
      );

    const history: LastSemesterHistoryResponse["history"] =
      last6MonthsConsumption.map((consumption) => ({
        month: consumption.createdAt,
        currentKWh: this.applyCalibration(consumption.kWh, factor, calibrate),
      }));

    last6MonthsConsumptionFromPastYear?.forEach((pastYearConsumption) => {
      const indexForInsertion = history.findIndex((item) =>
        isSameMonthNoYear(item.month, pastYearConsumption.createdAt)
      );

      if (indexForInsertion === -1) return;

      history[indexForInsertion].pastYearKWh = this.applyCalibration(
        pastYearConsumption.kWh,
        factor,
        calibrate
      );
    });

    return {
      history,
    };
  };

  getLastHourHistory = async (
    calibrate: boolean = false
  ): Promise<LastHourHistoryResponse | undefined> => {
    const tariff = await DashboardRepository.findTariff();
    const factor = tariff?.calibrationFactor ?? 1.0;

    const lastHourPerMinuteConsumption =
      await DashboardRepository.getLastHourHistoryPerMinute();

    if (!lastHourPerMinuteConsumption)
      throw new Error("Consumo não encontrado.");

    const history = lastHourPerMinuteConsumption.map((consumption) => ({
      minute: consumption.createdAt,
      KW: this.applyCalibration(consumption.kW, factor, calibrate),
    }));

    return {
      history,
    };
  };

  getLastDayHistory = async (
    calibrate: boolean = false
  ): Promise<LastDayHistoryResponse | undefined> => {
    const tariff = await DashboardRepository.findTariff();
    const factor = tariff?.calibrationFactor ?? 1.0;

    const lastDayHourlyConsumption =
      await DashboardRepository.getLastDayHistoryHourly();

    if (!lastDayHourlyConsumption) throw new Error("Consumo não encontrado.");

    const history = lastDayHourlyConsumption.map((consumption) => ({
      hour: consumption.createdAt,
      KWh: this.applyCalibration(consumption.kWh, factor, calibrate),
    }));

    return {
      history,
    };
  };

  getLastMonthHistory = async (
    calibrate: boolean = false
  ): Promise<LastMonthHistoryResponse | undefined> => {
    const tariff = await DashboardRepository.findTariff();
    const factor = tariff?.calibrationFactor ?? 1.0;

    const lastMonthDailyConsumption =
      await DashboardRepository.getLastMonthDaily();

    if (!lastMonthDailyConsumption) throw new Error("Consumo não encontrado.");

    const history = lastMonthDailyConsumption.map((consumption) => ({
      day: consumption.createdAt,
      KWh: this.applyCalibration(consumption.kWh, factor, calibrate),
    }));

    return {
      history,
    };
  };
}

export default new DashboardService();
