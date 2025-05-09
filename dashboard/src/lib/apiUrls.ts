const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000";

export const ApiPaths = {
  tariff: {
    get: (): string => `${API_URL}/api/tariff`,
  },
  monthlyReport: {
    get: (): string => `${API_URL}/api/consumption/monthly`,
  },
  monthlyReportForecast: {
    get: (): string => `${API_URL}/api/consumption/monthly/forecast`,
  },
  history: {
    lastSixMonths: (): string => `${API_URL}/api/consumption/monthly/history`,
    lastHour: (): string => `${API_URL}/api/consumption/last-hour/history`,
    lastDay: (): string => `${API_URL}/api/consumption/last-day/history`,
    lastMonth: (): string => `${API_URL}/api/consumption/last-month/history`,
  },
  websocket: {
    telemetry: (): string => `${WS_URL}/telemetry?token=esp32-iot-key`,
  },
};
