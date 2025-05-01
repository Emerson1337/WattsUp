export interface MonthlyForecastResponse {
  currentMonthForecastInKWh: number;
  pastMonthConsumption: number;
  currentMonthForecast: number;
  pastMonthConsumptionInKWh: number;
  currentMonthForecastWithTaxes: number;
  pastMonthConsumptionWithTaxes: number;
}

export interface MonthlyConsumptionResponse {
  energyConsumption: number;
  taxes: number;
  publicLighting: number;
  currentMonthPeakKWh: number;
  currentMonthPeakKWhPrice: number;
}
