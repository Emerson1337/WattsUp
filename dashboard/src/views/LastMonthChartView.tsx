"use client";

import { BarChartInteractive } from "@/components/charts/BarChartInteractive";
import type { ChartConfig } from "@/components/ui/chart";
import { useDataLayer } from "@/components/context/DataLayerContext";
import { format } from "date-fns";

const chartConfig: ChartConfig = {
  consumption: {
    label: "Consumo",
    color: "var(--chart-4)",
  },
};

export default function LastMonthChartView() {
  const { state } = useDataLayer();
  const { lastMonthDailyConsumption, lastMonthDailyConsumptionIsLoading } =
    state;

  const lastHourData =
    lastMonthDailyConsumption?.map((item) => ({
      date: format(item.day, "dd/MM"),
      consumption: item.KWh,
    })) ?? [];

  return (
    <BarChartInteractive
      isLoading={lastMonthDailyConsumptionIsLoading}
      title="Consumo - Último mês"
      description="Confira o consumo do último mês, com dados por dia."
      data={lastHourData}
      dateKey="date"
      unit="kWh"
      chartConfig={chartConfig}
      initialActiveChart="consumption"
      totalLabel="Consumo total"
    />
  );
}
