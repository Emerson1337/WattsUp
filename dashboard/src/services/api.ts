import { Tariff, MonthlyReport, MonthlyReportForecast } from "@/services/types";

export async function getTariff(): Promise<Tariff | undefined> {
  try {
    const res = await fetch("/api/tariff");

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getMonthlyReport(): Promise<MonthlyReport | undefined> {
  try {
    const res = await fetch("/api/monthly-report");

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}

export async function getMonthlyReportForecast(): Promise<
  MonthlyReportForecast | undefined
> {
  try {
    const res = await fetch("/api/monthly-report-forecast");

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred."
    );
  }
}
