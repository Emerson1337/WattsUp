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
  energyConsumptionInKWh: number;
  currentMonthPeak: {
    date?: Date;
    currentMonthPeakKWh: number;
    currentMonthPeakKWhPrice: number;
  };
  lastMonthPeak: {
    date?: Date;
    lastMonthPeakKWh: number;
    lastMonthPeakKWhPrice: number;
  };
}

export interface LastSemesterHistoryResponse {
  history: {
    month: Date;
    currentKWh: number;
    pastYearKWh?: number;
  }[];
}

export interface LastHourHistoryResponse {
  history: {
    minute: Date;
    KW: number;
  }[];
}

export interface LastDayHistoryResponse {
  history: {
    hour: Date;
    KWh: number;
  }[];
}

export interface LastMonthHistoryResponse {
  history: {
    day: Date;
    KWh: number;
  }[];
}
