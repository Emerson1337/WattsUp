"use client";

import { RadialChartText } from "@/components/charts/RadialChart";
import type { ChartConfig } from "@/components/ui/chart";
import { useDataLayer } from "@/components/context/DataLayerContext";

const chartConfig = {
  consumption: {
    label: "Consumo",
  },
} satisfies ChartConfig;

export default function MonthlyConsumptionChartView() {
  const { state } = useDataLayer();
  const {
    monthlyReport,
    monthlyReportIsLoading,
    monthlyReportForecast,
    monthlyReportForecastIsLoading,
  } = state;

  const currentEnergyConsumptionInKWh =
    monthlyReport?.energyConsumptionInKWh ?? 0;

  const currentEnergyConsumptionForecastInKWh =
    monthlyReportForecast?.currentMonthForecastInKWh ?? 0;

  const lastMonthEnergyConsumptionInKWh =
    monthlyReportForecast?.pastMonthConsumptionInKWh ?? 0;

  const growthExpectationInKWh = lastMonthEnergyConsumptionInKWh
    ? currentEnergyConsumptionInKWh / lastMonthEnergyConsumptionInKWh - 1
    : 0;

  const radialData = {
    consumption: currentEnergyConsumptionInKWh.toFixed(2),
    fill: "var(--chart-2)",
  };

  return (
    <RadialChartText
      isLoading={monthlyReportIsLoading || monthlyReportForecastIsLoading}
      title="Consumo mensal"
      periodDescription="Consumo no mês atual"
      data={radialData}
      total={currentEnergyConsumptionForecastInKWh}
      unit="kWh"
      valueKey="consumption"
      chartConfig={chartConfig}
      trendText={
        growthExpectationInKWh
          ? `"Expectativa de aumento em ${growthExpectationInKWh.toFixed(
              1
            )}% esse mês."`
          : `Observe o quão perto o seu consumo está do previsto.`
      }
      footerDescription={`Esse é o consumo total no mês atual. A sua previsão de consumo é de ${monthlyReportForecast?.currentMonthForecastInKWh.toFixed(
        2
      )} kWh até o fim desse mês.`}
    />
  );
}
