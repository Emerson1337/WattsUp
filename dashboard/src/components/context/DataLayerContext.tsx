"use client";

import { Tariff, MonthlyReport, MonthlyReportForecast } from "@/services/types";
import { useEffect } from "react";
import {
  fetchTariff,
  fetchMonthlyReport,
  fetchMonthlyReportForecast,
} from "@/services/facade";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";

interface State {
  tariff: Tariff | undefined;
  tariffIsLoading: boolean;
  monthlyReport: MonthlyReport | undefined;
  monthlyReportIsLoading: boolean;
  monthlyReportForecast: MonthlyReportForecast | undefined;
  monthlyReportForecastIsLoading: boolean;
}

type Action =
  | { type: "SET_TARIFF"; payload?: Tariff }
  | { type: "SET_TARIFF_LOADING"; payload: boolean }
  | { type: "SET_MONTHLY_REPORT"; payload?: MonthlyReport }
  | { type: "SET_MONTHLY_REPORT_LOADING"; payload: boolean }
  | { type: "SET_MONTHLY_REPORT_FORECAST"; payload?: MonthlyReportForecast }
  | { type: "SET_MONTHLY_REPORT_FORECAST_LOADING"; payload: boolean };

// Initial state
const initialState: State = {
  tariff: undefined,
  tariffIsLoading: true,
  monthlyReport: undefined,
  monthlyReportIsLoading: true,
  monthlyReportForecast: undefined,
  monthlyReportForecastIsLoading: true,
};

const dataLayerReducer = (state: State, action: Action): State => {
  switch (action.type) {
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
    default:
      const _exhaustiveCheck: never = action;
      throw new Error(`Unhandled action type: ${_exhaustiveCheck}`);
  }
};

const DataLayerContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | null>(null);

export const DataLayerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dataLayerReducer, initialState);

  useEffect(() => {
    const fetchTariffData = async () => {
      try {
        const data = await fetchTariff();
        dispatch({
          type: "SET_TARIFF",
          payload: data,
        });
        dispatch({
          type: "SET_TARIFF_LOADING",
          payload: false,
        });
      } catch (error) {
        console.error("Error fetching tariff data:", error);
      }
    };

    const fetchDataMonthlyReportData = async () => {
      try {
        const data = await fetchMonthlyReport();
        dispatch({
          type: "SET_MONTHLY_REPORT",
          payload: data,
        });
        dispatch({
          type: "SET_MONTHLY_REPORT_LOADING",
          payload: false,
        });
      } catch (error) {
        console.error("Error fetching tariff data:", error);
      }
    };

    const fetchMonthlyReportForecastData = async () => {
      try {
        const data = await fetchMonthlyReportForecast();
        dispatch({
          type: "SET_MONTHLY_REPORT_FORECAST",
          payload: data,
        });
        dispatch({
          type: "SET_MONTHLY_REPORT_FORECAST_LOADING",
          payload: false,
        });
      } catch (error) {
        console.error("Error fetching tariff data:", error);
      }
    };

    fetchTariffData();
    fetchDataMonthlyReportData();
    fetchMonthlyReportForecastData();
  }, []);

  return (
    <DataLayerContext.Provider value={{ state, dispatch }}>
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
