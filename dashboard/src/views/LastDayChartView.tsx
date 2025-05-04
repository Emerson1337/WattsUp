"use client";

import { BarChartInteractive } from "@/components/charts/BarChartInteractive";
import type { ChartConfig } from "@/components/ui/chart";
import { useDataLayer } from "@/components/context/DataLayerContext";
import { format } from "date-fns";

const chartConfig: ChartConfig = {
  consumption: {
    label: "Consumo",
    color: "var(--chart-3)",
  },
};

export default function LastDayChartView() {
  const { state } = useDataLayer();
  const { lastDayHourlyConsumption, lastDayHourlyConsumptionIsLoading } = state;

  const lastHourData =
    lastDayHourlyConsumption?.map((item) => ({
      date: format(item.hour, "HH:mm"),
      consumption: item.KWh,
    })) ?? [];

  return (
    <BarChartInteractive
      isLoading={lastDayHourlyConsumptionIsLoading}
      title="Consumo - Último dia"
      description="Consumo nas últimas 24h"
      data={lastHourData}
      dateKey="date"
      unit="kWh"
      chartConfig={chartConfig}
      initialActiveChart="consumption"
      totalLabel="Consumo total"
    />
  );
}
