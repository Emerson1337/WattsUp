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

export async function fetchMonthlyReport() {
  return await getMonthlyReport();
}

export async function fetchMonthlyReportForecast() {
  return await getMonthlyReportForecast();
}

export async function fetchLastSixMonthsReport() {
  return await getLastSixMonthsReport();
}

export async function fetchLastHourPerMinute() {
  return await getLastHourPerMinute();
}

export async function fetchLastDayHourly() {
  return await getLastDayHourly();
}

export async function fetchLastMonthDaily() {
  return await getLastMonthDaily();
}
