export interface MonthlyForecastResponse {
  currentMonthForecastInKWh: number;
  pastMonthConsumption: number;
  currentMonthForecast: number;
  pastMonthConsumptionInKWh: number;
  currentMonthForecastWithTaxes: number;
  pastMonthConsumptionWithTaxes: number;
}

export interface MonthlyConsumptionResponse {
  energyConsumptionPrice: number;
  taxesPrice: number;
  publicLighting: number;
  currentMonthPeakKWh: number;
  currentMonthPeakKWhPrice: number;
}

export interface LastSemesterHistoryResponse {
  history: {
    month: Date;
    currentKWh: number;
    pastYearKWh?: number;
  }[];
}
