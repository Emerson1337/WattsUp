const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000";

export const ApiPaths = {
  tariff: {
    get: (): string => `${API_URL}/tariff`,
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
