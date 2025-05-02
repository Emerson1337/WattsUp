"use client";

import type { ChartConfig } from "@/components/ui/chart";
import { DonutChart } from "@/components/charts/DonutChart";
import { useDataLayer } from "@/components/context/DataLayerContext";

const chartConfig: ChartConfig = {
  energyConsumption: {
    label: "Consumo elétrico",
    color: "var(--chart-1)",
  },
  consumptionWithTaxes: {
    label: "TSDU + TSE",
    color: "var(--chart-2)",
  },
  publicLighting: {
    label: "Iluminação pública",
    color: "var(--chart-3)",
  },
};

export default function TotalPriceChartView() {
  const { state } = useDataLayer();
  const { monthlyReport, monthlyReportIsLoading, tariff, tariffIsLoading } =
    state;

  const taxValueInDecimal = monthlyReport?.taxesPrice ?? 0;
  const energyConsumption = monthlyReport?.energyConsumptionPrice ?? 0;

  const totalPriceData = [
    {
      name: "energyConsumption",
      value: energyConsumption,
      fill: "var(--chart-2)",
    },
    {
      name: "consumptionWithTaxes",
      value: taxValueInDecimal,
      fill: "var(--chart-4)",
    },
    {
      name: "publicLighting",
      value: tariff?.publicLightingPrice ?? 0,
      fill: "var(--chart-3)",
    },
  ];

  return (
    <DonutChart
      isLoading={monthlyReportIsLoading || tariffIsLoading}
      title="Consumo Mensal"
      description="Consumo energético, taxas e custo de iluminação pública."
      data={totalPriceData}
      unit="R$"
      tooltipPrefix="R$"
      chartConfig={chartConfig}
      footerText="Total de consumo nos últimos 30 dias."
    />
  );
}
