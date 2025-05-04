"use client";

import { BarChartInteractive } from "@/components/charts/BarChartInteractive";
import type { ChartConfig } from "@/components/ui/chart";
import { useDataLayer } from "@/components/context/DataLayerContext";
import { format } from "date-fns";

const chartConfig: ChartConfig = {
  consumption: {
    label: "Consumo",
    color: "var(--chart-2)",
  },
};

export default function LastHourChartView() {
  const { state } = useDataLayer();
  const {
    lastHourPerMinuteConsumption,
    lastHourPerMinuteConsumptionIsLoading,
  } = state;

  const lastHourData =
    lastHourPerMinuteConsumption?.map((item) => ({
      date: format(item.minute, "HH:mm"),
      consumption: item.KW,
    })) ?? [];

  return (
    <BarChartInteractive
      isLoading={lastHourPerMinuteConsumptionIsLoading}
      title="Consumo - Última hora"
      description="Consumo na última hora"
      data={lastHourData}
      dateKey="date"
      unit="kW"
      chartConfig={chartConfig}
      initialActiveChart="consumption"
      totalLabel="Consumo total"
    />
  );
}
