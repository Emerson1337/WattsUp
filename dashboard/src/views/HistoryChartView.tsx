"use client";

import { SimpleBarChartMultiple } from "@/components/charts/SimpleBarChartMultiple";
import type { ChartConfig } from "@/components/ui/chart";
import { useDataLayer } from "@/components/context/DataLayerContext";
import { format } from "date-fns";

const chartConfig: ChartConfig = {
  past: {
    label: "Ano passado",
    color: "var(--chart-3)",
  },
  current: {
    label: "Ano atual",
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

  const lastEntry = dataHistory[dataHistory.length - 1];

  const trendPercentage =
    lastEntry?.past > 0
      ? (lastEntry.current / lastEntry.past) * 100
      : undefined;

  return (
    <SimpleBarChartMultiple
      isLoading={lastSixMonthsConsumptionIsLoading}
      title="Consumo - Histórico (kWh)"
      description="Últimos 6 meses"
      data={dataHistory}
      chartConfig={chartConfig}
      barKeys={["past", "current"]}
      tooltipUnit="kWh"
      trendPercentage={trendPercentage}
      trendText={
        trendPercentage
          ? `Houve aumento de ${lastEntry.current.toFixed(1)}% esse mês.`
          : "Seu consumo tem aumentado."
      }
      footerText="Este gráfico é atualizado mensalmente e disponibiliza o consumo dos últimos meses."
    />
  );
}
