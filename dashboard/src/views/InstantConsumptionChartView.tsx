"use client";

import { useEffect, useState } from "react";
import { AreaChartInteractive } from "@/components/charts/AreaChartInteractive";
import { type ChartConfig } from "@/components/ui/chart";
import { listenToSocket } from "@/services/api";
import { useDataLayer } from "@/components/context/DataLayerContext";
import { OneMinuteConsumptionMock } from "@/lib/utils";

const chartConfig = {
  consumption: {
    label: "Consumo instantâneo (Watts)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function InstantConsumptionChartView() {
  const { state } = useDataLayer();
  const { instantConsumptionSocket } = state;
  const [data, setData] = useState<{ consumption: number }[]>(
    OneMinuteConsumptionMock()
  );
  const [error, setError] = useState<Event>();

  useEffect(() => {
    if (!instantConsumptionSocket) return;

    listenToSocket(
      instantConsumptionSocket,
      (telemetryMessage) =>
        setData([
          ...data,
          {
            consumption: telemetryMessage.power,
          },
        ]),
      setError
    );

    if (error) {
      console.error("Error connecting to live data:", error);
    }
  }, [data, error, instantConsumptionSocket]);

  return (
    <AreaChartInteractive
      data={data}
      config={chartConfig}
      tooltipUnit="W"
      title="Consumo instantâneo"
      description={`Atualizado a cada segundo`}
    />
  );
}
