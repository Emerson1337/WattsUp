"use client";

import { useEffect, useState } from "react";
import { AreaChartInteractive } from "@/components/charts/AreaChartInteractive";
import { type ChartConfig } from "@/components/ui/chart";
import { listenToSocket } from "@/services/api";
import { useDataLayer } from "@/components/context/DataLayerContext";
import { OneMinuteConsumptionMock } from "@/lib/utils";
import { parseISO, differenceInMilliseconds } from "date-fns";

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
      (telemetryMessage) => {
        const esp32Datetime = telemetryMessage.timestamp; // ISO 8601 string
        const espDate = parseISO(esp32Datetime);
        const now = new Date();

        const transmissionTime = differenceInMilliseconds(now, espDate);

        console.log(`[PERFORMANCE] Transmission time: ${transmissionTime}ms`);

        setData([
          ...data,
          {
            consumption: telemetryMessage.power,
          },
        ]);
      },
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
      liveBadge
      tooltipUnit="W"
      title="Consumo instantâneo"
      description={`Atualizado a cada segundo`}
    />
  );
}
