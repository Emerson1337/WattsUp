export interface Tariff {
  id: string;
  kWhPrice: number;
  kWhPriceTaxes: number;
  publicLightingPrice: number;
  description: string;
  state: string;
  lastReading: Date;
  effectiveReadingDay: number;
  effectiveMonth: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlyReport {
  energyConsumptionPrice: number;
  energyConsumptionInKWh: number;
  taxesPrice: number;
  publicLighting: number;
  currentMonthPeak: CurrentMonthPeak;
  lastMonthPeak: LastMonthPeak;
}

interface CurrentMonthPeak {
  date: Date;
  currentMonthPeakKWh: number;
  currentMonthPeakKWhPrice: number;
}

interface LastMonthPeak {
  date?: Date;
  lastMonthPeakKWh: number;
  lastMonthPeakKWhPrice: number;
}

export interface MonthlyReportForecast {
  currentMonthForecastInKWh: number;
  currentMonthForecast: number;
  currentMonthForecastWithTaxes: number;
  pastMonthConsumptionInKWh: number;
  pastMonthConsumption: number;
  pastMonthConsumptionWithTaxes: number;
}

export interface TelemetryMessage {
  power: number;
  current: number;
  voltage: number;
}

export interface LastSixMonthsHistory {
  history: MonthsHistory[];
}

export interface MonthsHistory {
  month: Date;
  currentKWh: number;
  pastYearKWh?: number;
}

export interface LastHourHistory {
  history: PerMinuteHistory[];
}

export interface PerMinuteHistory {
  minute: Date;
  KW: number;
}

export interface LastDayHistory {
  history: LastDayHourlyHistory[];
}

export interface LastDayHourlyHistory {
  hour: Date;
  KWh: number;
}
