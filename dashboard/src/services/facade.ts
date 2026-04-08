import {
  getTariff,
  updateTariff as updateTariffApi,
  getMonthlyReport,
  getMonthlyReportForecast,
  getLastSixMonthsReport,
  getLastHourPerMinute,
  getLastDayHourly,
  getLastMonthDaily,
} from "@/services/api";
import { Tariff } from "@/services/types";

export async function fetchTariff() {
  return await getTariff();
}

export async function updateTariff(id: string, tariff: Partial<Tariff>) {
  return await updateTariffApi(id, tariff);
}

export async function fetchMonthlyReport(calibrate?: boolean) {
  return await getMonthlyReport(calibrate);
}

export async function fetchMonthlyReportForecast(calibrate?: boolean) {
  return await getMonthlyReportForecast(calibrate);
}

export async function fetchLastSixMonthsReport(calibrate?: boolean) {
  return await getLastSixMonthsReport(calibrate);
}

export async function fetchLastHourPerMinute(calibrate?: boolean) {
  return await getLastHourPerMinute(calibrate);
}

export async function fetchLastDayHourly(calibrate?: boolean) {
  return await getLastDayHourly(calibrate);
}

export async function fetchLastMonthDaily(calibrate?: boolean) {
  return await getLastMonthDaily(calibrate);
}
