const API_URL = process.env.NEXT_PUBLIC_API_URL;
const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

export const ApiPaths = {
  tariff: {
    get: (): string => `${API_URL}/tariff`,
    update: (id: string): string => `${API_URL}/tariff/${id}`,
  },
  monthlyReport: {
    get: (): string => `${API_URL}/consumption/monthly`,
  },
  monthlyReportForecast: {
    get: (): string => `${API_URL}/consumption/monthly/forecast`,
  },
  history: {
    lastSixMonths: (): string => `${API_URL}/consumption/monthly/history`,
    lastHour: (): string => `${API_URL}/consumption/last-hour/history`,
    lastDay: (): string => `${API_URL}/consumption/last-day/history`,
    lastMonth: (): string => `${API_URL}/consumption/last-month/history`,
  },
  websocket: {
    telemetry: (): string => `${WS_URL}/telemetry?token=esp32-iot-key`,
  },
};

export const NextApiPaths = {
  tariff: {
    get: (): string => `/consulta/tarifa`,
    update: (id: string): string => `/consulta/tarifa/${id}`,
  },
  monthlyReport: {
    get: (): string => `/consulta/consumo-mensal`,
  },
  monthlyReportForecast: {
    get: (): string => `/consulta/previsao-consumo-mensal`,
  },
  history: {
    lastSixMonths: (): string => `/consulta/historico-consumo-mensal`,
    lastHour: (): string => `/consulta/historico-consumo-por-minuto`,
    lastDay: (): string => `/consulta/historico-consumo-hora`,
    lastMonth: (): string => `/consulta/historico-consumo-mes`,
  },
};
