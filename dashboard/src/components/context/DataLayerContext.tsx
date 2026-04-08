"use client";

import {
  Tariff,
  MonthlyReport,
  MonthlyReportForecast,
  MonthsHistory,
  PerMinuteHistory,
  LastDayHourlyHistory,
  LastMonthDailyHistory,
} from "@/services/types";
import { useEffect, useCallback } from "react";
import { openWSConnetionInstantConsumption } from "@/services/api";
import {
  fetchTariff,
  fetchMonthlyReport,
  fetchLastSixMonthsReport,
  fetchMonthlyReportForecast,
  fetchLastHourPerMinute,
  fetchLastDayHourly,
  fetchLastMonthDaily,
} from "@/services/facade";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";

const CALIBRATE_STORAGE_KEY = "wattsup-calibrate";

interface State {
  calibrate: boolean;
  tariff: Tariff | undefined;
  tariffIsLoading: boolean;
  monthlyReport: MonthlyReport | undefined;
  monthlyReportIsLoading: boolean;
  monthlyReportForecast: MonthlyReportForecast | undefined;
  monthlyReportForecastIsLoading: boolean;
  instantConsumptionSocket: WebSocket | undefined;
  lastSixMonthsConsumption: MonthsHistory[] | undefined;
  lastSixMonthsConsumptionIsLoading: boolean;
  lastHourPerMinuteConsumption: PerMinuteHistory[] | undefined;
  lastHourPerMinuteConsumptionIsLoading: boolean;
  lastDayHourlyConsumption: LastDayHourlyHistory[] | undefined;
  lastDayHourlyConsumptionIsLoading: boolean;
  lastMonthDailyConsumption: LastMonthDailyHistory[] | undefined;
  lastMonthDailyConsumptionIsLoading: boolean;
}

type Action =
  | { type: "SET_CALIBRATE"; payload: boolean }
  | { type: "SET_TARIFF"; payload?: Tariff }
  | { type: "SET_TARIFF_LOADING"; payload: boolean }
  | { type: "SET_MONTHLY_REPORT"; payload?: MonthlyReport }
  | { type: "SET_MONTHLY_REPORT_LOADING"; payload: boolean }
  | { type: "SET_MONTHLY_REPORT_FORECAST"; payload?: MonthlyReportForecast }
  | { type: "SET_MONTHLY_REPORT_FORECAST_LOADING"; payload: boolean }
  | { type: "SET_INSTANT_CONSUMPTION_SOCKET"; payload?: WebSocket }
  | { type: "SET_LAST_SIX_MONTHS_CONSUMPTION"; payload?: MonthsHistory[] }
  | { type: "SET_LAST_SIX_MONTHS_CONSUMPTION_LOADING"; payload: boolean }
  | {
      type: "SET_LAST_HOUR_PER_MINUTE_CONSUMPTION";
      payload?: PerMinuteHistory[];
    }
  | { type: "SET_LAST_HOUR_PER_MINUTE_CONSUMPTION_LOADING"; payload: boolean }
  | {
      type: "SET_LAST_DAY_HOURLY_CONSUMPTION";
      payload?: LastDayHourlyHistory[];
    }
  | { type: "SET_LAST_DAY_HOURLY_CONSUMPTION_LOADING"; payload: boolean }
  | {
      type: "SET_LAST_MONTH_DAILY_CONSUMPTION";
      payload?: LastMonthDailyHistory[];
    }
  | { type: "SET_LAST_MONTH_DAILY_CONSUMPTION_LOADING"; payload: boolean };

const getInitialCalibrate = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CALIBRATE_STORAGE_KEY) === "true";
};

// Initial state
const initialState: State = {
  calibrate: false,
  tariff: undefined,
  tariffIsLoading: true,
  monthlyReport: undefined,
  monthlyReportIsLoading: true,
  monthlyReportForecast: undefined,
  monthlyReportForecastIsLoading: true,
  instantConsumptionSocket: undefined,
  lastSixMonthsConsumption: undefined,
  lastSixMonthsConsumptionIsLoading: true,
  lastHourPerMinuteConsumption: undefined,
  lastHourPerMinuteConsumptionIsLoading: true,
  lastDayHourlyConsumption: undefined,
  lastDayHourlyConsumptionIsLoading: true,
  lastMonthDailyConsumption: undefined,
  lastMonthDailyConsumptionIsLoading: true,
};

const dataLayerReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CALIBRATE":
      return { ...state, calibrate: action.payload };
    case "SET_TARIFF":
      return { ...state, tariff: action.payload };
    case "SET_TARIFF_LOADING":
      return { ...state, tariffIsLoading: action.payload };
    case "SET_MONTHLY_REPORT":
      return { ...state, monthlyReport: action.payload };
    case "SET_MONTHLY_REPORT_LOADING":
      return { ...state, monthlyReportIsLoading: action.payload };
    case "SET_MONTHLY_REPORT_FORECAST":
      return { ...state, monthlyReportForecast: action.payload };
    case "SET_MONTHLY_REPORT_FORECAST_LOADING":
      return { ...state, monthlyReportForecastIsLoading: action.payload };
    case "SET_INSTANT_CONSUMPTION_SOCKET":
      return { ...state, instantConsumptionSocket: action.payload };
    case "SET_LAST_SIX_MONTHS_CONSUMPTION":
      return { ...state, lastSixMonthsConsumption: action.payload };
    case "SET_LAST_SIX_MONTHS_CONSUMPTION_LOADING":
      return { ...state, lastSixMonthsConsumptionIsLoading: action.payload };
    case "SET_LAST_HOUR_PER_MINUTE_CONSUMPTION":
      return { ...state, lastHourPerMinuteConsumption: action.payload };
    case "SET_LAST_HOUR_PER_MINUTE_CONSUMPTION_LOADING":
      return {
        ...state,
        lastHourPerMinuteConsumptionIsLoading: action.payload,
      };
    case "SET_LAST_DAY_HOURLY_CONSUMPTION":
      return { ...state, lastDayHourlyConsumption: action.payload };
    case "SET_LAST_DAY_HOURLY_CONSUMPTION_LOADING":
      return {
        ...state,
        lastDayHourlyConsumptionIsLoading: action.payload,
      };
    case "SET_LAST_MONTH_DAILY_CONSUMPTION":
      return { ...state, lastMonthDailyConsumption: action.payload };
    case "SET_LAST_MONTH_DAILY_CONSUMPTION_LOADING":
      return {
        ...state,
        lastMonthDailyConsumptionIsLoading: action.payload,
      };
    default:
      const _exhaustiveCheck: never = action;
      throw new Error(`Unhandled action type: ${_exhaustiveCheck}`);
  }
};

const DataLayerContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
  refetchConsumptionData: (calibrate: boolean) => void;
} | null>(null);

export const DataLayerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dataLayerReducer, initialState);

  const fetchConsumptionData = useCallback(async (calibrate: boolean) => {
    dispatch({ type: "SET_MONTHLY_REPORT_LOADING", payload: true });
    dispatch({ type: "SET_MONTHLY_REPORT_FORECAST_LOADING", payload: true });
    dispatch({
      type: "SET_LAST_SIX_MONTHS_CONSUMPTION_LOADING",
      payload: true,
    });
    dispatch({
      type: "SET_LAST_HOUR_PER_MINUTE_CONSUMPTION_LOADING",
      payload: true,
    });
    dispatch({ type: "SET_LAST_DAY_HOURLY_CONSUMPTION_LOADING", payload: true });
    dispatch({
      type: "SET_LAST_MONTH_DAILY_CONSUMPTION_LOADING",
      payload: true,
    });

    const fetchDataMonthlyReportData = async () => {
      try {
        const data = await fetchMonthlyReport(calibrate);
        dispatch({ type: "SET_MONTHLY_REPORT", payload: data });
      } catch (error) {
        console.error("Erro ao consultar relatório mensal:", error);
      } finally {
        dispatch({ type: "SET_MONTHLY_REPORT_LOADING", payload: false });
      }
    };

    const fetchMonthlyReportForecastData = async () => {
      try {
        const data = await fetchMonthlyReportForecast(calibrate);
        dispatch({ type: "SET_MONTHLY_REPORT_FORECAST", payload: data });
      } catch (error) {
        console.error("Erro ao consultar previsão de consumo:", error);
      } finally {
        dispatch({
          type: "SET_MONTHLY_REPORT_FORECAST_LOADING",
          payload: false,
        });
      }
    };

    const fetchLastSixMonthsConsumptionData = async () => {
      try {
        const data = await fetchLastSixMonthsReport(calibrate);
        dispatch({
          type: "SET_LAST_SIX_MONTHS_CONSUMPTION",
          payload: data?.history,
        });
      } catch (error) {
        console.error("Erro ao consultar histórico do último semestre:", error);
      } finally {
        dispatch({
          type: "SET_LAST_SIX_MONTHS_CONSUMPTION_LOADING",
          payload: false,
        });
      }
    };

    const fetchLastHourPerMinuteData = async () => {
      try {
        const data = await fetchLastHourPerMinute(calibrate);
        dispatch({
          type: "SET_LAST_HOUR_PER_MINUTE_CONSUMPTION",
          payload: data?.history,
        });
      } catch (error) {
        console.error("Erro ao consultar consumo na última hora:", error);
      } finally {
        dispatch({
          type: "SET_LAST_HOUR_PER_MINUTE_CONSUMPTION_LOADING",
          payload: false,
        });
      }
    };

    const fetchLastDayHourlyData = async () => {
      try {
        const data = await fetchLastDayHourly(calibrate);
        dispatch({
          type: "SET_LAST_DAY_HOURLY_CONSUMPTION",
          payload: data?.history,
        });
      } catch (error) {
        console.error("Erro ao consultar consumo nas últimas 24h:", error);
      } finally {
        dispatch({
          type: "SET_LAST_DAY_HOURLY_CONSUMPTION_LOADING",
          payload: false,
        });
      }
    };

    const fetchLastMonthDailyData = async () => {
      try {
        const data = await fetchLastMonthDaily(calibrate);
        dispatch({
          type: "SET_LAST_MONTH_DAILY_CONSUMPTION",
          payload: data?.history,
        });
      } catch (error) {
        console.error("Erro ao consultar consumo no último mês:", error);
      } finally {
        dispatch({
          type: "SET_LAST_MONTH_DAILY_CONSUMPTION_LOADING",
          payload: false,
        });
      }
    };

    fetchDataMonthlyReportData();
    fetchMonthlyReportForecastData();
    fetchLastSixMonthsConsumptionData();
    fetchLastHourPerMinuteData();
    fetchLastDayHourlyData();
    fetchLastMonthDailyData();
  }, []);

  useEffect(() => {
    const savedCalibrate = getInitialCalibrate();
    dispatch({ type: "SET_CALIBRATE", payload: savedCalibrate });

    const fetchTariffData = async () => {
      try {
        const data = await fetchTariff();
        dispatch({ type: "SET_TARIFF", payload: data });
      } catch (error) {
        console.error("Erro ao consultar tarifa:", error);
      } finally {
        dispatch({ type: "SET_TARIFF_LOADING", payload: false });
      }
    };

    const fetchInstantConsumptionData = () => {
      try {
        const socket = openWSConnetionInstantConsumption();

        dispatch({
          type: "SET_INSTANT_CONSUMPTION_SOCKET",
          payload: socket,
        });
      } catch (error) {
        console.error("Erro ao abrir conexão em tempo real:", error);
      }
    };

    fetchTariffData();
    fetchConsumptionData(savedCalibrate);
    fetchInstantConsumptionData();
  }, [fetchConsumptionData]);

  const refetchConsumptionData = useCallback(
    (calibrate: boolean) => {
      localStorage.setItem(CALIBRATE_STORAGE_KEY, String(calibrate));
      dispatch({ type: "SET_CALIBRATE", payload: calibrate });
      fetchConsumptionData(calibrate);
    },
    [fetchConsumptionData]
  );

  return (
    <DataLayerContext.Provider
      value={{ state, dispatch, refetchConsumptionData }}
    >
      {children}
    </DataLayerContext.Provider>
  );
};

export const useDataLayer = () => {
  const context = useContext(DataLayerContext);
  if (!context) {
    throw new Error("useDataLayer must be used within a DataLayerProvider");
  }
  return context;
};
