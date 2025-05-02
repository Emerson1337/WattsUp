import {
  getTariff,
  getMonthlyReport,
  getMonthlyReportForecast,
  getLastSixMonthsReport,
  getLastHourPerMinute,
} from "@/services/api";

export async function fetchTariff() {
  return await getTariff();
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
