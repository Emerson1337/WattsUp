"use client";

import { SimpleBarChartMultiple } from "@/components/charts/SimpleBarChartMultiple";
import type { ChartConfig } from "@/components/ui/chart";
import { useDataLayer } from "@/components/context/DataLayerContext";
import { format } from "date-fns";

const chartConfig: ChartConfig = {
  past: {
    label: "Passado",
    color: "var(--chart-3)",
  },
  current: {
    label: "Atual",
    color: "var(--chart-2)",
  },
};

export default function HistoryChartView() {
  const { state } = useDataLayer();
  const { lastSixMonthsConsumption, lastSixMonthsConsumptionIsLoading } = state;

  const dataHistory =
    lastSixMonthsConsumption?.map((item) => ({
      month: format(item.month, "MMM yyyy"),
      past: item?.pastYearKWh ?? 0,
      current: item.currentKWh,
    })) ?? [];

  return (
    <SimpleBarChartMultiple
      isLoading={lastSixMonthsConsumptionIsLoading}
      title="Histórico - Consumo (kWh)"
      description="Últimos 6 meses"
      data={dataHistory}
      chartConfig={chartConfig}
      barKeys={["past", "current"]}
      tooltipUnit="kWh"
      trendPercentage={5.2}
      trendText="Aumento em relação ao mês do ano anterior"
      footerText="Consumo nos últimos 6 meses"
    />
  );
}
