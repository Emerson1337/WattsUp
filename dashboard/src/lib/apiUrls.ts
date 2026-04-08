const API_URL = process.env.NEXT_PUBLIC_API_URL;
const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

const withCalibrate = (url: string, calibrate?: boolean): string =>
  calibrate ? `${url}?calibrate=true` : url;

export const ApiPaths = {
  tariff: {
    get: (): string => `${API_URL}/tariff`,
    update: (id: string): string => `${API_URL}/tariff/${id}`,
  },
  monthlyReport: {
    get: (calibrate?: boolean): string =>
      withCalibrate(`${API_URL}/consumption/monthly`, calibrate),
  },
  monthlyReportForecast: {
    get: (calibrate?: boolean): string =>
      withCalibrate(`${API_URL}/consumption/monthly/forecast`, calibrate),
  },
  history: {
    lastSixMonths: (calibrate?: boolean): string =>
      withCalibrate(`${API_URL}/consumption/monthly/history`, calibrate),
    lastHour: (calibrate?: boolean): string =>
      withCalibrate(`${API_URL}/consumption/last-hour/history`, calibrate),
    lastDay: (calibrate?: boolean): string =>
      withCalibrate(`${API_URL}/consumption/last-day/history`, calibrate),
    lastMonth: (calibrate?: boolean): string =>
      withCalibrate(`${API_URL}/consumption/last-month/history`, calibrate),
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
    get: (calibrate?: boolean): string =>
      withCalibrate(`/consulta/consumo-mensal`, calibrate),
  },
  monthlyReportForecast: {
    get: (calibrate?: boolean): string =>
      withCalibrate(`/consulta/previsao-consumo-mensal`, calibrate),
  },
  history: {
    lastSixMonths: (calibrate?: boolean): string =>
      withCalibrate(`/consulta/historico-consumo-mensal`, calibrate),
    lastHour: (calibrate?: boolean): string =>
      withCalibrate(`/consulta/historico-consumo-por-minuto`, calibrate),
    lastDay: (calibrate?: boolean): string =>
      withCalibrate(`/consulta/historico-consumo-hora`, calibrate),
    lastMonth: (calibrate?: boolean): string =>
      withCalibrate(`/consulta/historico-consumo-mes`, calibrate),
  },
};
